<template>
  <header class="header-wrapper">
    <nav class="nav-wrapper container mx-auto flex justify-between items-center">
      <div class="left-wrapper flex items-center">
        <img
          src="../../assets/logo.svg"
          alt="logo"
        >
        <div class="menu-wrapper">
          <a
            class="menu-item"
            href="/"
          >Buildr</a>
          <button
            class="btn menu-item exchange-active"
            href="/"
          >
            Exchange
          </button>
          <a
            class="menu-item"
            href="/"
          >Earn</a>
          <a class="menu-item">
            Bridge
          </a>
        </div>
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
    .left-wrapper {
      height: 100%;
      .menu-wrapper {
        margin-left: 80px;
        .menu-item {
          margin-right: 56px;
          font-size: 16px;
          font-weight: 500;
          color: #14171c;
          // line-height: 19px;
        }
        .exchange-active {
          display: inline-block;
          width: 88px;
          height: 28px;
          background: #0058ff;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 500;
          color: #ffffff;
          line-height: 19px;
        }
      }
    }
  }
}
</style>