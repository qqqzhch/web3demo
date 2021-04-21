<template>
  <div class="pool-wrapper">
    <div class="pool-title flex justify-between items-center">
      <p class="title">
        Stability Pool
      </p>
      <p class="subTitle">
        Stability Pool
      </p>
    </div>

    <div class="pool-content">
      <h2 class="title">
        LAI
      </h2>

      <div class="tag-wrapper flex justify-center items-center">
        <div class="tag-item tag1">
          BABEL
        </div>
        <div class="tag-item tag2">
          Liquidation Fee
        </div>
      </div>

      <div class="pool-detail">
        <div class="detail-item">
          <span class="title">APY</span>
          <span class="value text-success">10000%</span>
        </div>

        <div class="detail-item">
          <span class="title">Total Stake</span>
          <span class="value">{{ totalStake }} LAI</span>
        </div>

        <div class="detail-item">
          <span class="title">已质押</span>
          <span class="value">{{ haveStake }} LAI</span>
        </div>

        <div class="detail-item">
          <span class="title">待提取BNB</span>
          <span class="value">{{ unclaimBNB }} BNB</span>
        </div>

        <div class="detail-item">
          <span class="title">待提取Babel</span>
          <span class="value">{{ unclaimBabel }} Babel</span>
        </div>

        <div class="detail-item">
          <span class="title">未释放Babel</span>
          <span class="value">{{ unReleaseBabel }} Babel</span>
        </div>
      </div>

      <div class="pool-btn-wrapper">
        <button class="pool-btn" @click="openPledge">
          质押LAI
        </button>

        <button class="pool-btn" @click="openExtract">
          提取收益
        </button>

        <button class="pool-btn" @click="openTake">
          提取LAI
        </button>
        <button class="pool-btn" @click="getData">
          获取数据
        </button>
      </div>
    </div>

    <take ref="take" />
    <pledge ref="pledge" />
    <extract ref="extract" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import initLiquity from '@/common/mixin/initLiquity';
export default {
  mixins: [initLiquity],
  computed: {
    ...mapState('buildr', ['liquityState']),
    stabilityDeposit() {
      const val = this.liquityState && this.liquityState.stabilityDeposit;
      return val;
    },
    // 总质押
    totalStake() {
      const val =
        this.liquityState &&
        this.liquityState.lusdInStabilityPool &&
        this.liquityState.lusdInStabilityPool.prettify();
      return val;
    },

    // 已质押
    haveStake() {
      const val =
        this.stabilityDeposit &&
        this.stabilityDeposit.currentLUSD &&
        this.stabilityDeposit.currentLUSD.prettify();
      return val;
    },

    // 待提取BNB
    unclaimBNB() {
      const val =
        this.stabilityDeposit &&
        this.stabilityDeposit.collateralGain &&
        this.stabilityDeposit.collateralGain.prettify();
      return val;
    },

    // 待提取Babel
    unclaimBabel() {
      const val =
        this.stabilityDeposit &&
        this.stabilityDeposit.lqtyReward &&
        this.stabilityDeposit.lqtyReward.prettify();
      return val;
    },

    // 未释放Babel
    unReleaseBabel() {
      const val =
        this.liquityState &&
        this.liquityState.remainingStabilityPoolLQTYReward &&
        this.liquityState.remainingStabilityPoolLQTYReward.prettify();
      return val;
    },

    // LAI余额
    laiBalance() {
      const val =
        this.liquityState &&
        this.liquityState.lusdBalance &&
        this.liquityState.lusdBalance.toString();
      const balance = this.$BigNumber(val).decimalPlaces(2).toNumber();
      return balance;
    }
  },
  components: {
    take: () => import('./dialog/takeoutDialog.vue'),
    pledge: () => import('./dialog/pledgeDialog.vue'),
    extract: () => import('./dialog/extractReward.vue'),
  },
  methods: {
    openPledge() {
      this.$refs.pledge.open(this.laiBalance);
    },
    openExtract() {
      this.$refs.extract.open();
    },
    openTake() {
      this.$refs.take.open(this.haveStake);
    },
    getData() {
      console.log(this.liquityState);
    },
  },
};
</script>

<style lang="less" scoped>
@import '../../common/css/pool.less';
</style>