import Vue from "vue";
import vuex from "vuex";
import buildrStore from './buildr';

Vue.use(vuex);

const store = new vuex.Store({
  state: {
    token: "ETH",
    ethAddress: "",
    ethChainID: "",
    web3: null,
    ethersprovider: null,
    chainTokenPrice: '',
    earnPrice: '',
    scashPrice: '',
    chainTokenName: '',
  },
  mutations: {
    changeToken(state, token) {
      state.token = token;
    },
    changeEthAddress(state, address) {
      state.ethAddress = address;
    },

    changeEthChainID(state, id) {
      state.ethChainID = id;
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

[buildrStore].forEach((moduleStore) => store.registerModule(moduleStore.moduleName, moduleStore));

export default store;
