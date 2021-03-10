import * as types from './mutation-types';

export default {
  namespaced: true,
  moduleName: 'buildr',
  state: {
    coinNum: 0,
  },
  mutations: {
    [types.GET_COIN_NUM] (state, { coinNum }) {
      state.coinNum = coinNum;
    },
  },
  actions: {
    setCompanyBasicInfo({ commit, state }, { coinNum }){
      commit(types.GET_COIN_NUM, { coinNum });
    }
  }
};
