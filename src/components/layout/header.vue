<template>
  <header :class="showBoxShadow ? 'header-wrapper header-wrapper-bg':'header-wrapper'">
    <nav class="nav-wrapper container mx-auto flex justify-between items-center">
      <div class="left-wrapper flex items-center">
        <img src="../../assets/logo.svg" alt="logo">
        <div class="menu-wrapper">
          <router-link class="menu-item" to="/buildr" active-class="active">
            Buildr
          </router-link>
          <router-link :class="isExchange ? 'menu-item active' : 'menu-item'" to="/exchange" active-class="active">
            Exchange
          </router-link>
          <router-link class="menu-item" to="/earn" active-class="active">
            Earn
          </router-link>
          <a href="http://47.94.197.75:8087/#/" class="menu-item" target="_blank">
            Bridge
          </a>
        </div>
      </div>

      <div class="connect-wrapper flex justify-between items-center">
        <buttons v-if="!ethAddress" width="140px" height="40px" @click.native="openWalletDialog">
          Connect Wallet
        </buttons>

        <template v-else>
          <Dropdown trigger="click" class="network-wrapper" @on-click="choseNetWork">
            <div class="netWork flex justify-between items-center" :class="getBg">
              <div class="dot" />
              <span>{{ network }}</span>
              <img class="arrow" src="../../assets/img/down.svg" alt="down">
            </div>
            <DropdownMenu slot="list" class="list-wrapper">
              <DropdownItem class="list-item" name="eth">
                <img src="../../assets/img/eth48.png" alt="eth">
                <span>Ethereum</span>
              </DropdownItem>
              <DropdownItem class="list-item" name="heco">
                <img src="../../assets/img/huobi48.svg" alt="heco">
                <span>Heco</span>
              </DropdownItem>
              <DropdownItem class="list-item" name="bsc">
                <img src="../../assets/img/BSC.svg" alt="bsc">
                <span>BSC</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown trigger="click" class="func-wrapper" @on-click="choseFunc">
            <div class="connected-content flex justify-start items-center">
              <img src="../../assets/img/metamask18.svg" alt="metamask">
              <span>{{ getShortAddress }}</span>
              <img class="arrow" src="../../assets/img/down.svg" alt="down">
            </div>
            <DropdownMenu slot="list" class="func-list-wrapper">
              <DropdownItem class="list-item" name="copy">
                <img src="../../assets/img/copy16.svg" alt="copy">
                <span>Copy Address</span>
              </DropdownItem>
              <DropdownItem class="list-item" name="change">
                <img src="../../assets/img/changeWallet.svg" alt="change">
                <span>Change Wallet</span>
              </DropdownItem>
              <DropdownItem class="list-item" name="disconnect">
                <img src="../../assets/img/disconnect16.svg" alt="disconnect">
                <span>Disconnect</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </template>
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
      showBoxShadow: false,
      network: 'Ethereum',
    };
  },
  mounted() {
    this.routerUrl();
    window.addEventListener(
      "scroll",
      this.debounce(this.scrollToTop, 30, false)
    );
  },
  destroyed() {
    window.removeEventListener(
      "scroll",
      this.debounce(this.scrollToTop, 30, false)
    );
  },
  watch: {
    $route: {
      handler: function (val) {
        if (val == "/") {
          this.isExchange = true;
        } else {
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
      copyAddress() {
      this.$copyText(this.ethAddress).then((res) => {
        this.$Notice.success({
          title: 'Address Copied!',
        });
      });
    },
    // 选择目标网络
    choseNetWork(val) {
      switch (val) {
        case 'eth':
          this.network = 'Ethereum';
          break;
        case 'heco':
          this.network = 'Heco';
          break;
        case 'bsc':
          this.network = 'BSC';
          break;

        default:
          this.network = 'Ethereum';
          break;
      }
    },

    async choseFunc(val) {
      if (val === 'copy') {
        this.copyAddress();
      }
      if (val === 'change') {
        this.openWalletDialog();
      }
      if(val === 'disconnect') {
        this.disconnectWallet();
      }
    },

    async disconnectWallet() {
      console.log('disconnect');
    },
    scrollToTop() {
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      if (scrollTop > 88) {
        this.showBoxShadow = true;
      } else {
        this.showBoxShadow = false;
      }
    },
    debounce(fn, wait, immediate) {
      let timeout;
      return function () {
        const _this = this,
          args = arguments;
        const later = function () {
          timeout = null;
          if (!immediate) fn.apply(_this, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) fn.apply(_this, args);
      };
    },
  },
  computed: {
    ...mapState(["ethAddress"]),
    getShortAddress() {
      return `${this.ethAddress.slice(0, 6)}...${this.ethAddress.slice(-6)}`;
    },
    getBg() {
      let styleVal;
      // console.log(this.network);
      switch (this.network) {
        case 'Ethereum':
          styleVal = 'ethNet';
          break;
        case 'Heco':
          styleVal = 'hecoNet';
          break;
        case 'BSC':
          styleVal = 'bscNet';
          break;

        default:
          styleVal = 'ethNet';
          break;
      }
      return styleVal;
    },
  },
};
</script>

<style lang="less" scoped>
.header-wrapper {
  width: 100%;
  height: 88px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
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
          cursor: pointer;
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
      .network-wrapper {
        cursor: pointer;
        width: 124px;
        margin-right: 32px;
        .netWork {
          width: 124px;
          height: 28px;
          // background: rgba(54, 74, 111, 0.1);
          border-radius: 14px;
          .dot {
            margin-left: 8px;
            width: 8px;
            height: 8px;
            background: #00d075;
            border-radius: 100%;
          }
          span {
            font-size: 14px;
            font-weight: 500;
            color: #14171c;
            line-height: 16px;
          }
          .arrow {
            margin-right: 8px;
          }
        }
      }
    }
  }
}
.header-wrapper-bg {
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.03);
}
.list-item {
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  img {
    max-width: 16px;
    margin-right: 8px;
  }
  span {
    font-size: 14px;
    font-weight: 500;
    color: #14171c;
    line-height: 16px;
  }
}
.ethNet {
  background: rgba(54, 74, 111, 0.1);
  border: 1px solid #364a6f;
}
.hecoNet {
  background: rgba(0, 172, 228, 0.1);
  border: 1px solid #00ace4;
}
.bscNet {
  background: rgba(240, 185, 11, 0.1);
  border: 1px solid #f0b90b;
}
</style>