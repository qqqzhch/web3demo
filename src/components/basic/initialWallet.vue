<script>
import Web3 from 'web3';
import { mapState } from 'vuex';
import { ethers } from 'ethers';

import   {getPrice} from '@/contactLogic/tokenPrice.js';

import getChainCoinInfo from '@/constants/networkCoinconfig.js';
import chainConfig from '@/config/config.js';

import WalletConnectProvider from "@walletconnect/web3-provider";
import Cookies from 'js-cookie';
import event from '@/common/js/event';
import getethProvider from '@/contacthelp/getethProvider.js';

export default {
  data() {
    return {};
  },
  mounted() {
    this.initEth();
   const _this =this;
    event.$on('initpageEth',()=>{
      _this.initEth();
    });

  },
  methods: {
   async coinPrice(){
      const ChainID =this.ethChainID;
      const coinInfo = getChainCoinInfo(ChainID);

      const data = await getPrice(coinInfo.tokenID);

      this.$store.commit('changechainTokenName', coinInfo.coinName);

      this.$store.commit('chainTokenPrice', data);
    //  console.log('ht 价格',data);



    },
    // 检查是否连接
    async isEthConnect() {
      try {
        const res = await this.web3.eth.getCoinbase();
        return res;
      } catch (error) {
        console.log(error);
      }
    },

    // 获取以太坊chainID
    async getEthChainID() {
      try {
        const res = await this.web3.eth.getChainId();
        // if (res !== 256) {
        //   this.$Notice.warning({
        //     title: this.$t('notice.n'),
        //     desc: this.$t('notice.n34'),
        //     duration: 0,
        //   });
        // }
        this.$store.commit('changeEthChainID', res);
      } catch (error) {
        console.log(error);
        this.$Notice.warning({
          title: this.$t('notice.n'),
          desc: this.$t('notice.n2'),
        });
      }
    },

    // 获取当前连接的eth地址
    async getCurrentAccount() {
      try {
        const res = await this.web3.eth.getAccounts();
        if (res.length < 1) {
          this.$Notice.warning({
            title: this.$t('notice.n'),
            desc: this.$t('notice.n7'),
          });
          return false;
        }
        this.$store.commit('changeEthAddress', res[0]);
      } catch (error) {
        console.log(error);
        this.$Notice.warning({
          title: this.$t('notice.n'),
          desc: this.$t('notice.n8'),
        });
      }
    },
    // 将切换后的账户及时更新
    checkAccount(accounts) {
      if (accounts.length === 0) {
        // console.log('Please connect to MetaMask.');
        // console.log("未连接账户");
        this.$Notice.warning({
          title: this.$t('notice.n'),
          desc: this.$t('notice.n9'),
        });
      } else if (accounts[0] !== this.ethAddress) {
        this.$store.commit('changeEthAddress', accounts[0]);
      }
    },

    // 检测eth账号切换
    checkStatus() {
       //WalletConnectprovider
      let providerobj={};
      if(this.WalletName=='metamask'){
        providerobj=window.ethereum;
      }else if(this.WalletName=='walletconnect') {
        providerobj=this.WalletConnectprovider;
      }

      if(providerobj&&providerobj.on){
      
        providerobj.on('accountsChanged', (accounts) => {
            this.checkAccount(accounts);
              window.location.reload();
          });
        providerobj.on('networkChanged', (network) => {
            this.$store.commit('changeEthChainID', network);
            this.$Notice.warning({
              title: this.$t('notice.n'),
              desc: this.$t('notice.n10'),
            });
            // 切换后刷新页面从而刷新相关的数据
            const timer = setTimeout(() => {
              window.location.reload();
              clearTimeout(timer);
            }, 1000);
          });
        providerobj.on('disconnect',()=>{
          this.checkAccount([]);
          window.location.reload();
        });
      
      }


    },

    // eth初始化
    async initEth() {
      try {
        console.log('initEth');
        let web3Provider;
        let  usewalletname = Cookies.get('usewalletname');
        if(usewalletname==undefined||usewalletname==''){
          if(window.ethereum||window.web3){
            usewalletname = 'metamask';
          }else{
            usewalletname = 'walletconnect';
          }
        }
        
        this.$store.commit('WalletName', usewalletname);
        if(usewalletname == 'metamask'){
           if (window.ethereum) {
              web3Provider = window.ethereum;
            } else if (window.web3) {
              // 老版 MetaMask Legacy dapp browsers...
              web3Provider = window.web3.currentProvider;
            } else {
              this.$Notice.warning({
                title: this.$t('notice.n'),
                desc: this.$t('notice.n11'),
              });
              this.$store.commit('changeEthChainID', chainConfig.getChainID());

              // return false;
            }

        }else if(usewalletname == 'walletconnect'){
                 const WalletConnectprovider = new WalletConnectProvider({
                      rpc: chainConfig.walletconnectRPC,
                      chainId:chainConfig.getChainID() 
                    });
                    
                  web3Provider=this.WalletConnectprovider||WalletConnectprovider;
                  if(web3Provider.connected==false){
                    try {
                      const res = await WalletConnectprovider.enable();
                        web3Provider= WalletConnectprovider;
                        this.$store.commit('changeEthAddress', res[0]);
                        this.$store.commit('changeWalletConnectprovider', WalletConnectprovider);
                      
                    } catch (error) {
                      // web3Provider= ;
                      console.log(error);
                      web3Provider.connected=false;
                      
                    }
                    
                  }
                  

        }

        
        let  web3,ethersprovider;
        if(usewalletname == 'metamask'&&web3Provider||web3Provider&&web3Provider.connected){
           web3 = new Web3(web3Provider);
           ethersprovider = new ethers.providers.Web3Provider(web3Provider);
        }else{
          ethersprovider = getethProvider({chainId:chainConfig.getChainID() });
          web3 = new Web3(chainConfig.walletconnectRPC[chainConfig.getChainID()]);
          this.$store.commit('changeEthChainID', chainConfig.getChainID());
          console.log(chainConfig.getChainID(),ethersprovider);
        }

        this.$store.commit('changeweb3', { web3, ethersprovider });

        const isConnect = await this.isEthConnect();

        await this.getEthChainID();
        await this.coinPrice();

        if (!isConnect) {
          this.$Notice.warning({
            title: this.$t('notice.n'),
            desc: this.$t('notice.n1'),
          });

          return false;
        } else {
          // 获取当前chainId


          // 初始化合约
          // await this.initContract();

          // 检测状态切换
          this.checkStatus();

          // 获取当前账号地址
          this.getCurrentAccount();

          // 获取tlamb余额
          // this.getTlambBalance();
        }
      } catch (error) {
        console.log(error);
        this.$Notice.warning({
          title: this.$t('notice.n12'),
        });
      }
    },
  },
  computed: {
    ...mapState(['ethAddress', 'web3', 'ethersprovider','ethChainID','WalletConnectprovider','WalletName']),
  },
  watch:{
    ethChainID:function(){
      this.coinPrice();
    }

  }
};
</script>