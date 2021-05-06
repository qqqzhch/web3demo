<template>
  <div class="overview-warp">
    <div v-if="!isMobile" class="content-warpper flex items-center">
      <div v-if="liquityState&&liquityState.price" class="content">
        <div class="total-warpper">
          <h2>{{ $t('vault-total-value-locked') }}</h2>
          <p><span>$ {{ BigNumber(totalValue).times(price).toFixed(2) }}</span></p>
        </div>
        <div class="other-warpper flex items-center">
          <div>
            <h2>{{ $t('vault-total-collateral') }}</h2>
            <p><span>{{ BigNumber(totalValue).toFixed(2) }}</span> BNB </p>
          </div>
          <div>
            <h2>{{ $t('vault-total-debt') }}</h2>
            <p><span>{{ BigNumber(totalDebt).toFixed(2) }}</span> {{ stableName }} </p>
          </div>
          <div>
            <h2>{{ $t('vault-total-collateral-ratio') }}</h2>
            <p><span>{{ BigNumber(totalCollateralRatio).times(100).toFixed(2) }}%</span></p>
          </div>
          <div>
            <h2>{{ $t('vault-borrowing-fee') }}</h2>
            <p><span>{{ BigNumber(borrowingRate).times(100).toFixed(2) }}%</span></p>
          </div>
          <div>
            <h2>{{ $t('vault-redemption-fee') }}</h2>
            <p><span>{{ BigNumber(redemptionRate).times(100).toFixed(2) }}%</span></p>
          </div>
          <div>
            <h2>{{ $t('vault-total-vaults') }}</h2>
            <p><span>{{ totalVaults }}</span></p>
          </div>
        </div>
        <!--<div class="refresh" @click="refresh">-->
        <!--<img src="../../../../assets/img/refresh.svg" alt="refresh">-->
        <!--</div>-->
      </div>
      <!--<div class="content-gray">-->
      <!--<span />-->
      <!--</div>-->
    </div>

    <div v-else class="content-warpper flex items-center">
      <div v-if="liquityState&&liquityState.price" class="content">
        <div class="total-warpper">
          <h2>{{ $t('vault-total-value-locked') }}</h2>
          <p><span>$ {{ BigNumber(totalValue).times(price).toFixed(2) }}</span></p>
        </div>
        <div class="other-warpper flex items-center">
          <div>
            <h2>{{ $t('vault-total-collateral') }}</h2>
            <p><span>{{ BigNumber(totalValue).toFixed(2) }}</span> BNB </p>
          </div>
          <div>
            <h2>{{ $t('vault-total-debt') }}</h2>
            <p><span>{{ BigNumber(totalDebt).toFixed(2) }}</span> {{ stableName }} </p>
          </div>
          <div>
            <h2>{{ $t('vault-total-collateral-ratio') }}</h2>
            <p><span>{{ BigNumber(totalCollateralRatio).times(100).toFixed(2) }}%</span></p>
          </div>
        </div>
        <div class="other-warpper flex items-center">
          <div>
            <h2>{{ $t('vault-borrowing-fee') }}</h2>
            <p><span>{{ BigNumber(borrowingRate).times(100).toFixed(2) }}%</span></p>
          </div>
          <div>
            <h2>{{ $t('vault-redemption-fee') }}</h2>
            <p><span>{{ BigNumber(redemptionRate).times(100).toFixed(2) }}%</span></p>
          </div>
          <div>
            <h2>{{ $t('vault-total-vaults') }}</h2>
            <p><span>{{ totalVaults }}</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./index.js"></script>

<style lang="less" scoped>
  @media screen and (max-width: 1200px) {
    .overview-warp {
      .title {
        height: 24px;
        font-size: 20px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #14171c;
        line-height: 24px;
      }
      .content-warpper {
        margin-top: 24px;
        .content {
          /*margin: 10px;*/
          width: 100%;
          background: linear-gradient(270deg, #3f5efb 0%, #fc466b 100%);
          /*border-radius: 5px;*/
          padding: 10px;
          position: relative;
          div {
            h2 {
              height: 16px;
              font-size: 14px;
              font-family: Gilroy-Medium, Gilroy;
              font-weight: 500;
              color: #ffffff;
              line-height: 16px;
            }
            p {
              height: 24px;
              font-size: 16px;
              font-family: Gilroy-Medium, Gilroy;
              font-weight: 500;
              color: #ffffff;
              line-height: 24px;
              margin-top: 8px;
            }
          }
          .total-warpper {
            p {
              height: 32px;
              line-height: 32px;
              font-size: 24px;
              font-family: Gilroy-Bold, Gilroy;
              font-weight: bold;
              color: #ffffff;
              margin: 8px 0 8px 0px;
            }
          }
          .other-warpper {
            padding-top: 10px;
            div {
              width: 100%;
            }
          }
          .refresh{
            cursor: pointer;
            position: absolute;
            right: 20px;
            top: 20px;
          }
        }
      }
    }
  }
  @media screen and (min-width: 1201px) {
    .overview-warp {
      .title {
        height: 24px;
        font-size: 20px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #14171c;
        line-height: 24px;
      }
      .content-warpper {
        margin-top: 24px;
        .content {
          // margin-right: 24px;
          width: 100%;
          background: linear-gradient(270deg, #3f5efb 0%, #fc466b 100%);
          border-radius: 12px;
          padding: 24px;
          position: relative;
          div {
            h2 {
              height: 16px;
              font-size: 14px;
              font-family: Gilroy-Medium, Gilroy;
              font-weight: 500;
              color: #ffffff;
              line-height: 16px;
            }
            p {
              height: 24px;
              font-size: 20px;
              font-family: Gilroy-Medium, Gilroy;
              font-weight: 500;
              color: #ffffff;
              line-height: 24px;
              margin-top: 8px;
            }
          }
          .total-warpper {
            p {
              height: 38px;
              font-size: 32px;
              font-family: Gilroy-Bold, Gilroy;
              font-weight: bold;
              color: #ffffff;
              line-height: 38px;
              margin: 8px 0 16px;
            }
          }
          .other-warpper {
            padding-top: 10px;
            div {
              width: 30%;
            }
          }
          .refresh{
            cursor: pointer;
            position: absolute;
            right: 20px;
            top: 20px;
          }
        }
      }
    }
  }
</style>
