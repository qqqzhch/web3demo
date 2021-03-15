<template>
  <div class="list-wrapper">
    <div class="list-item-wrapper">
      <div v-for="(item, index) in data" :key="index" class="list-item">
        <div class="name flex justify-between items-center">
          <img src="../../../../assets/img/susd48.svg" alt="susd">
          <div class="right">
            <p class="coin">
              {{ item.name }}
            </p>
            <p class="price">
              1 scUSD = 123USD
            </p>
          </div>
        </div>

        <div class="apy">
          <h4>APY</h4>
          <p class="percent">
            {{ getAPY(item) }}
          </p>
        </div>

        <div class="balance">
          <div class="balance-item">
            <span class="title">Total Staked</span>
            <span class="value">{{ item.data && item.data.totalSupply }}</span>
          </div>
          <div class="balance-item">
            <span class="title">Total Value of Pool</span>
            <span class="value">1245 scUSD</span>
          </div>
          <div class="balance-item">
            <span class="title">Output</span>
            <span class="value">1245 scUSD</span>
          </div>
        </div>

        <div class="btn-item">
          <button class="stakeBtn" @click="openStake(item)">
            Stake
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const BigNumber = require('bignumber.js');
BigNumber.config({ DECIMAL_PLACES: 6, ROUNDING_MODE: BigNumber.ROUND_DOWN });
export default {
  props: {
    data: {
      type: Array,
    },
  },
  methods: {
    openStake(data) {
      this.$emit('openStake', data);
    },
    getAPY(val) {
      console.log(val);
      let share;
      const totalSupplyShare = new BigNumber(val.totalSupplyShare);
      const totalAsset = new BigNumber(val.totalAssert);
      const newReward = new BigNumber(val.newReward);
      const big0 = new BigNumber('0');

      if (totalSupplyShare.isEqualTo(big0) || totalAsset.isEqualTo(big0)) {
        share = new BigNumber('1');
      } else {
        share = totalSupplyShare.div(totalAsset);
      }

      const rewards = totalAsset.plus(1).plus(newReward.div(1e18));
      const allShares = totalSupplyShare.plus(share);

      const apy = share.multipliedBy(rewards).div(allShares).minus(1).multipliedBy(365);
      return apy;
    },
  },
};
</script>

<style lang="less" scoped>
.list-wrapper {
  margin-top: 24px;
  .list-item {
    background: #ffffff;
    box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
    border-radius: 12px;
    padding: 32px 24px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    .name {
      .right {
        margin-left: 28px;
        .coin {
          font-size: 20px;
          color: #14171c;
          line-height: 24px;
        }
        .price {
          margin-top: 4px;
          font-size: 14px;
          color: #828489;
          line-height: 16px;
        }
      }
    }
    .apy {
      h4 {
        font-size: 14px;
        color: #828489;
        line-height: 16px;
      }
      .percent {
        font-size: 32px;
        color: #00d075;
        line-height: 38px;
      }
    }
    .balance {
      .balance-item {
        margin-bottom: 4px;
        overflow: hidden;
        .title {
          float: left;
          font-size: 14px;
          color: #828489;
          line-height: 16px;
          margin-right: 50px;
        }
        .value {
          float: right;
          font-size: 14px;
          color: #14171c;
          line-height: 16px;
        }
      }
    }
    .btn-item {
      .stakeBtn {
        background: #0058ff;
        border-radius: 6px;
        padding: 8px 40px;
        font-size: 16px;
        font-weight: 500;
        color: #ffffff;
        line-height: 19px;
      }
    }
  }
}
</style>