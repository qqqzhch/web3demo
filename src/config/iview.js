// 按需加载ui库组件
import { Modal, Notice,Spin,Icon,Scroll } from "view-design";
export default function(Vue) {
  Vue.component("Modal", Modal);
  Vue.component("Notice", Notice);
  Vue.component("Spin", Spin);
  Vue.component("Icon", Icon);

  Vue.component("Scroll", Scroll);


  
  Vue.prototype.$Notice = Notice;
}
