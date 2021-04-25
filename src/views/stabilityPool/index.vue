<template>
  <div class="pool-wrapper">
    <!-- <div class="pool-title flex justify-between items-center">
      <p class="title">
        {{ $t('stability.pool') }}
      </p>
      <p class="subTitle">
        {{ $t('stability.subTitle') }}
      </p>
    </div> -->
    <div v-if="showLoading">
      <loading />
    </div>
    <div v-else class="pool-content">
      <h2 class="title">
        LAI
      </h2>

      <div class="tag-wrapper flex justify-center items-center">
        <div class="tag-item tag1">
          BABEL
        </div>
        <div class="tag-item tag2">
          {{ $t('stability.fee') }}
        </div>
      </div>

      <div class="pool-detail">
        <!-- <div class="detail-item">
          <span class="title">APY</span>
          <span class="value text-success">10000%</span>
        </div> -->

        <div class="detail-item">
          <span class="title">{{ $t('stability.total') }}</span>
          <span class="value">{{ totalStake }} LAI</span>
        </div>

        <div class="detail-item">
          <span class="title">{{ $t('stability.staked') }}</span>
          <span class="value">{{ haveStake }} LAI</span>
        </div>

        <div class="detail-item">
          <span class="title">{{ $t('stability.unclaim') }} BNB</span>
          <span class="value">{{ unclaimBNB }} BNB</span>
        </div>

        <div class="detail-item">
          <span class="title">{{ $t('stability.unclaim') }} BABEL</span>
          <span class="value">{{ unclaimBabel }} BABEL</span>
        </div>

        <div class="detail-item">
          <span class="title">{{ $t('stability.remain') }} BABEL</span>
          <span class="value">{{ unReleaseBabel }} BABEL</span>
        </div>
      </div>

      <div class="pool-btn-wrapper">
        <template v-if="ethAddress">
          <button class="pool-btn" @click="openPledge">
            {{ $t('stability.stake') }}  LAI
          </button>

          <Poptip placement="bottom" class="claim-wrapper pool-btn">
            <div class="claim-content">
              {{ $t('stability.claim') }}
            </div>
            <div slot="content" class="claim-btn-wrapper">
              <button class="claim-btn" @click="handleClaim('claim')">
                {{ $t('stability.claimReward') }}
              </button>

              <button class="claim-btn ml-4" @click="handleClaim('move')">
                {{ $t('stability.claimAndMove') }}
              </button>
            </div>
          </Poptip>

          <button class="pool-btn" @click="openTake">
            {{ $t('stability.unstake') }}  LAI
          </button>
        </template>

        <template v-else>
          <button class="pool-btn disableBtn">
            {{ $t('stability.stake') }}  LAI
          </button>

          <button class="pool-btn disableBtn">
            {{ $t('stability.claim') }}
          </button>

          <button class="pool-btn disableBtn">
            {{ $t('stability.unstake') }}  LAI
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
import { mapState } from 'vuex';
import initLiquity from '@/common/mixin/initLiquity';
export default {
  mixins: [initLiquity],
  data() {
    return {
      showLoading: false,
    };
  },
  computed: {
    ...mapState(['ethAddress']),
    ...mapState('buildr', ['liquityState']),
    stabilityDeposit() {
      const val = this.liquityState && this.liquityState.stabilityDeposit;
      return val;
    },
    // 总质押
    totalStake() {
      const val =
        this.liquityState && this.liquityState.lusdInStabilityPool && this.liquityState.lusdInStabilityPool.toString();
      const bigValue = this.$BigNumber(val).decimalPlaces(2).toNumber();
      return bigValue;
    },

    // 已质押
    haveStake() {
      const val =
        this.stabilityDeposit && this.stabilityDeposit.currentLUSD && this.stabilityDeposit.currentLUSD.toString();
      const bigValue = this.$BigNumber(val).decimalPlaces(2).toNumber();
      return bigValue;
    },

    // 待提取BNB
    unclaimBNB() {
      const val =
        this.stabilityDeposit &&
        this.stabilityDeposit.collateralGain &&
        this.stabilityDeposit.collateralGain.toString();
      const bnb = this.$BigNumber(val).decimalPlaces(2).toNumber();
      return bnb;
    },

    // 待提取Babel
    unclaimBabel() {
      const val =
        this.stabilityDeposit && this.stabilityDeposit.lqtyReward && this.stabilityDeposit.lqtyReward.toString();
      const babel = this.$BigNumber(val).decimalPlaces(2).toNumber();
      return babel;
    },

    // 未释放Babel
    unReleaseBabel() {
      const val =
        this.liquityState &&
        this.liquityState.remainingStabilityPoolLQTYReward &&
        this.liquityState.remainingStabilityPoolLQTYReward.toString();
      const bigValue = this.$BigNumber(val).decimalPlaces(2).toNumber();
      return bigValue;
    },

    // LAI余额
    laiBalance() {
      const val = this.liquityState && this.liquityState.lusdBalance && this.liquityState.lusdBalance.toString();
      const balance = this.$BigNumber(val).decimalPlaces(2).toNumber();
      return balance;
    },
  },
  components: {
    take: () => import('./dialog/takeoutDialog.vue'),
    pledge: () => import('./dialog/pledgeDialog.vue'),
    extract: () => import('./dialog/extractReward.vue'),
    loading: () => import('@/components/basic/loading.vue'),
  },
  methods: {
    openPledge() {
      this.$refs.pledge.open(this.laiBalance);
    },
    openTake() {
      this.$refs.take.open(this.haveStake);
    },
    handleClaim(val) {
      const obj = {};
      obj.balance = this.unclaimBabel;
      obj.method = val;
      obj.unclaimBNB = this.unclaimBNB;
      this.$refs.extract.open(obj);
    },
    getData() {
      this.showLoading = true;
      setTimeout(() => {
        this.showLoading = false;
      }, 500);
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