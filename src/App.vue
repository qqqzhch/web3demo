<template>
  <div id="app">
    <layoutHead />
    <main class="main-wrapper container mx-auto">
      <router-view v-if="isRouterAlive" />
    </main>
    <!-- <initialWallet /> -->
    <layoutFoot />
    <haveSendDialog ref="haveSendtx" />
  </div>
</template>

<script>
import layoutHead from '@/components/layout/header.vue';
import layoutFoot from '@/components/layout/footer.vue';

import initialWallet from '@/components/basic/initialWallet.vue';
import transactionPool from '@/components/basic/transactionPool.vue';
import event from '@/common/js/event';
export default {
  mixins: [initialWallet, transactionPool],
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  components: {
    layoutHead,
    layoutFoot,
    haveSendDialog: () => import('@/components/basic/haveSendDialog.vue'),
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
    },
  },
  mounted() {
    event.$on('sendSuccess', () => {
      this.$refs.haveSendtx.open('');
    });
  },
};
</script>
<style lang="less" scoped>
#app {
  width: 100%;
  .main-wrapper {
    margin-top: 112px;
    margin-bottom: 60px;
    min-height: calc(100vh - 208px);
  }
}
@media (max-width: 1024px) {
  body {
    max-height: 1069px;
    #app {
      overflow-y: hidden;
      .header-wrapper {
        position: static;
        min-width: 1200px;
      }
      .main-wrapper {
        margin-top: 0px;
        min-width: 1200px;
      }
      .footer-wrapper {
        min-width: 1200px;
      }
    }
  }
}
</style>
