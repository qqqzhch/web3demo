import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index.js";
import "view-design/dist/styles/iview.css";
import "normalize.css";
import "./common/css/index.less";
import view from "./config/iview.js";
import util from "./common/js/util.js";

import filters from "./common/js/filter.js";

// 按需加载view-design组件
view(Vue);

// 使用功能函数
Vue.use(util);
Vue.config.productionTip = false;

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});


new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
