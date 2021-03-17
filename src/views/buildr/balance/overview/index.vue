<template>
  <div class="overview-warp">
    <div class="title">
      Overview
    </div>
    <div class="content-warpper flex items-center">
      <div class="content">
        <div class="total-warpper">
          <h2>总抵押物价值</h2>
          <p><span>{{ BigNumber(totalValue).toFixed(6) }}</span> scUSD</p>
        </div>
        <div class="other-warpper flex items-center">
          <div>
            <h2>总负债</h2>
            <p><span>-{{ BigNumber(totalDebt).toFixed(6) }}</span> scUSD </p>
          </div>
          <div>
            <h2>授信的CUSD</h2>
            <p><span>{{ BigNumber(totalMaxMintable).toFixed(6) }}</span> scUSD </p>
          </div>
          <div>
            <h2>稳定费</h2>
            <p><span>{{ BigNumber(totalFee).toFixed(6) }}</span> scUSD</p>
          </div>
        </div>
        <div class="refresh">
          <img src="../../../../assets/img/refresh.svg" alt="refresh">
        </div>
      </div>
      <div class="content-gray">
        <span />
      </div>
    </div>
  </div>
</template>

<script src="./index.js"></script>

<style lang="less" scoped>
.overview-warp {
  .title {
    height: 24px;
    font-size: 20px;
    font-family: Gilroy-Medium, Gilroy;
    font-weight: 500;
    color: #14171c;
    pne-height: 24px;
  }
  .content-warpper {
    margin-top: 24px;
    .content {
      margin-right: 24px;
      width: 56%;
      background: linear-gradient(270deg, #3f5efb 0%, #fc466b 100%);
      border-radius: 12px;
      padding: 24px;
      position: relative;
      div {
        h2 {
          height: 16px;
          font-size: 14px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #ffffff;
          line-height: 16px;
        }
        p {
          height: 24px;
          font-size: 20px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #ffffff;
          line-height: 24px;
          margin-top: 8px;
        }
      }
      .total-warpper {
        p {
          height: 38px;
          font-size: 32px;
          font-family: Gilroy-Bold, Gilroy;
          font-weight: bold;
          color: #ffffff;
          line-height: 38px;
          margin: 8px 0 16px;
        }
      }
      .other-warpper {
        padding-top: 10px;
        div {
          margin-right: 50px;
        }
      }
      .refresh{
        cursor: pointer;
        position: absolute;
        right: 20px;
        top: 20px;
      }
    }
    .content-gray {
      flex: 1;
      width: 20%;
      height: 184px;
      background: #2c3340;
      border-radius: 12px;
    }
  }
}
</style>
