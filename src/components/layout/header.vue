<template>
  <header class="header-wrapper header-wrapper-bg">
    <nav v-if="!isMobile" class="nav-wrapper container mx-auto flex justify-between items-center">
      <div class="left-wrapper flex items-center">
        <img class="logo" src="../../assets/logo.svg" alt="logo">
        <div class="menu-wrapper">
          <router-link class="menu-item" to="/vault" active-class="active">
            {{ $t('header.nav.vault') }}
          </router-link>

          <router-link class="menu-item" to="/stabilityPool" active-class="active">
            {{ $t('header.nav.stPool') }}
          </router-link>

          <router-link class="menu-item" to="/babelPool" active-class="active">
            {{ $t('header.nav.babelPool') }}
          </router-link>

          <router-link class="menu-item" to="/lpPool" active-class="active">
            {{ $t('header.nav.lpPool') }}
          </router-link>

          <router-link class="menu-item" to="/riskyVaults" active-class="active">
            {{ $t('header.nav.troves') }}
          </router-link>


          <!-- <router-link class="menu-item" to="/exchange" active-class="active">
            {{ $t('header.nav.Exchange') }}
          </router-link>
          <router-link class="menu-item" to="/earn" active-class="active">
            {{ $t('header.nav.Earn') }}
          </router-link>
          <router-link class="menu-item" to="/synth" active-class="active">
            {{ $t('header.nav.Synth') }}
          </router-link> -->
          <!-- <a href="http://47.94.197.75:8087/#/" class="menu-item" target="_blank">{{ $t('header.nav.Bridge') }}</a> -->
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
              <DropdownItem v-if="netInfo[item].isBan === false" :key="index" class="list-item" :name="item">
                <img :src="netInfo[item].imgSrc" :alt="item">
                <span>{{ netInfo[item].name }}</span>
              </DropdownItem>
              <DropdownItem v-else :key="index" disabled class="list-item" :name="item">
                <img :src="netInfo[item].imgSrc" :alt="item">
                <span>{{ netInfo[item].name }}</span>
              </DropdownItem>
            </template>
          </DropdownMenu>
        </Dropdown>

        <button v-if="!ethAddress" class="connectBtn" @click="openWalletDialog">
          {{ $t('header.connectWallet') }}
        </button>

        <template v-else>
          <Dropdown trigger="click" class="func-wrapper" @on-click="choseFunc">
            <div class="connected-content flex justify-start items-center">
              <img v-if="WalletName=='metamask'" src="../../assets/img/metamask18.svg" alt="metamask">
              <img v-else src="../../assets/img/walletconnect-hexagon-blue.svg" alt="walletconnect">
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
              <DropdownItem v-if="WalletConnectprovider" class="list-item" name="disconnect">
                <img src="../../assets/img/disconnect16.svg" alt="disconnect">
                <span>{{ $t('header.Disconnect') }}</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </template>
        </button>
      </div>
    </nav>

    <nav v-else class="nav-wrapper container mobileHeader">
      <div class="content-left">
        <img src="../../assets/logo.svg" alt="logo">
      </div>
      <div class="content-right flex items-center">
        <Dropdown trigger="click" class="network-wrapper" @on-click="choseNetWork">
          <div class="netWork flex justify-between items-center" :class="getBg">
            <div class="dot" :class="statusVal" />
            <span>{{ network }}</span>
            <img class="arrow" src="../../assets/img/down.svg" alt="down">
          </div>
          <DropdownMenu slot="list" class="list-wrapper">
            <template v-for="(item, index) in getNetList">
              <DropdownItem v-if="netInfo[item].isBan === false" :key="index" class="list-item" :name="item">
                <img :src="netInfo[item].imgSrc" :alt="item">
                <span>{{ netInfo[item].name }}</span>
              </DropdownItem>
              <DropdownItem v-else :key="index" disabled class="list-item" :name="item">
                <img :src="netInfo[item].imgSrc" :alt="item">
                <span>{{ netInfo[item].name }}</span>
              </DropdownItem>
            </template>
          </DropdownMenu>
        </Dropdown>
        <div class="wallet-wrapper">
          <img
            v-if="!ethAddress"
            v-clickoutside="closeWallet"
            src="../../assets/m-img/link1.svg"
            alt="link"
            class="headerIco"
            @click="openWalletDialog"
          >
          <img
            v-else
            v-clickoutside="closeWallet"
            src="../../assets/m-img/link1.svg"
            alt="headerico"
            class="headerIco"
            @click="showWallet"
          >
          <div v-if="isShowWallet" class="wallet-item">
            <div>
              <img v-if="WalletName=='metamask'" src="../../assets/img/metamask18.svg" alt="metamask">
              <img v-else src="../../assets/img/walletconnect-hexagon-blue.svg" alt="walletconnect">
              <p>{{ getShortAddress }}</p>
            </div>
            <button @click="copyAddress">
              {{ $t('header.copyAddress') }}
            </button>
            <button v-if="WalletConnectprovider" @click="disconnectWallet">
              {{ $t('header.Disconnect') }}
            </button>
          </div>
        </div>
        <div class="set-wrapper">
          <img src="../../assets/m-img/setting.svg" alt="setting" class="headerset" @click="openSettingDialog">
        </div>
      </div>
    </nav>

    <walletdialog ref="wallet" />
    <settingdialog ref="setting" />
  </header>
