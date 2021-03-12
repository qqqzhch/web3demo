<template>
  <header class="header-wrapper">
    <nav
      class="nav-wrapper container mx-auto flex justify-between items-center"
    >
      <div class="left-wrapper flex items-center">
        <img src="../../assets/logo.svg" alt="logo">
        <div class="menu-wrapper">
          <router-link class="menu-item" to="/buildr" active-class="active">
            Buildr
          </router-link>
          <router-link
            :class="isExchange ? 'menu-item active' : 'menu-item'"
            to="/exchange"
            active-class="active"
          >
            Exchange
          </router-link>
          <router-link class="menu-item" to="/earn" active-class="active">
            Earn
          </router-link>
          <a
            href="http://47.94.197.75:8087/#/"
            class="menu-item"
            target="_blank"
          >
            Bridge
          </a>
        </div>
      </div>

      <div class="connect-wrapper">
        <buttons v-if="!ethAddress" width="140px" height="40px" @click.native="openWalletDialog">
          Connect Wallet
        </buttons>

        <div v-else class="connected-content flex justify-between items-center">
          <img src="../../assets/img/metamask18.svg" alt="metamask">
          <span>{{ getShortAddress }}</span>
          <button class="btn changeBtn" @click="openWalletDialog">
            Change Wallet
          </button>
        </div>
      </div>
    </nav>
    <walletdialog ref="wallet" />
  </header>
</template>

<script>
import { mapState } from "vuex";
export default {
  components: {
    buttons: () => import("@/components/basic/buttons"),
    walletdialog: () => import("@/views/transfer/dialog/walletDialog"),
  },
  data() {
    return {
      isExchange: false,
    };
  },
  mounted() {
    this.routerUrl();
  },
  watch: {
    $route: {
      handler: function (val) {
        if(val=='/'){
          this.isExchange = true;
        }else{
          this.isExchange = false;
        }
      },
    },
  },
  methods: {
    openWalletDialog() {
      this.$refs.wallet.open();
    },
    routerUrl() {
      if (this.$route.path == "/") {
        this.isExchange = true;
      }
    },
    // openWalletDialog() {
  },
  computed: {
    ...mapState(['ethAddress']),
    getShortAddress() {
      return `${this.ethAddress.slice(0, 6)}...${this.ethAddress.slice(-6)}`;
    },
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
        .active {
          display: inline-block;
          width: 88px;
          height: 28px;
          text-align: center;
          background: #0058ff;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 500;
          color: #ffffff;
          line-height: 28px;
        }
      }
    }

    .connect-wrapper {
      .connected-content {
        img {
          max-width: 14px;
          margin-right: 8px;
        }
        span {
          font-size: 12px;
          font-weight: 500;
          color: #14171c;
          line-height: 14px;
          margin-right: 16px;
        }
        .changeBtn {
          width: 148px;
          height: 40px;
          border: 1px solid #0058ff;
          font-size: 16px;
          font-weight: 500;
          color: #14171c;
          line-height: 19px;
        }
      }
    }
  }
}
</style>