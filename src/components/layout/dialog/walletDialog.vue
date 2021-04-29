<template>
  <div class="wallet-dialog">
    <Modal
      v-model="openWalletDialog"
      class-name="wallet-modal"
      :transfer="true"
      :footer-hide="true"
      :closable="true"
    >
      <div class="modal-content">
        <p
          slot="header"
          class="title text-center"
        >
          Connect Wallet
        </p>
        <div
          class="wallet-content flex justify-between items-center"
          :class="wallet == 'metamask' ? 'wallet-content-active' : ''"
          @click="selectWallet('metamask')"
        >
          <div class="logo flex items-center text-warpper">
            <img src="../../../assets/img/metamask48.svg">
            <p>MetaMask</p>
          </div>

          <div class="img-wapper">
            <img src="../../../assets/img/check-blue-24.png">
          </div>
        </div>
        <div
          class="wallet-content flex items-center justify-between"
          :class="wallet == 'walletconnect' ? 'wallet-content-active' : ''"
          @click="selectWallet('walletconnect')"
        >
          <div class="logo flex items-center text-warpper">
            <img src="../../../assets/img/walletconnect-hexagon-blue.svg">
            <p>WalletConnect</p>
          </div>

          <div class="img-wapper">
            <img src="../../../assets/img/check-blue-24.png">
          </div>
        </div>
        <Buttons @click.native="connectWallet(wallet)">
          Connect Wallet
        </Buttons>
      </div>
    </modal>
  </div>
  </Modal>
  </div>
</template>

<script>
import WalletConnectProvider from "@walletconnect/web3-provider";
import Cookies from 'js-cookie';
import event from '@/common/js/event';
import chainConfig from '@/config/config.js';

export default {
  inject: ['reload'],
  components: {
    Buttons: () => import('@/components/basic/buttons'),
  },
  data() {
    return {
      openWalletDialog: false,
      wallet: '',
    };
  },
  methods: {
    selectWallet(wallet) {
      this.wallet = wallet;
      Cookies.set('usewalletname', wallet, { expires: 365, path: '/' });
      
      this.$store.commit('WalletName', wallet);
    },
    open() {
      this.openWalletDialog = true;
      const usewalletname = Cookies.get('usewalletname');
        if(usewalletname){
          this.wallet = usewalletname;
        }
    },
    connectWallet(name) {
      if(name === 'metamask'){
         this.getEthAuth();
       }else if(name === 'walletconnect'){
         this.getwalletconnectAuth();
       }
      
    },

    // 获取metamask授权
    async getEthAuth() {
      try {
        // 请求用户授权
        const res = await window.ethereum.enable();
        this.$store.commit('changeEthAddress', res[0]);
        // await this.initEth();
        this.openWalletDialog = false;
        this.reload();
      } catch (error) {
        console.log(error);
        this.$Notice.warning({
                title: this.$t('notice.n'),
                desc: this.$t('notice.n11'),
              });
      }
    },

    getLambAuth() {
      console.log('lambda');
    },
    async getwalletconnectAuth() {
      try {
        // 请求用户授权
        const provider = new WalletConnectProvider({
          rpc: chainConfig.walletconnectRPC,
          chainId:chainConfig.defaultChainID 
        });
        console.log('provider',provider);
        // await provider.disconnect();
        const res = await provider.enable();
        this.$store.commit('changeEthAddress', res[0]);
        this.$store.commit('changeWalletConnectprovider', provider);
        
        event.$emit('initpageEth');
        this.openWalletDialog = false;
        this.reload();
      } catch (error) {
        event.$emit('initpageEth');
        
        console.log(error);
        this.reload();
      }
    }
  },
};
</script>

<style lang="less" scoped>
.modal-content {
  // width: 500px;
  // padding: 24px 44px;
  .button-wrapper {
    height: 48px;
    margin-top: 30px;
    button {
      font-size: 16px;
    }
  }
  .title {
    font-size: 24px;
    font-weight: 500;
    color: #14171c;
    line-height: 50px;
  }
  .wallet-content {
    cursor: pointer;
    padding: 16px;
    margin-top: 15px;
    background: #f7f8f9;
    width: 100%;
    height: 64px;
    border-radius: 6px;
    .text-warpper {
      img {
        margin-right: 16px;
      }
      p {
        font-size: 16px;
        font-weight: 500;
        color: #14171c;
        line-height: 19px;
      }
    }
    .img-wapper {
      display: none;
    }
  }
  .wallet-content-active {
    border: 1px solid #605AA5;
    .img-wapper {
      display: block;
    }
  }
  .logo {
    img {
      max-width: 32px;
    }
  }
}
</style>