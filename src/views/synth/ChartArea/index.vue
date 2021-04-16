<template>
  <div ref="chartWarp" class="chart-warpper">
    <div class="title-warpper flex items-center justify-between">
      <p>{{ focusedProduct.symbol }}</p>
      <div class="center-title">
        <p class="number">
          {{ focusedProduct.price }}
        </p>
      </div>
      <div>
        <img src="../../../assets/img/wenhao.svg" alt="wenhao">
      </div>
    </div>
    <div class="chart-area">
      <div ref="tradingview" />
    </div>
  </div>
</template>

<script src="./index.js"></script>

<style lang="less">
.chart-warpper {
  width: 100%;
  height: 380px;
  background: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 14px 20px;
  .title-warpper {
    p {
      font-size: 20px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #14171c;
      line-height: 24px;
    }
    .center-title {
      width: 70%;
      p {
        font-size: 16px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #00d075;
        line-height: 19px;
      }
      span {
        font-size: 12px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #8690a8;
        line-height: 14px;
      }
    }
    img{
      width: 24px;
    }
  }
  .chart-area {
    position: relative;
    .floating-tooltip-2 {
      width: 100px;
      height: 100px;
      position: absolute;
      display: none;
      padding: 8px;
      box-sizing: border-box;
      font-size: 12px;
      color: #131722;
      background-color: rgba(255, 255, 255, 1);
      text-align: left;
      z-index: 1000;
      top: 12px;
      left: 12px;
      pointer-events: none;
      border: 1px solid #0578ff;
      border-radius: 2px;
    }
  }
}
</style>
