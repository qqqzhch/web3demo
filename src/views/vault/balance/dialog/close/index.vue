<template>
  <div class="dialog-wrap">
    <Modal
      v-model="isOpen"
      class-name="valut-modal"
      :transfer="true"
      :footer-hide="true"
      :closable="false"
    >
      <div class="modal-content">
        <div v-if="!loading" class="padding-warpper">
          <div class="step-two">
            <div class="title-warpper">
              <h2>Close Vault</h2>
            </div>
            <div class="confirm-content flex flex-col items-center">
              <div>
                <img :src="getTokenImg(poolData.tokenName)">
                <h2>{{ poolData.depositAmount | formatNormalValue }}</h2>
                <p>{{ poolData.tokenName }}</p>
                <span>{{ $t('vault-will-withdraw') }}</span>
              </div>
              <div>
                <img :src="getTokenImg(poolData.stableName)" width="48px">
                <h2>{{ poolData.debtAmount | formatNormalValue }}</h2>
                <p>{{ poolData.stableName }}</p>
                <span>{{ $t('build-will-payback') }}</span>
              </div>
            </div>
          </div>
          <div class="items-content">
            <ul>
              <li class="title">
                {{ $t('build-debt') }}：
              </li>
              <li>
                <span>{{ poolData.debtAmount | formatNormalValue }} {{ poolData.stableName }}</span>
              </li>
            </ul>
            <ul>
              <li class="title">
                {{ $t('vault-lai-balance') }}：
              </li>
              <li>
                <span>{{ LAIBalance | formatNormalValue }} {{ poolData.stableName }}</span>
              </li>
            </ul>
            <ul>
              <li class="title">
                {{ $t('vault-liquidation-reserve') }}：
              </li>
              <li>
                <span>{{ poolData.liquidationReserve | formatNormalValue }} {{ poolData.stableName }}</span>
              </li>
            </ul>
            <ul>
              <li class="title flex">
                <span>{{ $t('build-coll-ratio') }}:</span>
                <img src="../../../../../assets/img/wenhao.svg">
              </li>
              <li v-if="poolData.collateralRatio">
                <span
                  :class="{
                    'f-green': poolData.collateralRatio >= 1.5,
                    'f-warning': poolData.collateralRatio < 1.5 && poolData.collateralRatio > 1.1,
                    'f-danger': poolData.collateralRatio <= 1.1
                  }"
                >{{ BigNumber(poolData.collateralRatio).times(100).toFixed(2) }}%</span>
              </li>
              <li v-else>
                <span>0% {{ $t('build-to') }} 0%</span>
              </li>
            </ul>
          </div>
          <div v-if="shortDebt < 0" class="notice-warpper">
            <div class="notice-content">
              <img src="../../../../../assets/img/notice-red.png">
              <p>{{ `You need ${Number(-shortDebt).toFixed(2)} ${poolData.stableName} more to close your Vault` }}</p>
            </div>
          </div>

          <div class="button-warpper">
            <button v-if="shortDebt >= 0" class="btn" @click="onCloseTroveClick">
              {{ $t('build-confirm') }}
            </button>
          </div>
          <button v-if="shortDebt < 0" class="btn btn-disabled">
            {{ $t('build-confirm') }}
          </button>
          <div class="close-warpper">
            <img src="../../../../../assets/img/closeBtn.svg" alt="closeBtn" @click="closeDialog">
          </div>
        </div>
        <div v-if="loading" class="padding-warpper">
          <Loading />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script src="./index.js"></script>

<style lang="less" scoped>
.grid-2 {
  display: grid;
  grid-template-columns: 45% 45%;
  justify-content: space-between;
}
.btn {
  line-height: 50px;
  height: 50px;
  padding-top: 3px;
  background-color: #605AA5;
  color: #ffffff;
  &:hover {
    background-color: #6c66b2;
  }
}
.btn-disabled {
  cursor: not-allowed;
  background-color: #999;
  &:hover {
    background-color: #999 !important;
  }
}
.step-one,
.step-two {
  margin-top: 20px;
}
.modal-content {
  overflow: hidden;
  padding: 0 0 10px;

  .tab-warpper {
    width: 100%;
    .tab {
      width: 100%;
      cursor: not-allowed;
      height: 60px;
      background: #ffffff;
      border-radius: 12px 12px 0px 0px;
    }
    .tab-disabled {
      width: 100%;
      cursor: pointer;
      height: 60px;
      color: #999;
      background: #f7f8f9;
      border-radius: 12px 12px 0px 0px;
    }
  }
  .padding-warpper {
    padding: 0 44px 10px;
    .notice-warpper {
      .notice-content {
        margin: 20px 0;
        display: flex;
        align-items: center;
        padding: 9px 30px;
        width: 100%;
        height: 32px;
        background: rgba(255, 60, 0, 0.1);
        border-radius: 4px;
        img {
          margin-right: 10px;
        }
        p {
          font-size: 12px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #ff3c00;
          line-height: 14px;
        }
      }
    }
    .step-one {
      h2 {
        height: 19px;
        font-size: 16px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #14171c;
        line-height: 19px;
      }
      p {
        height: 14px;
        font-size: 12px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #14171c;
        line-height: 14px;
        text-align: right;
        span {
          color: #828489;
        }
      }
      .notice {
        height: 17px;
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #605AA5;
        line-height: 17px;
        margin: 15px 0 0;
        display: flex;
        img {
          margin-left: 3px;
        }
      }
      .input-warpper {
        margin-top: 8px;
        position: relative;
        img {
          width: 24px;
          position: absolute;
          right: 85px;
          top: 25px;
        }
      }
    }
    .step-two {
      .title-warpper {
        img {
          cursor: pointer;
          position: absolute;
          left: 30px;
          top: 30px;
        }
        h2 {
          text-align: center;
          height: 28px;
          font-size: 24px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #14171c;
          line-height: 28px;
        }
      }
      .confirm-content {
        margin-top: 32px;
        display: grid;
        grid-template-columns: 50% 50%;
        justify-content: space-between;
        div {
          img {
            margin-left: 38%;
          }
          text-align: center;
        }
        h2 {
          height: 47px;
          font-size: 40px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #14171c;
          line-height: 47px;
        }
        p {
          height: 19px;
          font-size: 16px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #14171c;
          line-height: 19px;
          margin: 8px 0;
        }
        span {
          height: 16px;
          font-size: 14px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #828489;
          line-height: 16px;
        }
      }
    }

    .items-content {
      margin: 32px 0;
      ul {
        display: flex;
        align-items: center;
        justify-content: space-between;
        li {
          text-align: right;
          padding-top: 8px;
          font-size: 12px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #14171c;
          line-height: 14px;
        }
        .title {
          text-align: left;
          color: #828489;
        }
      }
    }
    .close-warpper {
      width: 100%;
      margin-top: 32px;
      img {
        cursor: pointer;
        width: 24px;
        margin: auto;
      }
    }
  }
}
</style>
