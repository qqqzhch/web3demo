import Vue from "vue";
import VueI18n from "vue-i18n";
import cn from "./lang/zh.js";
import en from "./lang/en.js";
import iviewen from "view-design/dist/locale/en-US";
import iviewzh from "view-design/dist/locale/zh-CN";
import jscookie from "js-cookie";

import swapzh from "./lang/swap/swap.zh.js";
import swapen from "./lang/swap/swap.en.js";

import buildrzh from "./lang/buildr/buildr.zh.js";
import buildren from "./lang/buildr/buildr.en.js";


import earnEN from './lang/earn/earn.en.js';
import earnZH from './lang/earn/earn.zh.js';

import poolzh from './lang/pool/pool.zh.js';
import poolen from './lang/pool/pool.en.js';

import troveszh from './lang/troves/troves.zh.js';
import trovesen from './lang/troves/troves.en.js';

Vue.use(VueI18n);
const langList = ["en", "zh"];

const initKey = initLangKey();

const i18n = new VueI18n({
  locale: initKey,
  messages: {
    en: Object.assign({}, iviewen,en,swapen,earnEN, buildren,poolen,trovesen),
    zh: Object.assign({}, iviewzh,cn,swapzh,earnZH, buildrzh,poolzh,troveszh),
  },
});

// 使view-design多语言生效
Vue.locale = () => {};


// 初始化语言key
function initLangKey() {
  console.log('initLangKey');
  let langkey = jscookie.get("langkey");
  // 如果未初始化，通过浏览器判断应该设置成啥语言
  if (!langkey) {
    const lang = (navigator.language || navigator.browserLanguage)
      .toLowerCase()
      .substring(0, 2);
    switch (lang) {
      case "en":
        langkey = "en";
        break;
      case "zh":
        langkey = "zh";
        break;

      default:
        langkey = "en";
        break;
    }
  } else if (!langList.includes(langkey)) {
    // 如果不是en,zh,默认en
    langkey = "en";
  }
  jscookie.set("langkey", langkey, { expires: 180 });
  return langkey;
}

export default i18n;
