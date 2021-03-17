import Vue from "vue";
import vuex from "vuex";
import buildrStore from './buildr';

Vue.use(vuex);

const store = new vuex.Store({
  state: {
    token: "ETH",
    ethAddress: "",
    ethChainID: "",
    web3:null,
    ethersprovider:null,
    htPrice:''
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

    },
    htPrice(state,price){

      state.htPrice=price;

    }
  },
});

[ buildrStore ].forEach((moduleStore) => store.registerModule(moduleStore.moduleName, moduleStore));

export default store;
