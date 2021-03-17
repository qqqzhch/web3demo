<template>
  <div class="balance">
    <div class="box-shadow">
      <Overview />
    </div>
    <div class="content">
      <div
        v-for="poolItem in poolsData"
        :key="poolItem.tokenName"
        class="build-item mrg-tb-20"
      >
        <div class="build-grid-1">
          <div>
            <div>{{ poolItem.tokenTitle }}</div>
            <div>目标抵押率：{{ BigNumber(1).div(poolItem.targetRatio).times(100) }}%</div>
            <div>当前价格：{{ BigNumber(poolItem.currencyPrice).toFixed(6) }} USD</div>
          </div>
          <div class="build-grid-2">
            <div>
              <div>清算价格：{{ getLiquidationPrice(poolItem) }} USD</div>
              <div>抵押资产：{{ BigNumber(poolItem.pledgeNumber) }} {{ poolItem.tokenName }}</div>
              <div>当前债务：{{ BigNumber(poolItem.currentDebt).toFixed(6) }} scUSD</div>
              <div>可释放LAMB：{{ BigNumber(poolItem.unlockedCollateral).toFixed(6) }} {{ poolItem.tokenName }}</div>
              <div>可铸造额度：{{ BigNumber(poolItem.maxMintable).toFixed(6) }} scUSD</div>
              <div>当前抵押率：{{ BigNumber(1).div(poolItem.collateralisationRatio).times(100) }}%</div>
            </div>
            <div>
              <div>
                <button
                  class="btn"
                  @click="openJoinDialog(poolItem)"
                >
                  抵押/提取资产
                </button>
              </div>
              <div class="mrg-tb-20">
                <button
                  class="btn"
                  @click="openMintDialog(poolItem)"
                >
                  铸造/偿还债务
                </button>
              </div>
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
    margin-top: 24px;
      .title {
          font-size: 20px;
          font-weight: 500;
          color: #14171C;
          line-height: 24px;
      }
      .content {
          position: relative;
          z-index: 100;
          margin-top: 20px;
          .build-item {
            position: relative;
            display: inline-block;
            padding: 20px;
            width: 100%;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.06);
            border-radius: 6px;
          }

          .build-grid-1{
            display: grid;
            grid-template-columns: 30% 70%;
            justify-content: space-between;
          }
          .build-grid-2{
            display: grid;
            grid-template-columns: 70% 30%;
            justify-content: space-between;
          }
          .pull-right {
              position: absolute;
              top: 30px;
              right: 20px;
              color: #14171c66;
          }
          .btn{
              line-height: 40px;
              height: 40px;
              padding: 0px 20px;
              background-color: #0058FF;
              color: rgb(255, 255, 255);
          }
      }
  }
</style>
