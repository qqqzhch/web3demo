import * as types from './mutation-types';

export default {
  namespaced: true,
  moduleName: 'buildr',
  state: {
    poolsData: [],
    currPool: {}
  },
  mutations: {
    [types.SET_POOLS_BALANCE_DATA] (state, poolsData) {
      state.poolsData = poolsData;
    },
    [types.SET_CURRENT_POOL] (state, currPool) {
      state.currPool = currPool;
    },
  },
  actions: {
    setPoolsData({ commit }, poolsData){
      commit(types.SET_POOLS_BALANCE_DATA, poolsData);
    },
    setCurrentPool({ commit }, currPool){
      commit(types.SET_CURRENT_POOL, currPool);
    },
  }
};
