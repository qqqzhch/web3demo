import * as types from './mutation-types';
import * as Products from '../../contactLogic/synth/products';


export default {
  namespaced: true,
  moduleName: 'synth',
  state: {
    allProducts: [],
    focusedProduct: {},
    synthScUSDAmount: 0,
    assetTotalValue: 0,
    allAssets: [],
    refresh: false,
  },
  mutations: {
    [types.GET_ALL_PRODUCTS_DATA] (state, allProducts) {
      state.allProducts = allProducts;
    },
    [types.GET_FOCUSED_PRODUCT_DATA] (state, product) {
      state.focusedProduct = product;
    },
    [types.SET_FOCUSED_PRODUCT_DATA] (state, product) {
      state.focusedProduct = product;
    },
    [types.SET_SYNTH_SCUSD_AMOUNT] (state, amount) {
      state.synthScUSDAmount = amount;
    },
    [types.SET_ASSET_TOTAL_VALUE] (state, amount) {
      state.assetTotalValue = amount;
    },
    [types.SET_ALL_ASSETS] (state, assets) {
      state.allAssets = assets;
    },
    [types.SET_REFRESH] (state, enable) {
      state.refresh = enable;
    },
  },
  actions: {
    getAllProducts({ commit }){
      const allProducts = Products.allProducts;
      commit(types.GET_ALL_PRODUCTS_DATA, allProducts);
    },
    // 设置所有产品带有价格数据
    setAllProducts({ commit }, products){
      commit(types.GET_ALL_PRODUCTS_DATA, products);
    },
    // 第一次选中没有价格数据
    getFocusedProduct({ commit }, {focusCode}){
      const product = Products.allProducts.find(product => product.pairCode.toUpperCase() === (focusCode || '').toUpperCase()) || {};
      commit(types.GET_FOCUSED_PRODUCT_DATA, product);
    },
    // 设置选中的产品带有价格数据
    setFocusedProduct({ commit }, product){
      commit(types.SET_FOCUSED_PRODUCT_DATA, product);
    },
    setSynthScUSDAmount({ commit }, amount){
      commit(types.SET_SYNTH_SCUSD_AMOUNT, amount);
    },
    setAssetTotalValue({ commit }, amount){
      commit(types.SET_ASSET_TOTAL_VALUE, amount);
    },
    setAllAssets({ commit }, assets){
      commit(types.SET_ALL_ASSETS, assets);
    },
    setRefresh({ commit }, enable){
      commit(types.SET_REFRESH, enable);
    },
  }
};
