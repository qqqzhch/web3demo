<template>
  <div id="app">
    <layoutHead />
    <main class="main-wrapper container mx-auto">
      <router-view v-if="isRouterAlive" />
    </main>
    <!-- <initialWallet /> -->
    <layoutFoot />
  </div>
</template>

<script>
import layoutHead from '@/components/layout/header.vue';
import layoutFoot from '@/components/layout/footer.vue';

import initialWallet from '@/components/basic/initialWallet.vue';
import transactionPool from '@/components/basic/transactionPool.vue';

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
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
    },
    scrollToTop() {
      const header = document.getElementsByTagName('header')[0];
      console.log(header,'----------------------------------------');
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 88) {
        header.style.boxShadow = '0px 2px 10px 0px rgba(0, 0, 0, 0.03)';
      } else {
        header.style.boxShadow = '0px 0px 10px 0px rgba(0, 0, 0, 0)';
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', this.scrollToTop);
  },
};
</script>
<style lang="less" scoped>
#app {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .main-wrapper {
    flex: 1;
    margin-top: 88px;
  }
}
</style>
