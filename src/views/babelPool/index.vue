<template>
  <div class="pool-wrapper">
    <div class="pool-title flex justify-between items-center">
      <p class="title">
        BABEL Pool
      </p>
      <p class="subTitle">
        BABEL Pool
      </p>
    </div>

    <div v-if="showLoading">
      <loading />
    </div>
    <div v-else class="pool-content">
      <h2 class="title">
        BABEL
      </h2>

      <div class="tag-wrapper flex justify-center items-center">
        <div class="tag-item tag1">
          Borrowing Fee
        </div>
        <div class="tag-item tag2">
          Redemption Fee
        </div>
      </div>

      <div class="pool-detail">
        <!-- <div class="detail-item">
          <span class="title">APY</span>
          <span class="value text-success">10000%</span>
        </div> -->

        <div class="detail-item">
          <span class="title">Total Stake</span>
          <span class="value">{{ totalStakedLQTY }} BABEL</span>
        </div>

        <div class="detail-item">
          <span class="title">Staked</span>
          <span class="value">{{ stakedLQTY }} BABEL</span>
        </div>

        <div class="detail-item">
          <span class="title">Unclaim BNB</span>
          <span class="value">{{ collateralGain }} BNB</span>
        </div>

        <div class="detail-item">
          <span class="title">Unclaim LAI</span>
          <span class="value">{{ lusdGain }} LAI</span>
        </div>
      </div>

      <div class="pool-btn-wrapper">
        <template v-if="ethAddress">
          <button class="pool-btn" @click="openPledge">
            Stake BABEL
          </button>

          <button class="pool-btn" @click="openExtract">
            Claim
          </button>

          <button class="pool-btn" @click="openTake">
            Unstake BABEL
          </button>
        </template>

        <template v-else>
          <button class="pool-btn disableBtn">
            Stake BABEL
          </button>

          <button class="pool-btn disableBtn">
            Claim
          </button>

          <button class="pool-btn disableBtn">
            Unstake BABEL
          </button>
        </template>
      </div>
    </div>

    <take ref="take" />
    <pledge ref="pledge" />
    <extract ref="extract" />
  </div>
</template>

<script>
import initLiquity from '@/common/mixin/initLiquity';
import { mapState } from 'vuex';
export default {
  mixins: [initLiquity],
  data() {
    return {
      showLoading: false,
    };
  },
  components: {
    take: () => import('./dialog/takeoutDialog.vue'),
    pledge: () => import('./dialog/pledgeDialog.vue'),
    extract: () => import('./dialog/extractReward.vue'),
    loading: () => import('@/components/basic/loading.vue'),
  },
  methods: {
    openPledge() {
      this.$refs.pledge.open(this.lqtyBalance);
    },
    openExtract() {
      const obj = {
        lusdGain: this.lusdGain,
        collateralGain: this.collateralGain,
      };
      this.$refs.extract.open(obj);
    },
    openTake() {
      this.$refs.take.open(this.stakedLQTY);
    },
    getData() {
      this.showLoading = true;
      setTimeout(() => {
        this.showLoading = false;
      }, 500);
    },
  },
  computed: {
    ...mapState('buildr', ['liquityState']),
    totalStakedLQTY() {
      const val =
        this.liquityState && this.liquityState.totalStakedLQTY && this.liquityState.totalStakedLQTY.toString();
      const total = this.$BigNumber(val).decimalPlaces(2).toNumber();
      return total;
    },
    stakedLQTY() {
      const val = this.liquityState && this.liquityState.lqtyStake && this.liquityState.lqtyStake.stakedLQTY.toString();
      const bigValue = this.$BigNumber(val).decimalPlaces(2).toNumber();
      return bigValue;
    },
    collateralGain() {
      const val =
        this.liquityState && this.liquityState.lqtyStake && this.liquityState.lqtyStake.collateralGain.toString();
      const bigValue = this.$BigNumber(val).decimalPlaces(2).toNumber();
      return bigValue;
    },
    lusdGain() {
      const val = this.liquityState && this.liquityState.lqtyStake && this.liquityState.lqtyStake.lusdGain.toString();
      const bigValue = this.$BigNumber(val).decimalPlaces(2).toNumber();
      return bigValue;
    },
    lqtyBalance() {
      const val = this.liquityState && this.liquityState.lqtyBalance && this.liquityState.lqtyBalance.toString();
      const bigValue = this.$BigNumber(val).decimalPlaces(2).toNumber();
      return bigValue;
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style lang="less" scoped>
@import '../../common/css/pool.less';
</style>