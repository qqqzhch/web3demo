<template>
  <div class="rewardMine-wrapper">
    <Spin v-if="showLoading" size="large" fix class="spin-container" />
    <singeMineList :data="designatedData" />
    <multiMineList :data="liquidityData" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { StakingRewardList } from './utils/mineUtilFunc.js';
export default {
  data() {
    return {
      designatedData: [],
      liquidityData: [],
      showLoading: false,
    };
  },
  components: {
    singeMineList: () => import('./components/singleMineList.vue'),
    multiMineList: () => import('./components/multiMineList.vue'),
  },
  methods: {
    async getListData() {
      this.showLoading = true;
      try {
        const data = await StakingRewardList(this.ethersprovider, this.ethAddress, this.ethChainID);
        this.liquidityData = data.filter((item) => item.kind === 'multi');
        this.designatedData = data.filter((item) => item.kind === 'single');
        // console.log(this.liquidityData);
        // console.log(this.designatedData);
      } catch (error) {
        console.log(error);
      } finally {
        this.showLoading = false;
      }
    },
  },
  computed: {
    ...mapState(['ethersprovider', 'ethChainID', 'ethAddress']),
  },
  mounted() {
    setTimeout(() => {
      this.getListData();
    }, 500);
  },
};
</script>

<style lang="less" scoped>
.rewardMine-wrapper {
  position: relative;
  width: 100%;
  min-height: 700px;
}
</style>