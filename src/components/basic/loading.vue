<template>
  <div
    class="demo-spin-col"
  >
    <Spin fix>
      <Icon
        type="ios-loading"
        size="30"
        class="demo-spin-icon-load"
      />
      <div>Loading</div>
    </Spin>
  </div>
</template>
<script>
export default {
    
};
</script>
<style lang="less" scoped>
.demo-spin-col{
        min-height: 100px;
        position: relative;
        // border: 1px solid #eee;
      
    }
     .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
</style>