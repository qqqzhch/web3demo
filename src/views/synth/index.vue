<template>
  <div class="synth-content">
    <div class="flex justify-between">
      <div class="left-warpper">
        <ProductsTable />
      </div>
      <div class="center-warpper">
        <ChartArea />
        <OrderFormArea />
      </div>
      <div class="right-warpper">
        <AccountArea />
        <AssetsArea />
      </div>
    </div>
    <OrdersTable />
  </div>
</template>

<script src="./index.js"></script>

<style lang="less">
.synth-content {
  margin-top: 10px;
  width: 100%;
  .left-warpper {
    width: 420px;
  }
  .center-warpper {
    flex: 1;
    margin: 0 10px;
  }
  .right-warpper {
    width: 420px;
  }
}
</style>
