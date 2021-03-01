import Vue from "vue";
import vuex from "vuex";
Vue.use(vuex);

export default new vuex.Store({
  state: {
    token: "ETH",
    ethAddress: "",
    ethChainID: "",
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
    }
  },
});
