<template>
  <div class="balance">
    <div class="overview-warpper">
      <Overview />
    </div>
    <!--pc content-->
    <div v-if="isPC">
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
                  {{ $t('vault-close-trove') }}
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
                        'bg-warning': poolItem.collateralRatio < 1.5 && poolItem.collateralRatio >= 1.2,
                        'bg-danger': poolItem.collateralRatio < 1.2,
                      }"
                    />
                    <p
                      :class="{
                        'f-green': poolItem.collateralRatio >= 1.5,
                        'f-warning': poolItem.collateralRatio < 1.5 && poolItem.collateralRatio > 1.2,
                        'f-danger': poolItem.collateralRatio < 1.2,
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
                  <p>{{ poolItem.depositAmount | formatNormalValue }} {{ poolItem.tokenName }}</p>
                </div>
                <div class="mrg-tb-10">
                  <button class="btn" @click="openJoinDialog(poolItem)">
                    {{ $t('build-Deposit') }}
                  </button>
                </div>
                <div>
                  <a href="javascript:;" @click="openExitDialog(poolItem)">{{ $t('vault-withdrawal') }}</a>
                </div>
              </div>
              <div class="small-item text-center">
                <div>
                  <span>{{ $t('vault-current-debt') }}</span>
                  <p>
                    {{ poolItem.debtAmount | formatNormalValue }} {{ poolItem.stableName }}
                  </p>
                </div>
                <div class="mrg-tb-10">
                  <button class="btn" @click="openMintDialog(poolItem)">
                    {{ $t('vault-add-borrow') }}
                  </button>
                </div>
                <div>
                  <a href="javascript:;" @click="openBurnDialog(poolItem)">{{ $t('vault-repay') }}</a>
                </div>
              </div>
              <div class="btn-warpper" />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="CDP-content">
        <div class="create-vault-content">
          <button v-if="ethAddress" class="btn create-btn" @click="toPage('create')">
            {{ $t('vault-creted') }}
          </button>
          <button v-else class="btn create-btn disableBtn">
            {{ $t('vault-creted') }}
          </button>
        </div>
      </div>
    </div>
    <!--mobild content-->
    <div v-if="!isPC">
      <div v-if="isOpen" class="CDP-content">
        <div v-if="!poolsData.length">
          <Loading />
        </div>
        <div v-for="poolItem in poolsData" :key="poolItem.tokenTitle">
          <div class="pool-item-warp">
            <div class="item-top">
              <div class="item-title">
                <div class="small-item pool-wapper flex flex-col">
                  <img :src="getTokenImg(poolItem.tokenName)" :alt="poolItem.tokenName" width="48px">
                  <span class="token-title">{{ poolItem.tokenTitle }}</span>
                </div>
              </div>
              <div class="text-right">
                <button class="btn create-btn" @click="openCloseDialog(poolItem)">
                  {{ $t('vault-close-trove') }}
                </button>
              </div>
            </div>

            <div class="item-info">
              <div>
                <div class="grid-4-1">
                  <span>{{ $t('build-liquidation-price') }}</span>
                  <span class="f-danger">$ {{ getLiquidationPrice(poolItem) }}</span>
                </div>
                <div class="grid-4-1">
                  <span>{{ $t('build-liquidation-ratio') }}</span>
                  <span class="f-warning">{{ BigNumber(poolItem.liquidationRatio).times(100) }}%</span>
                </div>
              </div>
              <div>
                <div class="grid-4-1">
                  <span>{{ $t('build-current-coll-ratio') }}</span>
                  <span
                    :class="{
                      'f-green': poolItem.collateralRatio >= 1.5,
                      'f-warning': poolItem.collateralRatio < 1.5 && poolItem.collateralRatio > 1.2,
                      'f-danger': poolItem.collateralRatio < 1.2,
                    }"
                  >
                    {{ BigNumber(poolItem.collateralRatio).times(100).toFixed(2) }}%
                  </span>
                </div>
                <div class="grid-4-1">
                  <span>{{ $t('build-current-price') }}</span>
                  <span class="f-green">
                    $ {{ BigNumber(poolItem.currencyPrice).toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="CDP-item">
              <div class="text-center">
                <div>
                  <span>{{ $t('build-Deposited') }}</span>
                  <p>{{ poolItem.depositAmount | formatNormalValue }} {{ poolItem.tokenName }}</p>
                </div>
                <div class="mrg-tb-10">
                  <button class="btn" @click="openJoinDialog(poolItem)">
                    {{ $t('build-Deposit') }}
                  </button>
                </div>
                <div>
                  <a href="javascript:;" @click="openExitDialog(poolItem)">{{ $t('vault-withdrawal') }}</a>
                </div>
              </div>
              <div class="text-center">
                <div>
                  <span>{{ $t('vault-current-debt') }}</span>
                  <p>
                    {{ poolItem.debtAmount | formatNormalValue }} {{ poolItem.stableName }}
                  </p>
                </div>
                <div class="mrg-tb-10 text-center">
                  <button class="btn" @click="openMintDialog(poolItem)">
                    {{ $t('vault-add-borrow') }}
                  </button>
                </div>
                <div>
                  <a href="javascript:;" @click="openBurnDialog(poolItem)">{{ $t('vault-repay') }}</a>
                </div>
              </div>
              <div class="btn-warpper" />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="CDP-content">
        <div class="create-vault-content">
          <button v-if="ethAddress" class="btn create-btn" @click="toPage('create')">
            {{ $t('vault-creted') }}
          </button>
          <button v-else class="btn create-btn disableBtn">
            {{ $t('vault-creted') }}
          </button>
        </div>
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
.text-center {
  text-align: center;
}

.grid-4-1 {
  display: grid;
  grid-template-columns: 65% 35%;
  justify-content: space-between;
}

.valut-modal {
  .ivu-modal-body {
    padding: 0px;
  }
}

@media screen and (max-width: 1200px) {
  .balance {
    margin-top: 24px;
    .CDP-content {
      .pool-item-warp,
      .create-vault-content {
        margin-top: 24px;
        padding: 10px;
        box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
        text-align: center;
      }
      .create-vault-content {
        position: relative;
        min-height: 200px;
        line-height: 200px;
        text-align: center;
        .create-btn {
          display: inline-block;
          width: 120px;
          height: 32px;
          line-height: 32px;
          font-size: 14px;
          font-weight: 500;
          color: #605AA5;
          background: rgba(0, 88, 255, 0.1);
          border-radius: 16px;
          &:hover {
            background: rgba(0, 88, 255, 0.2);
          }
        }
      }
      .item-top {
        position: relative;
        display: grid;
        grid-template-columns: 50% 50%;
        justify-content: space-between;
        padding-bottom: 10px;
        .token-title {
          position: absolute;
          left: 60px;
          top: 15px;
          z-index: 5;
          font-size: 16px;
          color: #14171c;
        }
        span {
          color: #828489;
          font-size: 14px;
        }
        .item-title {
          > span {
          }
        }
        .text-right {
          position: relative;
          .create-btn {
            position: absolute;
            right: 0px;
            top: 10px;
            width: 120px;
            height: 32px;
            line-height: 32px;
            font-size: 14px;
            font-weight: 500;
            color: #605AA5;
            background: rgba(0, 88, 255, 0.1);
            border-radius: 16px;
            &:hover {
              background: rgba(0, 88, 255, 0.2);
            }
          }
        }
      }
      .item-info {
        display: grid;
        grid-template-columns: 50% 50%;
        justify-content: space-between;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        span {
          color: #828489;
          font-size: 14px;
        }
        .item-title {
          > span {
          }
        }
      }
      .CDP-item {
        display: grid;
        grid-template-columns: 50% 50%;
        justify-content: space-between;
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
          display: inline-block;
          width: 160px;
          height: 36px;
          line-height: 36px;
          border-radius: 18px;
          background-color: #605AA5;
          color: rgb(255, 255, 255);
          &:hover {
            background-color: #6c66b2;
          }
        }
      }
    }
  }
}
@media screen and (min-width: 1201px) {
  .balance {
    margin-top: 24px;
    .CDP-content {
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
          color: #605AA5;
          background: rgba(0, 88, 255, 0.1);
          border-radius: 16px;
          &:hover {
            background: rgba(0, 88, 255, 0.2);
          }
        }
      }
      .item-top {
        display: grid;
        grid-template-columns: 50% 50%;
        justify-content: space-between;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        span {
          color: #828489;
        }
        .item-title {
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
            color: #605AA5;
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
          background-color: #605AA5;
          color: rgb(255, 255, 255);
          &:hover {
            background-color: #6c66b2;
          }
        }
      }
    }
  }
}
</style>
