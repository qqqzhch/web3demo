<template>
  <div class="create box-shadow">
    <div class="header">
      <div class="title">
        Designated Pool
      </div>
      <div class="info">
        Designated mining, users can enjoy lower risk mining with a super high yield.
      </div>
    </div>
    <div class="grid-2 mrg-tb-20">
      <div class="content-left">
        <div class="asset-item cursor-pointer" @click="openAsset">
          <p class="card-title">
            Asset
          </p>
          <div class="connect flex justify-between items-center">
            <div class="icon-wrapper flex justify-start items-center">
              <template v-for="(item, index) in collateralPools">
                <img
                  v-if="defaultTokenName===item.name"
                  :key="index"
                  class="mr-2"
                  :src="getTokenImg(item.token)"
                  :alt="item.token"
                >
              </template>
              <span>{{ defaultTokenName }}</span>
            </div>
            <div class="arrow-wrapper">
              <img src="../../../assets/img/RightAeeow.svg" alt="right-arrow">
            </div>
          </div>
        </div>
        <div class="input-warpper grid-2 mrg-t-20 mrg-b-5">
          <div class="mortgage">
            Collateral
          </div>
          <div class="pull-right">
            <p class="balance">
              <span>Balance </span>{{ currencyNumber }} LAMB
            </p>
          </div>
        </div>
        <div class="Input-item">
          <ScInput title="" unit="LAMB" placetext="请输入数量" :on-change="onChangePledgeNumber" />
          <img :src="getTokenImg(defaultToken)" alt="lambda">
        </div>

        <div class="grid-2">
          <div class="title">
            Build
          </div>
          <div class="pull-right" />
        </div>
        <div class="Input-item">
          <ScInput title="" unit="scUSD" :default-value="stableNumber" disabled="true" />
          <img src="../../../assets/img/comp.svg" alt="comp">
          <img :src="getTokenImg('scUSD')" alt="lambda">
        </div>
      </div>
      <div class="content-right">
        <div class="build-grid-2 mrg-b-5">
          <p>Collateral：</p>
          <div class="text-right">
            {{ pledgeNumber }} LAMB
          </div>
        </div>
        <div class="build-grid-2 mrg-b-5">
          <p>Received scUSD：</p>
          <div class="text-right">
            {{ stableNumber }} scUSD
          </div>
        </div>
        <!--<div class="build-grid-2 mrg-b-5">-->
        <!--<div>Coll. Ratio：</div>-->
        <!--<div class="text-right">-->
        <!--{{ BigNumber(targetRX).times(100) }}%-->
        <!--</div>-->
        <!--</div>-->
        <div class="build-grid-2 mrg-b-5 mrg-t-20">
          <p>SuperCash {{ defaultPoolToken }}Price：</p>
          <div class="text-right">
            {{ BigNumber(currencyPrice).toFixed(6) }} USD
          </div>
        </div>
        <div class="build-grid-2 mrg-b-5">
          <p>Liquidation Price：</p>
          <div class="text-right">
            {{ pledgeNumber ? BigNumber(liquidationRatio).times(stableNumber).div(pledgeNumber) : 0 }} USD
          </div>
        </div>
        <div class="build-grid-2 mrg-b-5 mrg-t-20">
          <p>Liquidation Ratio：</p>
          <div class="text-right">
            {{ liquidationRatio * 100 }}%
          </div>
        </div>
        <div class="build-grid-2 mrg-b-5">
          <p>Stability Ratio：</p>
          <div class="text-right">
            {{ BigNumber(feeRate).times(100) }} %
          </div>
        </div>
        <div class="build-grid-2 mrg-b-5">
          <p>Global scUSD Debt Ceiling：</p>
          <div class="text-right">
            {{ debtCap }} scUSD
          </div>
        </div>
        <div v-if="!btnloading">
          <button v-if="BigNumber(allowanceAmount).isZero() || BigNumber(pledgeNumber).gt(allowanceAmount)" class="btn" @click="onApproveClick">
            Approve
          </button>
          <button v-else class="btn" @click="onJoinClick">
            Create and generate scUSD
          </button>
        </div>
        <div v-if="btnloading">
          <Loading />
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
.create {
  margin-left: 100px;
  .title {
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
    .title {
      margin-top: 24px;
      height: 19px;
      font-size: 16px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #14171c;
      line-height: 19px;
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
      line-height: 60px;
      height: 60px;
      padding-top: 3px;
      background-color: #0058ff;
      color: #ffffff;
      &:hover {
        background-color: #0547ff;
      }
    }
  }
}
</style>
