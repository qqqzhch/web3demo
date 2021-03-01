<template>
  <div id="app">
    <layoutHead />
    <main class="main-wrapper container mx-auto">
      <router-view v-if="isRouterAlive" />
    </main>
    <layoutFoot />
  </div>
</template>

<script>
import layoutHead from '@/components/layout/header.vue';
import layoutFoot from '@/components/layout/footer.vue';
export default {
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
  },
};
</script>
<style lang="less" scoped>
#app {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
