<template>
  <div class="buildr-wrap">
    <div class="buildr-content">
      <router-view />
    </div>
  </div>
</template>

<script src="./index.js"></script>

<style lang="less">
  .buildr-wrap {
    .mrg-t-10 {
      margin-top: 10px;
    }
    .mrg-t-20 {
      margin-top: 20px;
    }
    .mrg-b-5 {
      margin-bottom: 5px;
    }
    .mrg-tb-10 {
      margin: 10px 0px;
    }
    .mrg-tb-20 {
      margin: 20px 0px;
    }
    .mrg-tb-40 {
      margin: 40px 0px;
    }
    .mrg-b-40 {
      margin-bottom: 40px;
    }
    .f-gray {
      color: #828489;
    }
    .f-size-20 {
      font-size: 20px;
    }
    input::-webkit-input-placeholder {
      color: #afb1b6;
      font-size: 24px;
    }
    .text-right {
      text-align: right;
    }
    .box-shadow {
      padding: 32px;
      box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
      border-radius: 12px;
    }
    .title{
      font-size: 20px;
      font-weight: 500;
      color: #14171C;
      line-height: 24px;
    }
  }
</style>
