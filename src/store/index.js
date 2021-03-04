import Vue from "vue";
import vuex from "vuex";
Vue.use(vuex);

export default new vuex.Store({
  state: {
    token: "ETH",
    ethAddress: "",
    ethChainID: "",
    web3:null,
    ethersprovider:null
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
    changeweb3(state,obj){
      console.log('changeweb3');
      state.web3=obj.web3;
      state.ethersprovider=obj.ethersprovider;

    }
  },
});
