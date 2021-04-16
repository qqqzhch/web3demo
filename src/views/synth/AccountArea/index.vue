<template>
  <div class="account-waarpper">
    <div class="title-warpper">
      <h2>Account Net Value</h2>
      <p>$ {{ accountNetValue | formatNormalValue }}</p>
    </div>
    <div class="System-warpper">
      <div>
        <p>System Debt</p>
        <span>$ {{ totalDebt | formatNormalValue }}</span>
      </div>
      <div>
        <p>Synth Value</p>
        <span>$ {{ assetTotalValue | formatNormalValue }}</span>
      </div>
      <!-- <div>
        <p>scUSD Value</p>
        <span>$500</span>
      </div> -->
    </div>
    <div class="balance-warpper">
      <div class="flex items-center justify-between">
        <span class="balance-Title">scUSD Balance</span>
        <span>Available to deposit {{ scUSDBalance | formatNormalValue }} scUSD</span>
      </div>
      <p>{{ totalScUSD | formatNormalValue }}</p>
    </div>
    <div class="button-warpper flex justify-between">
      <button @click="openDepositDialog">
        Deposit
      </button>
      <button @click="openDialog">
        Withdraw
      </button>
    </div>

    <div>
      <withdrawDialog ref="withDialog" />
      <depositDialog ref="DepositDialog" />
    </div>
  </div>
</template>

<script src="./index.js"></script>

<style lang="less" scoped>
.account-waarpper {
  width: 100%;
  height: 322px;
  background: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 24px 20px;
  .title-warpper {
    h2 {
      height: 16px;
      font-size: 14px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #8690a8;
      line-height: 16px;
    }
    p {
      height: 30px;
      font-size: 26px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #14171c;
      line-height: 30px;
      margin-top: 10px;
    }
  }
  .System-warpper {
    display: flex;
    align-items: center;
    // justify-content: space-between;
    margin-top: 16px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    div{
      margin-right: 40px;
    }
    p {
      height: 16px;
      font-size: 14px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #8690a8;
      line-height: 16px;
      margin-bottom: 10px;
    }
    span {
      height: 19px;
      font-size: 16px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #00d075;
      line-height: 19px;
    }
  }
  .balance-warpper {
    margin-top: 20px;
    p {
      margin-top: 10px;
      height: 30px;
      font-size: 26px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #14171c;
      line-height: 30px;
    }
    span {
      height: 14px;
      font-size: 12px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #0058ff;
      line-height: 14px;
    }
    .balance-Title {
      height: 16px;
      font-size: 14px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #8690a8;
      line-height: 16px;
    }
  }
  .button-warpper {
    margin-top: 20px;
    button {
      width: 45%;
      height: 36px;
      background: #0058ff;
      border-radius: 18px;
      font-size: 14px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #ffffff;
      line-height: 36px;
    }
  }
}
</style>
