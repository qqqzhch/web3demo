// 按需加载ui库组件
import { Modal, Notice,Spin,Icon,Scroll, Select, Option,Table,Dropdown,DropdownItem,DropdownMenu } from "view-design";

export default function(Vue) {
  Vue.component("Modal", Modal);
  Vue.component("Notice", Notice);
  Vue.component("Spin", Spin);
  Vue.component("Icon", Icon);
  Vue.component("Scroll", Scroll);
  Vue.component("Table", Table);
  Vue.component("Select", Select);
  Vue.component("Option", Option);
  Vue.component("Table", Table);
  Vue.component("Dropdown", Dropdown);
  Vue.component("DropdownItem", DropdownItem);
  Vue.component("DropdownMenu", DropdownMenu);

  Vue.prototype.$Notice = Notice;
}
