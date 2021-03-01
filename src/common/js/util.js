export default {
  install(Vue) {
    // 防止按钮点击频繁请求
    Vue.directive("throttle", {
      inserted(el, binding) {
        el.addEventListener("click", () => {
          el.style.pointerEvents = "none";
          if (!el.disabled) {
            setTimeout(() => {
              el.style.pointerEvents = "auto";
            }, binding.value || 500);
          }
        });
      },
    });

    Vue.directive("clickoutside", {
      bind: function(el, binding) {
        function documentHandler(e) {
          if (el.contains(e.target)) {
            return false;
          }
          if (binding.expression) {
            binding.value(e);
          }
        }
        el.__vueClickOutSide__ = documentHandler;
        document.addEventListener("click", documentHandler);
      },
      unbind: function(el) {
        document.removeEventListener("click", el.__vueClickOutSide__);
        delete el.__vueClickOutSide__;
      },
    });
  },
};
