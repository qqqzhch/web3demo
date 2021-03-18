<template>
  <div class="guide-warpper flex items-center justify-center">
    <div class="guide-left">
      <h2>Buildr</h2>
      <p>Stake crypto assets, build stable scUSD.</p>
      <button @click="CreateCDP">
        Create CDP
      </button>
    </div>
    <div class="guide-right">
      <img src="../../../assets/img/guide.svg" alt="guide">
    </div>
  </div>
</template>

<script src="./index.js"></script>

<style lang="less" scoped>
.guide-warpper {
  margin: 50px 0;
  width: 100%;
  height: 100%;
  .guide-left {
    margin-right: 120px;
    h2 {
      height: 49px;
      font-size: 40px;
      font-family: Gilroy-Bold, Gilroy;
      font-weight: bold;
      color: #14171c;
      line-height: 49px;
    }
    p {
      margin: 16px 0 24px;
      height: 22px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #14171c;
      line-height: 22px;
    }
    button {
      width: 180px;
      height: 48px;
      background: #0058ff;
      border-radius: 6px;
      text-align: center;
      font-size: 16px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #ffffff;
      line-height: 19px;
    }
  }
}
</style>
