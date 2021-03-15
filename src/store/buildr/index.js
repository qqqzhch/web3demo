import * as types from './mutation-types';

export default {
  namespaced: true,
  moduleName: 'buildr',
  state: {
    poolsData: [],
  },
  mutations: {
    [types.SET_POOLS_BALANCE_DATA] (state, poolsData) {
      state.poolsData = poolsData;
    },
  },
  actions: {
    setPoolsData({ commit }, poolsData){
      commit(types.SET_POOLS_BALANCE_DATA, poolsData);
    }
  }
};
