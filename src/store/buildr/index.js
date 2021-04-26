import * as types from './mutation-types';

export default {
  namespaced: true,
  moduleName: 'buildr',
  state: {
    poolsData: [],
    currPool: {},
    allPoolsEnable: false,
    liquityState: {
      price: 0,
      trove: {
        collateral: 0,
        debt: 0,
      },
      total: {
        collateral: 0,
        debt: 0,
      },
      borrowingRate: 0,
      redemptionRate: 0,
      accountBalance: 0,
    },
    isOpen: false,
  },
  mutations: {
    [types.SET_POOLS_BALANCE_DATA] (state, poolsData) {
      state.poolsData = poolsData;
    },
    [types.SET_CURRENT_POOL] (state, currPool) {
      state.currPool = currPool;
    },
    [types.SET_All_POOLS_ENABLE] (state, enable) {
      state.allPoolsEnable = enable;
    },
    [types.SET_LIQUITY_STATE] (state, data) {
      state.liquityState = data;
      state.isOpen = data.trove.status === 'open';
    },
  },
  actions: {
    setPoolsData({ commit }, poolsData){
      commit(types.SET_POOLS_BALANCE_DATA, poolsData);
    },
    setCurrentPool({ commit }, currPool){
      commit(types.SET_CURRENT_POOL, currPool);
    },
    setAllPoolsEnable({ commit }, enable){
      commit(types.SET_All_POOLS_ENABLE, enable);
    },
    setLiquityState({ commit }, state){
      commit(types.SET_LIQUITY_STATE, state);
    },

  }
};
