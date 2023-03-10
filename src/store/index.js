import Vue from "vue";
import vuex from "vuex";
import buildrStore from './buildr';
import synthStore from './synth';
import pool from './pool';
import networkCoinconfig from '@/constants/networkCoinconfig.js';

Vue.use(vuex);

const store = new vuex.Store({
  state: {
    BNB: "ETH",
    ethAddress: "",
    ethChainID: "",
    web3: null,
    ethersprovider: null,
    chainTokenPrice: '',
    earnPrice: '',
    scashPrice: '',
    chainTokenName: '',
    WalletConnectprovider:null,
    WalletName:'',
    isMobile: document.body.clientWidth<1200?true:false
  },
  mutations: {
    changeToken(state, token) {
      state.BNB = token;
    },
    changeEthAddress(state, address) {
      state.ethAddress = address;
    },

    changeEthChainID(state, id) {
      // console.log('changeEthChainID',networkCoinconfig);
      state.ethChainID = id;

      const netinfo = networkCoinconfig(id);

      state.LAI = netinfo.LAI;
      state.BABEL =netinfo.BABEL;
      state.BNB =netinfo.coinName;
    },
    changeweb3(state, obj) {
      console.log('changeweb3');
      state.web3 = obj.web3;
      state.ethersprovider = obj.ethersprovider;

    },
    chainTokenPrice(state, price) {

      state.chainTokenPrice = price;

    },
    changeEarnPrice(state, price) {

      state.earnPrice = price;

    },
    changeScashPrice(state, price) {
      state.scashPrice = price;
    },
    changechainTokenName(state, name){
      state.chainTokenName = name;

    },
    changeWalletConnectprovider(state, Connectprovider){
      state.WalletConnectprovider = Connectprovider;

    },
    WalletName(state, name){
      state.WalletName = name;
    },
    changeIsMobile(state,status) {
      state.isMobile  = status;
    }
  },
  actions: {
    async getEthChainID({ state, commit }) {
      try {
        const res = await state.web3.eth.getChainId();
        commit("changeEthChainID", res);
      } catch (error) {
        console.log(error);
      }
    },
  }
});

[buildrStore, synthStore,pool].forEach((moduleStore) => store.registerModule(moduleStore.moduleName, moduleStore));

export default store;
