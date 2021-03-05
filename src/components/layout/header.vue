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
          v-if="ethAddress"
          width="140px"
          height="40px"
        >
          {{ `${this.ethAddress.slice(0,6)}...${this.ethAddress.slice(-6)}` }}
        </buttons>
        <buttons
          v-else
          width="140px"
          height="40px"
          @click.native="openWalletDialog"
        >
          Connect Wallet
        </buttons>
      </div>
    </nav>
    <walletdialog ref="wallet" />
  </header>
</template>

<script>
import { mapState } from 'vuex';
export default {
  components: {
    buttons: () => import('@/components/basic/buttons'),
    walletdialog: () => import("@/views/transfer/dialog/walletDialog"),
  },
  methods: {
    openWalletDialog() {
      this.$refs.wallet.open();
    }
    // openWalletDialog() {
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