import * as types from './mutation-types';
export default {
  namespaced: true,
  moduleName: 'pool',
  state: {
    liquity: {},
  },
  mutations: {
    [types.SET_LIQUITY_METHODS] (state, liquity) {
      state.liquity = liquity;
    },
  },
  actions: {
    setLiquityMethods({ commit }, liquity){
      commit(types.SET_LIQUITY_METHODS, liquity);
    },
  }
};
