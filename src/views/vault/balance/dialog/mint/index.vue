<template>
  <div class="dialog-wrap">
    <Modal
      v-model="isOpen"
      class-name="valut-modal"
      :transfer="true"
      title=""
      :footer-hide="true"
      :closable="false"
    >
      <div class="modal-content">
        <div v-if="step === 1" class="flex">
          <div class="tab-warpper">
            <button class="tab">
              {{ $t('build-buildr') }}
            </button>
          </div>
          <div class="tab-warpper">
            <button class="tab  tab-disabled" @click="onBurnClick">
              {{ $t('build-payback') }}
            </button>
          </div>
        </div>
        <div class="padding-warpper">
          <div v-if="step === 1" class="step-one">
            <div class="grid-2">
              <h2>{{ $t('build-Amount') }}</h2>
              <p><span>{{ $t('build-balance') }}：</span> {{ LAIBalance | formatNormalValue }} {{ poolData.stableName }}</p>
            </div>
            <div class="input-warpper">
              <ScInput
                :unit="poolData.stableName"
                :on-change="onChangeValue"
                :is-error="checkValue"
              />
              <img :src="getTokenImg(poolData.stableName)">
            </div>
            <div v-if="checkValue" class="notice-warpper">
              <div class="notice-content">
                <img src="../../../../../assets/img/notice-red.png">
                <p>{{ checkValue }}</p>
              </div>
            </div>
            <div v-if="!checkValue" class="notice">
              <span>{{ $t('build-generate-scUSD') }}</span>
              <img src="../../../../../assets/img/wenhao.svg" alt="?">
            </div>
          </div>
          <div v-if="step === 2" class="step-two">
            <div class="title-warpper">
              <img src="../../../../../assets/img/arrow-left.svg" alt="arrow" @click="changeStep">
              <h2>{{ $t('build-confirm') }}</h2>
            </div>
            <div class="confirm-content flex flex-col items-center">
              <img :src="getTokenImg(poolData.stableName)">
              <h2>{{ coinAmount }}</h2>
              <p>{{ poolData.stableName }}</p>
              <span>{{ $t('build-will-send') }}</span>
            </div>
          </div>
          <div class="items-content">
            <ul>
              <li class="title">
                {{ $t('build-debt') }}：
              </li>
              <li>
                <span>{{ poolData.debtAmount | formatNormalValue }}</span> {{ $t('build-to') }} <span
                  :class="{
                    'f-green': totalDebt > poolData.debtAmount,
                    'f-danger': totalDebt < poolData.debtAmount
                  }"
                >{{ totalDebt | formatNormalValue }} {{ poolData.stableName }}</span>
              </li>
            </ul>
            <ul>
              <li class="title">
                Borrowing Fee:
              </li>
              <li>
                <span>{{ debtFee | formatNormalValue }} {{ poolData.stableName }} </span>
                <span>({{ BigNumber(poolData.borrowingRate).times(100).toFixed(2) }}%)</span>
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
                >{{ BigNumber(poolData.collateralRatio).times(100).toFixed(2) }}%</span> {{ $t('build-to') }} <span
                  :class="{
                    'f-green': poolData.collateralRatio >= 1.5,
                    'f-warning': poolData.collateralRatio < 1.5 && poolData.collateralRatio > 1.1,
                    'f-danger': poolData.collateralRatio <= 1.1
                  }"
                >{{ BigNumber(newCollateralRatio).times(100).toFixed(2) }}%</span>
              </li>
              <li v-else>
                <span>0% {{ $t('build-to') }} 0%</span>
              </li>
            </ul>
          </div>
          <div class="button-warpper">
            <button v-if="step === 1 && !checkValue" class="btn" @click="onNextClick">
              {{ $t('build-next') }}
            </button>
            <button v-if="step === 1 && checkValue" class="btn btn-disabled">
              {{ $t('build-next') }}
            </button>
            <button v-if="step === 2" class="btn" @click="onMintClick">
              {{ $t('build-confirm') }}
            </button>
          </div>
          <div v-if="step === 1" class="close-warpper">
            <img src="../../../../../assets/img/closeBtn.svg" alt="closeBtn" @click="closeDialog">
          </div>
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
    width: 50%;
    .tab {
      width: 100%;
      cursor: not-allowed;
      height: 60px;
      background: #ffffff;
      border-radius: 12px 0px 0px 0px;
    }
    .tab-disabled {
      width: 100%;
      cursor: pointer;
      height: 60px;
      color: #999;
      background: #f7f8f9;
      border-radius: 0px 12px 0px 0px;
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
