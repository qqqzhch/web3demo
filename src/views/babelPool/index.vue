<template>
  <div class="pool-wrapper">
    <div class="pool-title flex justify-between items-center">
      <p class="title">
        Babel Pool
      </p>
      <p class="subTitle">
        Babel Pool
      </p>
    </div>

    <div class="pool-content">
      <h2 class="title">
        Babel
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
        <div class="detail-item">
          <span class="title">APY</span>
          <span class="value text-success">10000%</span>
        </div>

        <div class="detail-item">
          <span class="title">Total Stake</span>
          <span class="value">{{ totalStakedLQTY }} Babel</span>
        </div>

        <div class="detail-item">
          <span class="title">已质押</span>
          <span class="value">{{ stakedLQTY }} Babel</span>
        </div>

        <div class="detail-item">
          <span class="title">待提取BNB</span>
          <span class="value">{{ collateralGain }} BNB</span>
        </div>

        <div class="detail-item">
          <span class="title">待提取Babel</span>
          <span class="value">{{ lusdGain }} Babel</span>
        </div>
      </div>

      <div class="pool-btn-wrapper">
        <button class="pool-btn" @click="openPledge">
          质押BABEL
        </button>

        <button class="pool-btn" @click="openExtract">
          提取收益
        </button>

        <button class="pool-btn" @click="openTake">
          提取BABEL
        </button>
      </div>
    </div>

    <take ref="take" />
    <pledge ref="pledge" />
    <extract ref="extract" />
  </div>
</template>

<script>
import initLiquity from '@/common/mixin/initLiquity';
import BigNumber from 'bignumber.js';
import { mapState } from 'vuex';

export default {
  mixins: [initLiquity],
  components: {
    take: () => import('./dialog/takeoutDialog.vue'),
    pledge: () => import('./dialog/pledgeDialog.vue'),
    extract: () => import('./dialog/extractReward.vue'),
  },
  mounted() {
    
    
  },
  methods: {
    openPledge() {
      this.$refs.pledge.open();
      
    },
    openExtract() {
      this.$refs.extract.open();
    },
    openTake() {
      this.$refs.take.open();
    },
  },
  watch:{
    liquityReady:function(){
      
    }
  },
  computed:{
    ...mapState('buildr', ['liquityState']),
    totalStakedLQTY:function(){
      
      
      return this.liquityState&&this.liquityState.totalStakedLQTY&&this.liquityState.totalStakedLQTY.shorten();

    },
    stakedLQTY:function(){
      return this.liquityState&&this.liquityState.lqtyStake&&this.liquityState.lqtyStake.stakedLQTY.shorten();
    },
    collateralGain:function(){
      return this.liquityState&&this.liquityState.lqtyStake&&this.liquityState.lqtyStake.collateralGain.shorten();
    },
    lusdGain:function(){
      return this.liquityState&&this.liquityState.lqtyStake&&this.liquityState.lqtyStake.lusdGain.shorten();
    }
  }
};
</script>

<style lang="less" scoped>
@import '../../common/css/pool.less';
</style>