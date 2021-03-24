<template>
  <div
    class="button-wrapper"
    :style="`width: ${width}; height: ${height};`"
  >
    <button
      v-if="type === 'normal'"
      class="btn"
      :style="`background-color: ${background}; color: ${color};border-radius: ${borderRadius}`"
    >
      <slot />
    </button>

    <a
      v-if="type === 'link'"
      :href="href"
      target="_blank"
      class="btn link-btn"
    >
      <slot />
    </a>

    <router-link
      v-if="type === 'router'"
      :to="to"
      class="btn router-btn"
    >
      <slot />
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    // 按钮类型 normal | link | router
    type: {
      type: String,
      default: 'normal',
    },
    background:{
        type: String,
        default:'#015afe'
    },
    borderRadius:{
        type: String,
        default:'6px'
    },
    color:{
        type: String,
        default:'#fff'
    },
    width: {
      type: String,
    },
    height: {
      type: String,
    },
    // 路由按钮，当type为 router时 传入
    to: {
      type: String,
    },

    // 链接按钮，当type为 link 时使用
    href: {
      type: String,
    },
  },
};
</script>

<style lang="less" scoped>
</style>