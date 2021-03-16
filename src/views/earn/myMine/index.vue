<template>
  <div class="myPage-wrapper">
    <h2 claas="pageTitle">
      My Page
    </h2>
    <div v-if="showLoading">
      <loading />
    </div>
    <template v-else>
      <Table class="myPage-table-wrapper" :columns="columns" :data="data">
        <template slot="pool" slot-scope="{ row }">
          {{ row.name }}
        </template>

        <template slot="apy" slot-scope="{ row }">
          {{ row.data && row.data.rewardRate | formatRate }}
        </template>
        <template slot="stake" slot-scope="{ row }">
          {{ row.data && row.data.totalSupply }}
        </template>
        <template slot="earned" slot-scope="{ row }">
          {{ row.data && row.data.earned }}
        </template>

        <template slot="operation" slot-scope="{ row }">
          <button>Claim</button>
          <button>Unstake LP</button>
        </template>
      </Table>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { StakingRewardList } from '../utils/helpUtils/mineUtilFunc.js';
export default {
  data() {
    return {
      columns: [
        {
          title: 'Pool',
          slot: 'pool',
        },
        {
          title: 'APY',
          slot: 'apy',
        },
        {
          title: 'Staked',
          slot: 'stake',
        },
        {
          title: 'Unclaimed',
          slot: 'earned',
        },
        {
          title: 'Function',
          slot: 'operation',
        },
      ],
      data: [],
      showLoading: false,
    };
  },
  components: {
    loading: () => import('@/components/basic/loading.vue'),
  },
  methods: {
    async getListData() {
      this.showLoading = true;
      try {
        const data = await StakingRewardList(this.ethersprovider, this.ethAddress, this.ethChainID);
        console.log(data);
        this.data = data;
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
    this.showLoading = true;
    setTimeout(() => {
      this.getListData();
    }, 500);
  },
};
</script>

<style lang="less" scoped>
.myPage-wrapper {
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 44px;
  margin: 20px 0 100px 0;
  .pageTitle {
    font-size: 20px;
    font-weight: 500;
    color: #14171c;
    line-height: 24px;
  }
  .myPage-table-wrapper {
    margin-top: 8px;
  }
}
</style>