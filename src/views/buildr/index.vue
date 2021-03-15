<template>
  <div class="buildr-warp">
    <div class="tab">
      <div
        class="tab-item tab-active"
        @click="onChangeNav(2)"
      >
        管理金库
      </div>
      <div
        class="tab-item"
        @click="onChangeNav(3)"
      >
        历史记录
      </div>
      <div>
        <button
          class="btn"
          @click="onChangeNav(1)"
        >
          创建金库
        </button>
      </div>
    </div>
    <div v-if="pageIndex === 1">
      <CreateView />
    </div>
    <div v-if="pageIndex === 2">
      <div class="manage-content box-shadow">
        <Overview />
      </div>
      <div><BalanceView /></div>
      <!--<div class="manage-content box-shadow mrg-tb-40">-->
      <!--<ManageView />-->
      <!--</div>-->
    </div>
    <div v-if="pageIndex === 3">
      <TransactionHistory />
    </div>
  </div>
</template>

<script src="./index.js"></script>

<style lang="less">
  .buildr-warp {
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
    .f-green {
      color: #00D075;
    }
    .f-red {
      color: #FF3C00;
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
    .tab {
      margin: 24px 0px 24px 100px;
      .tab-item {
        position: relative;
        display: inline-block;
        height: 20px;
        line-height: 20px;
        margin-right: 40px;
        color: #14171c66;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
      }
      .tab-active {
        color: #14171C;
      }
      .tab-active::after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: -10px;
        transform: translateX(-50%);
        width: 48px;
        height: 2px;
        background: #0058FF;
      }
    }
    .manage-content {
      width: 100%;
      border-top-left-radius: 0px;
    }
  }
</style>
