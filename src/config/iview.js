// 按需加载ui库组件
import { Modal, Notice } from "view-design";
export default function(Vue) {
  Vue.component("Modal", Modal);
  Vue.component("Notice", Notice);
  Vue.prototype.$Notice = Notice;
}