</template>

<script>
import { mapState } from 'vuex';
import config from '@/config/config.js';
import jscookie from 'js-cookie';
export default {
  inject: ['reload'],
  components: {
    walletdialog: () => import('./dialog/walletDialog'),
    settingdialog: () => import('./dialog/mSettingDialog'),
  },
  data() {
    return {
      isExchange: false,
      showBoxShadow: false,
      network: '',
      netInfo: config.netInfo,
      netID: '1',
      statusVal: '',
      // isMobile:true,
      isShowWallet:false,
      isShowSetting:false,
    };
  },
  methods: {
    openWalletDialog() {
      this.$refs.wallet.open();
    },
    openSettingDialog() {
      this.$refs.setting.open();
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

      this.network = this.netInfo[val].name;
      jscookie.set('net', this.network, { expires: 180 });
      // this.addChain();
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
      await this.WalletConnectprovider.disconnect();
      this.$store.commit('changeEthAddress', '');
      this.$store.commit('changeWalletConnectprovider', null);
      this.reload();
    },

    // 添加并且切换网络类型
    addChain() {
      const defaultNet = config.defaultNet[config.getChainID()];
      const param = {
        chainId: defaultNet.chainIDHex,
        chainName: defaultNet.netName,
        nativeCurrency: {
          name: defaultNet.symbolNet,
          symbol: defaultNet.symbol,
          decimals: defaultNet.decimals,
        },
        rpcUrls: defaultNet.rpcUrl,
        blockExplorerUrls: defaultNet.explorerUrl,
      };
      const ethereum = window.ethereum;
      ethereum
        .request({ method: 'wallet_addEthereumChain', params: [param] })
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getStatus() {
      console.log('----');
      const targetID = parseInt(jscookie.get('targetNet')) || config.defaultChainID;

      this.network = jscookie.get('net');
      if (!this.network) {
        this.network = this.netInfo[config.getChainID()].name;
      }
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
          duration: 30,
        });
        this.addChain();
      }

      if (this.ethAddress && targetID === this.ethChainID) {
        this.statusVal = 'connect';
        this.$Notice.success({
          title: this.$t('notice.n41'),
          desc: this.ethAddress,
        });
      }
      // console.log(this.statusVal);
    },
    showWallet() {
      this.isShowWallet = true;
    },
    closeWallet() {
      this.isShowWallet = false;
    },
  },
  computed: {
    ...mapState(['ethAddress', 'ethChainID','WalletConnectprovider','WalletName','isMobile']),
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
  watch: {
    isReady(value) {
      if (value) {
        this.getStatus();
      }
    },
  },
  mounted() {
    if (this.isReady) {
      this.getStatus();
    } else {
      this.statusVal = 'notConnect';
      // 设置默认网络
      this.network = this.netInfo[config.getChainID()].name;
      this.addChain();
    }
  },
};
</script>

<style lang="less" scoped>
@import "./media/index.less";
.header-wrapper {
  width: 100%;
  height: 88px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  background-color: #ffffff;
  .nav-wrapper {
    width: 100%;
    height: 100%;
    .left-wrapper {
      width: 70%;
      height: 100%;
      .logo{
        max-width: 150px;
      }
      .menu-wrapper {
        margin-left: 50px;
        .menu-item {
          display: inline-block;
          text-align: center;
          padding: 0px 16px;
          height: 28px;
          margin-right: 16px;
          font-size: 16px;
          font-weight: 500;
          color: #14171c;
        }
        .active {
          display: inline-block;
          height: 28px;
          text-align: center;
          background: #605AA5;
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
          font-size: 16px;
          font-weight: 500;
          color: #14171c;
          line-height: 14px;
          margin-right: 16px;
        }
        .changeBtn {
          width: 148px;
          height: 40px;
          border: 1px solid #605AA5;
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
  box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.06);
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
.connectBtn {
  width: 148px;
  height: 40px;
  border-radius: 20px;
  line-height: 19px;
  font-size: 16px;
  color: #605AA5;
  border: 1px solid #605AA5;
}
</style>
