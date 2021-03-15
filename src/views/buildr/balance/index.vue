<template>
  <div class="balance">
    <div class="title">
      我的金库
    </div>
    <div class="content">
      <div
        class="build-item"
      >
        <div class="build-grid-1">
          <div>
            <div>{{ currency }}</div>
            <div>目标抵押率：{{ targetRatio * 100 }}%</div>
          </div>
          <div class="build-grid-2">
            <div>
              <div>清算价格：{{ liquidationPrice }} USD</div>
              <div>抵押资产：{{ pledgeNumber }} LAMB</div>
              <div>当前债务：{{ currentDebt }} scUSD</div>
              <div>可释放LAMB：{{ unlockedCollateral }} LAMB</div>
              <div>可提取授信的scUSD：{{ maxMintable }} scUSD</div>
              <div>当前抵押率：{{ collateralisationRatio * 100 }}%</div>
            </div>
            <div>
              <div>
                <button
                  class="btn"
                  @click="openJoinDialog"
                >
                  抵押 & 提取 LAMB
                </button>
              </div>
              <div class="mrg-tb-20">
                <button
                  class="btn"
                  @click="openMintDialog"
                >
                  铸造 & 偿还 scUSD
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
