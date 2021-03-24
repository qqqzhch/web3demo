<template>
  <header class="header-wrapper header-wrapper-bg">
    <nav class="nav-wrapper container mx-auto flex justify-between items-center">
      <div class="left-wrapper flex items-center">
        <img src="../../assets/logo.svg" alt="logo">
        <div class="menu-wrapper">
          <router-link class="menu-item" to="/buildr" active-class="active">
            {{ $t('header.nav.Buildr') }}
          </router-link>
          <router-link class="menu-item" to="/exchange" active-class="active">
            {{ $t('header.nav.Exchange') }}
          </router-link>
          <router-link class="menu-item" to="/earn" active-class="active">
            {{ $t('header.nav.Earn') }}
          </router-link>
          <a href="http://47.94.197.75:8087/#/" class="menu-item" target="_blank">{{ $t('header.nav.Bridge') }}</a>
        </div>
      </div>

      <div class="connect-wrapper flex justify-between items-center">
        <Dropdown trigger="click" class="network-wrapper" @on-click="choseNetWork">
          <div class="netWork flex justify-between items-center" :class="getBg">
            <div class="dot" :class="statusVal" />
            <span>{{ network }}</span>
            <img class="arrow" src="../../assets/img/down.svg" alt="down">
          </div>
          <DropdownMenu slot="list" class="list-wrapper">
            <template v-for="(item, index) in getNetList">
              <DropdownItem :key="index" class="list-item" :name="item">
                <img :src="netInfo[item].imgSrc" :alt="item">
                <span>{{ netInfo[item].name }}</span>
              </DropdownItem>
            </template>
          </DropdownMenu>
        </Dropdown>

        <buttons v-if="!ethAddress" width="140px" height="40px" @click.native="openWalletDialog">
          {{ $t('header.connectWallet') }}
        </buttons>

        <template v-else>
          <Dropdown trigger="click" class="func-wrapper" @on-click="choseFunc">
            <div class="connected-content flex justify-start items-center">
              <img src="../../assets/img/metamask18.svg" alt="metamask">
              <span>{{ getShortAddress }}</span>
              <img class="arrow" src="../../assets/img/down.svg" alt="down">
            </div>
            <DropdownMenu slot="list" class="func-list-wrapper">
              <DropdownItem class="list-item" name="copy">
                <img src="../../assets/img/copy16.svg" alt="copy">
                <span>{{ $t('header.copyAddress') }}</span>
              </DropdownItem>
              <DropdownItem class="list-item" name="change">
                <img src="../../assets/img/changeWallet.svg" alt="change">
                <span>{{ $t('header.changeWallet') }}</span>
              </DropdownItem>
              <DropdownItem class="list-item" name="disconnect">
                <img src="../../assets/img/disconnect16.svg" alt="disconnect">
                <span>{{ $t('header.Disconnect') }}</span>
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
import { mapState } from 'vuex';
import config from '@/config/config.js';
import jscookie from 'js-cookie';
export default {
  components: {
    buttons: () => import('@/components/basic/buttons'),
    walletdialog: () => import('@/views/transfer/dialog/walletDialog'),
  },
  data() {
    return {
      isExchange: false,
      showBoxShadow: false,
      network: '',
      netInfo: config.netInfo,
      netID: '1',
      statusVal: '',
    };
  },
  methods: {
    openWalletDialog() {
      this.$refs.wallet.open();
    },
    copyAddress() {
      this.$copyText(this.ethAddress).then(() => {
        this.$Notice.success({
          title: this.$t('notice.n36'),
        });
      });
    },
    // 选择目标网络
    choseNetWork(val) {
      this.netID = val;
      jscookie.set('targetNet', val, { expires: 180 });
      this.getStatus();

      // if (this.statusVal === 'notConnect') {
      //   this.$Notice.warning({
      //     title: 'Wallet not connected',
      //     desc: 'Please connect to your wallet',
      //   });
      // }

      // if (this.statusVal === 'wrongConnect') {
      //   this.$Notice.error({
      //     title: 'Network not matched',
      //     desc: 'Please switch to Ethereum Network in Metamask.',
      //   });
      // }

      // if (this.statusVal === 'connect') {
      //   this.$Notice.success({
      //     title: 'Metamask Connected',
      //     desc: this.ethAddress,
      //   });
      // }

      switch (val) {
        case '1':
          this.network = this.$t('header.network.Ethereum');
          break;

        case '3':
          this.network = this.$t('header.network.Ropsten');
          break;

        case '256':
          this.network = this.$t('header.network.HecoTest');
          break;

        case '128':
          this.network = this.$t('header.network.HecoMain');
          break;

        case '56':
          this.network =  this.$t('header.network.BSCMain');
          break;

        case '97':
          this.network = this.$t('header.network.BSCTest');
          break;

        default:
          this.network = this.$t('header.network.Ethereum');
          break;
      }
      jscookie.set('net', this.network, { expires: 180 });
    },

    async choseFunc(val) {
      if (val === 'copy') {
        this.copyAddress();
      }
      if (val === 'change') {
        this.openWalletDialog();
      }
      if (val === 'disconnect') {
        this.disconnectWallet();
      }
    },

    async disconnectWallet() {
      console.log('disconnect');
    },

    getStatus() {
      const targetID = parseInt(jscookie.get('targetNet'));

      this.network = jscookie.get('net') || 'Ethereum';

      // console.log(targetID, this.ethChainID, this.network);
      if (!this.ethAddress) {
        this.statusVal = 'notConnect';
        this.$Notice.warning({
          title: this.$t('notice.n37'),
          desc: this.$t('notice.n38'),
        });
      }
      if (this.ethAddress && targetID !== this.ethChainID) {
        this.statusVal = 'wrongConnect';
        this.$Notice.error({
          title: this.$t('notice.n39'),
          desc: this.$t('notice.n40'),
        });
      }

      if (this.ethAddress && targetID === this.ethChainID) {
        this.statusVal = 'connect';
        this.$Notice.success({
          title: 'Metamask Connected',
          desc: this.ethAddress,
        });
      }
      // console.log(this.statusVal);
    },
  },
  computed: {
    ...mapState(['ethAddress', 'ethChainID']),
    getShortAddress() {
      return `${this.ethAddress.slice(0, 6)}...${this.ethAddress.slice(-6)}`;
    },
    getNetList() {
      const list = Object.keys(this.netInfo);
      return list;
    },
    getBg() {
      let styleVal;
      switch (this.netID) {
        case '1':
          styleVal = 'ethNet';
          break;
        case '3':
          styleVal = 'ethNet';
          break;
        case '128':
          styleVal = 'hecoNet';
          break;
        case '256':
          styleVal = 'hecoNet';
          break;
        case '56':
          styleVal = 'bscNet';
          break;
        case '97':
          styleVal = 'bscNet';
          break;

        default:
          styleVal = 'ethNet';
          break;
      }
      return styleVal;
    },
    isReady() {
      return this.ethChainID && this.ethAddress;
    },
  },
  // watch: {
  //   isReady(value) {
  //     if (value) {
  //       this.getStatus();
  //     }
  //   },
  // },
  mounted() {
    setTimeout(() => {
      if (this.isReady) {
        this.getStatus();
      } else {
        this.statusVal = 'notConnect';
        this.network = 'Ethereum';
        this.$Notice.warning({
          title: this.$t('notice.n37'),
          desc: this.$t('notice.n38'),
        });
      }
    }, 1000);
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
          display: inline-block;
          text-align: center;
          width: 88px;
          height: 28px;
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
            // background: #00d075;
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
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.06);
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
.notConnect {
  background: #bbbbbb;
}
.wrongConnect {
  background: #ff3c00;
}
.connect {
  background: #00d075;
}
</style>