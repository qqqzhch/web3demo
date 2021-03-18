<template>
  <div class="balance">
    <div class="overview-warpper">
      <Overview />
    </div>
    <div class="CDP-content">
      <div class="title">
        My CDPs
      </div>
      <div v-for="poolItem in poolsData" :key="poolItem.tokenTitle">
        <div class="CDP-item">
          <div class="small-item flex flex-col items-center">
            <img src="../../../assets/img/lambda48.svg" alt="lambda">
            <div>{{ poolItem.tokenTitle }}</div>
          </div>
          <div class="small-item">
            <div>
              <span>Target Coll. Ratio</span>
              <p>{{ BigNumber(1).div(poolItem.targetRatio).times(100) }}%</p>
            </div>
            <div class="mrg-tb-20">
              <span>Current Price</span>
              <p>{{ BigNumber(poolItem.currencyPrice).toFixed(6) }} USD</p>
            </div>
          </div>
          <div class="small-item">
            <div>
              <span>Collateral</span>
              <p>{{ BigNumber(poolItem.pledgeNumber) }} {{ poolItem.tokenName }}</p>
            </div>
            <div class="mrg-tb-20">
              <span>Current Debt</span>
              <p>{{ BigNumber(poolItem.currentDebt).toFixed(6) }} scUSD</p>
            </div>
          </div>
          <div class="small-item">
            <div>
              <span>Avail to Withdraw</span>
              <p>{{ BigNumber(poolItem.unlockedCollateral).toFixed(6) }} {{ poolItem.tokenName }}</p>
            </div>
            <div class="mrg-tb-20">
              <span>Avail to Generate</span>
              <p>{{ BigNumber(poolItem.maxMintable).toFixed(6) }} scUSD</p>
            </div>
          </div>
          <div class="small-item">
            <div>
              <span>Current Coll. Ratio</span>
              <p>{{ BigNumber(1).div(poolItem.collateralisationRatio).times(100) }}%</p>
            </div>
            <div class="mrg-tb-20">
              <span>Liquidation Price</span>
              <p>{{ getLiquidationPrice(poolItem) }} USD</p>
            </div>
          </div>
          <div class="btn-warpper">
            <div>
              <button class="btn" @click="openJoinDialog(poolItem)">
                Collateral/Withdraw {{ poolItem.tokenName }}
              </button>
            </div>
            <div class="mrg-tb-20">
              <button class="btn" @click="openMintDialog(poolItem)">
                Generate/Payback scUSD
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-wrapper">
      <JoinDialog ref="tokenJoin" />
      <MintDialog ref="tokenMint" />
      <BurnDialog ref="tokenBurn" />
      <ExitDialog ref="tokenExit" />
    </div>
    <haveSendDialog ref="haveSendtx" />
  </div>
</template>

<script src="./index.js" ></script>
<style lang="less" scoped>
.balance {
  margin: 24px 0 0 100px;
  .title {
    margin-top: 24px;
    height: 24px;
    font-size: 20px;
    font-family: Gilroy-Medium, Gilroy;
    font-weight: 500;
    color: #14171c;
    line-height: 24px;
  }
  .CDP-item {
    padding: 24px;
    display: flex;
    align-items: center;
    cursor: pointer;
    box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
    margin-top: 24px;
    .small-item {
      margin:0 50px;
      div {
        span {
          height: 16px;
          font-size: 14px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #828489;
          line-height: 16px;
        }
        p {
          height: 19px;
          font-size: 16px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #14171c;
          line-height: 19px;
          margin-top: 5px;
        }
      }
    }
    .btn-warpper {
      flex: 1;
      .btn {
        width: 100%;
        line-height: 40px;
        height: 40px;
        padding: 0px 10px;
        background-color: #0058ff;
        color: rgb(255, 255, 255);
      }
    }
  }
}
</style>
