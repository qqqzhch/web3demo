<template>
  <header class="header-wrapper">
    <nav class="nav-wrapper container mx-auto flex justify-between items-center">
      <div class="logo-wrapper">
        <img
          src="../../assets/logo.svg"
          alt="logo"
        >
      </div>
      <div
        class="connect-wrapper"
      >
        <buttons
          width="140px"
          height="40px"
        >
          Connect Wallet
        </buttons>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapState } from 'vuex';
export default {
  components: {
    buttons: () => import('@/components/basic/buttons'),
  },
  methods: {
    // openWalletDialog() {

    // }
  },
    computed: {
    ...mapState(['ethAddress']),
  },
};
</script>

<style lang="less" scoped>
.header-wrapper {
  width: 100%;
  height: 88px;
  background-color: #ffffff;
  .nav-wrapper {
    height: 100%;
    .logo-wrapper {
      width: 150px;
      img {
        max-width: 100%;
      }
    }
  }
}
</style>