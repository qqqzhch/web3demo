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
          <span class="text-success">
            {{ row.data && row.data.rewardRate | formatReward(365) }}%
          </span>
        </template>
        <template slot="stake" slot-scope="{ row }">
          {{ row.data && row.data.balance }}
        </template>
        <template slot="earned" slot-scope="{ row }">
          {{ row.data && row.data.earned }} {{ row.data && row.data.rewardToken }}
        </template>

        <template slot="operation" slot-scope="{ row }">
          <div class="btn-wrapper flex justify-start items-center">
            <button class="table-btn claim" @click="openClaim(row)">
              Claim
            </button>
            <button class="table-btn stake" @click="openUnstake(row)">
              Unstake <span v-if="row.kind === 'multi'" class="ml-1">LP</span>
            </button>
          </div>
        </template>
      </Table>
    </template>
    <div class="modal-wrapper">
      <takeDialog ref="take" />
      <extractDialog ref="extract" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { StakingRewardList } from '../utils/helpUtils/mineUtilFunc.js';
import event from '@/common/js/event';
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
          minWidth: 140,
        },
      ],
      data: [],
      showLoading: false,
    };
  },
  components: {
    loading: () => import('@/components/basic/loading.vue'),
    takeDialog: () => import('./dialog/takeoutDialog.vue'),
    extractDialog: () => import('./dialog/extractReward.vue'),
  },
  methods: {
    async getListData() {
      this.showLoading = true;
      try {
        const data = await StakingRewardList(this.ethersprovider, this.ethAddress, this.ethChainID);
        this.data = data;
      } catch (error) {
        console.log(error);
      } finally {
        this.showLoading = false;
      }
    },
    openClaim(data) {
      this.$refs.extract.open(data);
    },
    openUnstake(data) {
      this.$refs.take.open(data);
    },
  },
  computed: {
    ...mapState(['ethersprovider', 'ethChainID', 'ethAddress']),
    isReady() {
      return this.ethersprovider && this.ethChainID && this.ethAddress;
    },
  },
  watch: {
    isReady(value) {
      if (value) {
        this.getListData();
      }
    },
  },
  created() {
    if (this.isReady) {
      this.getListData();
    }
  },
  mounted() {
    event.$on('txsuccess', () => {
      this.getListData();
    });
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
    .table-btn {
      width: 100px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 6px;
      font-size: 14px;
      line-height: 16px;
    }
    .claim {
      margin-right: 12px;
      color: #fff;
      background: #0058ff;
    }
    .stake {
      border: 1px solid #0058ff;
      color: #0058ff;
    }
  }
}
</style>