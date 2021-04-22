<template>
  <div class="balance">
    <div class="overview-warpper">
      <Overview />
    </div>
    <div v-if="isOpen" class="CDP-content">
      <div v-if="!poolsData.length">
        <Loading />
      </div>
      <div v-for="poolItem in poolsData" :key="poolItem.tokenTitle">
        <div class="pool-item-warp">
          <div class="item-top">
            <div class="item-title">
              <span>
                {{ $t('build-liquidation-price') }}:
                <span class="f-danger">$ {{ getLiquidationPrice(poolItem) }}</span>
              </span>
              <span>
                {{ $t('build-liquidation-ratio') }}:
                <span class="f-warning">{{ BigNumber(poolItem.liquidationRatio).times(100) }}%</span>
              </span>
            </div>
            <div class="text-right">
              <button class="btn create-btn" @click="openCloseDialog(poolItem)">
                关闭
              </button>
            </div>
          </div>
          <div class="CDP-item">
            <div class="small-item pool-wapper flex flex-col items-center">
              <img :src="getTokenImg(poolItem.tokenName)" :alt="poolItem.tokenName">
              <div>{{ poolItem.tokenTitle }}</div>
            </div>
            <div class="small-item line">
              <div>
                <span>{{ $t('build-current-coll-ratio') }}</span>
                <div class="circle-wapper">
                  <span
                    :class="{
                      'bg-green': poolItem.collateralRatio >= 1.5,
                      'bg-warning': poolItem.collateralRatio < 1.5 && poolItem.collateralRatio > 1.1,
                      'bg-danger': poolItem.collateralRatio <= 1.1,
                    }"
                  />
                  <p
                    :class="{
                      'f-green': poolItem.collateralRatio >= 1.5,
                      'f-warning': poolItem.collateralRatio < 1.5 && poolItem.collateralRatio > 1.1,
                      'f-danger': poolItem.collateralRatio <= 1.1,
                    }"
                  >
                    {{ BigNumber(poolItem.collateralRatio).times(100).toFixed(2) }}%
                  </p>
                </div>
              </div>
              <div class="mrg-tb-20">
                <span>{{ $t('build-current-price') }}</span>
                <p class="f-green">
                  $ {{ poolItem.currencyPrice }}
                </p>
              </div>
            </div>
            <div class="small-item text-center">
              <div>
                <span>{{ $t('build-Deposited') }}</span>
                <p>{{ poolItem.depositAmount }} {{ poolItem.tokenName }}</p>
              </div>
              <div class="mrg-tb-10">
                <button class="btn" @click="openJoinDialog(poolItem)">
                  {{ $t('build-Deposit') }}
                </button>
              </div>
              <div>
                <a href="javascript:;" @click="openExitDialog(poolItem)">释放</a>
              </div>
            </div>
            <div class="small-item text-center">
              <div>
                <span>当前债务</span>
                <p>
                  {{ poolItem.debtAmount | formatNormalValue }} {{ poolItem.stableName }}
                </p>
              </div>
              <div class="mrg-tb-10">
                <button class="btn" @click="openMintDialog(poolItem)">
                  继续借
                </button>
              </div>
              <div>
                <a href="javascript:;" @click="openBurnDialog(poolItem)">偿还</a>
              </div>
            </div>
            <div class="btn-warpper" />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="CDP-content">
      <div class="create-vault-content">
        <button class="btn create-btn" @click="toPage('create')">
          创建金库
        </button>
      </div>
    </div>
    <div class="modal-wrapper">
      <JoinDialog ref="tokenJoin" />
      <MintDialog ref="tokenMint" />
      <BurnDialog ref="tokenBurn" />
      <ExitDialog ref="tokenExit" />
      <CloseDialog ref="tokenClose" />
    </div>
    <haveSendDialog ref="haveSendtx" />
  </div>
</template>

<script src="./index.js" ></script>
<style lang="less">
.f-green {
  color: #00d075 !important;
}
.f-warning {
  color: rgba(255, 181, 0, 1) !important;
}
.f-danger {
  color: #ff3c00 !important;
}
.bg-green {
  background-color: #00d075 !important;
}
.bg-warning {
  background-color: rgba(255, 181, 0, 1) !important;
}
.bg-danger {
  background-color: #ff3c00 !important;
}

.valut-modal {
  .ivu-modal-body {
    padding: 0px;
  }
}

.balance {
  margin-top: 24px;
  /*.title2 {*/
  /*height: 24px;*/
  /*font-size: 20px;*/
  /*font-family: Gilroy-Medium, Gilroy;*/
  /*font-weight: 500;*/
  /*color: #14171c;*/
  /*line-height: 24px;*/
  /*}*/
  .CDP-content {
    /*margin: 24px 0px 50px 0px;*/
    /*padding: 32px 44px;*/
    /*box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);*/
    .pool-item-warp,
    .create-vault-content {
      margin-top: 24px;
      padding: 24px;
      box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
    }
    .create-vault-content {
      position: relative;
      min-height: 200px;
      line-height: 200px;
      text-align: center;
      .create-btn {
        position: absolute;
        left: 45%;
        top: 40%;
        width: 120px;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        font-weight: 500;
        color: #0058ff;
        background: rgba(0, 88, 255, 0.1);
        border-radius: 16px;
        &:hover {
          background: rgba(0, 88, 255, 0.2);
        }
      }
    }
    .item-top {
      display: grid;
      grid-template-columns: 30% 70%;
      justify-content: space-between;
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      span {
        color: #828489;
      }
      .item-title {
        /*text-align: right;*/
        > span {
          margin-right: 20px;
        }
      }
      .text-right {
        position: relative;
        .create-btn {
          position: absolute;
          right: 0px;
          top: -5px;
          width: 120px;
          height: 32px;
          line-height: 32px;
          font-size: 14px;
          font-weight: 500;
          color: #0058ff;
          background: rgba(0, 88, 255, 0.1);
          border-radius: 16px;
          &:hover {
            background: rgba(0, 88, 255, 0.2);
          }
        }
      }
    }
    .CDP-item {
      display: flex;
      align-items: center;
      cursor: pointer;
      margin-top: 24px;
      .small-item {
        width: 25%;
        .circle-wapper {
          display: flex;
          align-items: center;
          span {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
          }
        }
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
            font-size: 20px;
            font-family: Gilroy-Medium, Gilroy;
            font-weight: 500;
            color: #14171c;
            line-height: 19px;
            margin-top: 5px;
          }
          a {
            text-decoration: underline;
          }
        }
      }
      .line {
        width: 30%;
        position: relative;
      }
      .line::after {
        content: '';
        width: 2px;
        height: 90px;
        background: rgba(0, 0, 0, 0.06);
        position: absolute;
        right: 90px;
        top: 23px;
      }
      .pool-wapper {
        width: 18%;
      }

      .btn {
        margin-left: 25%;
        width: 160px;
        height: 36px;
        line-height: 36px;
        border-radius: 18px;
        background-color: #0058ff;
        color: rgb(255, 255, 255);
        &:hover {
          background-color: #0025ff;
        }
      }
    }
  }
}
</style>
