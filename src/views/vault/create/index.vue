<template>
  <div class="create box-shadow">
    <div class="header">
      <div class="title">
        {{ $t('build-deposit-digital-assets') }}
      </div>
    </div>
    <div class="grid-2 mrg-tb-20">
      <div class="content-left">
        <div class="asset-item cursor-pointer">
          <div class="connect flex justify-between items-center">
            <div class="icon-wrapper flex justify-start items-center">
              <template v-for="(item, index) in collateralPools">
                <img
                  v-if="defaultPool.name === item.name"
                  :key="index"
                  class="mr-2"
                  :src="getTokenImg(item.token)"
                  :alt="item.token"
                >
              </template>
              <span>{{ defaultPool.title }}</span>
            </div>
            <!--<div class="arrow-wrapper">-->
            <!--<img src="../../../assets/img/RightAeeow.svg" alt="right-arrow">-->
            <!--</div>-->
          </div>
        </div>
        <div class="input-warpper flex justify-between items-center mrg-t-20 mrg-b-5">
          <div class="mortgage">
            {{ $t('build-Deposit') }}
          </div>
          <div class="pull-right">
            <p class="balance">
              <span>{{ $t('build-balance') }}  </span>{{ accountBalance | formatNormalValue }} {{ defaultPool.token }}
            </p>
          </div>
        </div>
        <div class="Input-item">
          <ScInput
            class="myInput"
            title=""
            :default-value="depositAmount"
            :unit="defaultPool.token"
            :on-change="onChangeDepositAmount"
            :is-error="checkValue !== 'ok'"
          />
          <img :src="getTokenImg(defaultPool.token)" :alt="defaultPool.token">
        </div>
        <div v-if="checkValue !== 'ok'" class="notice-warpper">
          <div class="notice-content">
            <img src="../../../assets/img/notice-red.png">
            <p>{{ checkValue }}</p>
          </div>
        </div>
        <div class="flex">
          <div class="title-build">
            Debt
          </div>
          <div class="pull-right" />
        </div>
        <div class="Input-item">
          <ScInput
            class="myInput"
            title=""
            :unit="stableName"
            :default-value="borrowAmount"
            :on-change="onChangeBorrowAmount"
          />
          <img :src="getTokenImg(stableName)" :alt="stableName">
        </div>
      </div>
      <div class="content-right">
        <div class="build-grid-2 mrg-b-5">
          <p class="f-size-20">
            {{ $t('vault-collateral') }}：
          </p>
          <div class="text-right f-size-20">
            {{ depositAmount }} {{ defaultPool.token }}
          </div>
        </div>
        <div class="build-grid-2 mrg-b-5">
          <p class="f-size-20">
            {{ $t('build-debt') }}：
          </p>
          <div class="text-right f-size-20">
            {{ borrowAmount }} {{ stableName }}
          </div>
        </div>

        <div class="build-grid-2 mrg-b-5 mrg-t-20">
          <p>{{ $t('vault-liquidation-reserve') }}：</p>
          <div class="text-right">
            {{ troveIndicators.liquidationReserve }} {{ stableName }}
          </div>
        </div>
        <div class="build-grid-2 mrg-b-5">
          <p>{{ $t('vault-borrowing-fee') }}：</p>
          <div class="text-right">
            {{ BigNumber(borrowLUSDAmount).times(troveIndicators.borrowingRate) | formatNormalValue }} {{ stableName }}
            ({{ BigNumber(troveIndicators.borrowingRate).times(100) }}%)
          </div>
        </div>
        <div class="build-grid-2 mrg-b-5 mrg-t-20">
          <p> BNB Price： </p>
          <div class="text-right">
            $ {{ troveIndicators.price | formatNormalValue }}
          </div>
        </div>
        <div class="build-grid-2 mrg-b-5">
          <p>Collateral Ratio：</p>
          <div class="text-right">
            {{ BigNumber(troveIndicators.collateralRatio).times(100).toNumber() | formatNormalValue }} %
          </div>
        </div>
        <div class="build-grid-2 mrg-b-5">
          <p>{{ $t('build-liquidation-ratio') }}：</p>
          <div class="text-right">
            110%
          </div>
        </div>
        <div v-if="errorInfo" class="notice-content">
          <img src="../../../assets/img/notice-red.png">
          <p>{{ errorInfo }}</p>
        </div>
        <div v-if="!errorInfo" :style="{height: '47px'}" />
        <div>
          <button v-if="!errorInfo" class="btn" @click="onOpenTroveClick">
            {{ $t('build-create-vault') }}
          </button>
          <button v-if="errorInfo" class="btn btn-disabled">
            {{ $t('build-create-vault') }}
          </button>
        </div>
      </div>
    </div>
    <haveSendDialog ref="haveSendtx" />
    <assetDialog ref="asset" />
  </div>
</template>

<script src="./index.js"></script>

<style lang="less" scoped>
.grid-2 {
  display: grid;
  grid-template-columns: 45% 45%;
  justify-content: space-between;
}
.build-grid-2 {
  display: grid;
  grid-template-columns: 70% 30%;
  justify-content: space-between;
}
.line {
  border-bottom: 1px dashed #eaeaea;
}
.f-green {
  color: #00d075 !important;
}
.btn-disabled {
  cursor: not-allowed;
  background-color: #999;
  &:hover {
    background-color: #999 !important;
  }
}
.create {
  // margin-left: 100px;
  .title {
    margin-bottom: 32px;
    font-size: 20px;
    font-family: Gilroy-Medium, Gilroy;
    font-weight: 500;
    color: #14171c;
    line-height: 24px;
  }
  .info {
    height: 19px;
    font-size: 16px;
    font-family: Gilroy-Regular, Gilroy;
    font-weight: 400;
    color: #14171c;
    line-height: 19px;
    margin: 12px 0 32px;
  }
  .content-left {
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
    .asset-item {
      .connect {
        width: 100%;
        height: 50px;
        background: #f7f8f9;
        border-radius: 8px;
        padding: 0 16px;
        .icon-wrapper {
          img {
            max-width: 24px;
          }
        }
      }
    }
    .input-warpper {
      margin: 24px 0 12px;
      .mortgage {
        height: 19px;
        font-size: 16px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #14171c;
        line-height: 19px;
      }
      .balance {
        p {
          height: 14px;
          font-size: 12px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #14171c;
          line-height: 14px;
        }
        span {
          margin-right: 3px;
          color: #828489;
        }
      }
    }
    .title-build {
      margin: 24px 0 12px;;
    }
    .Input-item{
      position: relative;
      img{
        width: 24px;
        position: absolute;
        right: 85px;
        top: 25px;
      }
    }
  }
  .pull-right {
    text-align: right;
  }

  .content-right {
    .f-size-20{
      font-size: 20px;
      color: #14171C;
    }
    p {
      height: 16px;
      font-size: 14px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #828489;
      line-height: 16px;
      margin-bottom: 8px;
    }
    .btn {
      margin-top: 30px;
      line-height: 48px;
      height: 48px;
      border-radius: 24px;
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
    .notice-content {
      margin: 20px 0;
      display: flex;
      align-items: center;
      padding: 9px 30px;
      width: 100%;
      height: 32px;
      line-height: 32px;
      background: rgba(255, 60, 0, 0.1);
      border-radius: 4px;
      img {
        margin-right: 10px;
      }
      p {
        margin-top: 8px;
        font-size: 12px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #ff3c00;
      }
    }
  }
}
</style>
