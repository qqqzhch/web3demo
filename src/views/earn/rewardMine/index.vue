<template>
  <div class="rewardMine-wrapper">
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
    };
  },
  components: {
    singeMineList: () => import('./components/singleMineList.vue'),
    multiMineList: () => import('./components/multiMineList.vue'),
  },
  methods: {
    async getListData() {
      try {
        const data = await StakingRewardList(this.ethersprovider, this.ethAddress, this.ethChainID);
        this.liquidityData = data.filter((item) => item.kind === 'multi');
        this.designatedData = data.filter((item) => item.kind === 'single');
        // console.log(this.liquidityData);
        // console.log(this.designatedData);
      } catch (error) {
        console.log(error);
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
</style>