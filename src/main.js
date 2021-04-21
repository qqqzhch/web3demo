import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index.js";
import "view-design/dist/styles/iview.css";
import "normalize.css";
import "./common/css/index.less";
import view from "./config/iview.js";
import util from "./common/js/util.js";
import i18n from "./i18n/index.js";
import filters from "./common/js/filter.js";
import VueClipboard from 'vue-clipboard2';
import BigNumber from "bignumber.js";
import config from './config/config.js';

Vue.use(VueClipboard);
// 按需加载view-design组件
view(Vue);

// 使用功能函数
Vue.use(util);

Vue.prototype.$BigNumber = BigNumber;
Vue.prototype.$globalConfig = config;

Vue.config.productionTip = false;

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});


new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
