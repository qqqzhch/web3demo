<template>
  <div class="list-wrapper">
    <div class="list-item-wrapper">
      <div v-for="(item, index) in data" :key="index" class="list-item">
        <div class="name flex justify-start items-center">
          <img src="../../../../assets/img/susd48.svg" alt="susd">
          <div class="right">
            <p class="coin">
              {{ item.name }}
            </p>
            <p class="price">
              --
            </p>
          </div>
        </div>

        <div class="apy">
          <h4>APY</h4>
          <p class="percent">
            {{ item.data && item.data.rewardRate | formatReward(365) }}
          </p>
        </div>

        <div class="balance">
          <div class="balance-item">
            <span class="title">Total Staked</span>
            <span class="value">{{ item.data && item.data.totalSupply || 0 }}</span>
          </div>
          <div class="balance-item">
            <span class="title">Total Value of Pool</span>
            <span class="value">--</span>
          </div>
          <div class="balance-item">
            <span class="title">Output</span>
            <span class="value">--</span>
          </div>
        </div>

        <div class="btn-item">
          <button v-if="ethAddress" class="stakeBtn" @click="openStake(item)">
            Stake
          </button>
          <Buttons v-else width="100px" height="30px" class="disableBtn">
            Stake
          </Buttons>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
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
  },
  components: {
    Buttons: () => import('@/components/basic/buttons.vue'),
  },
  computed: {
    ...mapState(['ethAddress']),
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
    // justify-content: space-between;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 16px;
    .name {
      margin-right: 24px;
      word-break: break-all;
      width: 28%;
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
      width: 22%;
      word-break: break-all;
      margin-right: 24px;
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
      width: 28%;
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
      margin-left: 50px;
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