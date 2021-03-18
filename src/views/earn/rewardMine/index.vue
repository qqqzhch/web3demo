<template>
  <div class="rewardMine-wrapper">
    <div v-if="showLoading">
      <loading />
    </div>
    <template v-else>
      <singeMineList :data="designatedData" />
      <multiMineList :data="liquidityData" />
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { StakingRewardList } from '../utils/helpUtils/mineUtilFunc.js';
import event from '@/common/js/event';
import { readpariInfoNuminfoEarn } from '@/contactLogic/readpairpool.js';
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
    loading: () => import('@/components/basic/loading.vue'),
  },
  methods: {
    async getListData() {
      this.showLoading = true;
      try {
        const data = await StakingRewardList(this.ethersprovider, this.ethAddress, this.ethChainID);

        data.map(async (item) => {
          if (item.kind === 'multi') {
            const res = await this.getPriceData(item);
            if (res) {
              item.poolValue = res.usdtNum;
              item.price = res.price;
            }
          }
        });

        this.liquidityData = data.filter((item) => item.kind === 'multi');
        this.designatedData = data.filter((item) => item.kind === 'single');
      } catch (error) {
        console.log(error);
      } finally {
        setTimeout(() => {
          this.showLoading = false;
        }, 1200);
      }
    },
    async getPriceData(item) {
      const obj={};
      if (item.kind === 'multi') {
        const tokensymbolA = item.symbol[0];
        const tokensymbolB = item.symbol[1];
        const pledgeBalance = item.data && item.data.totalSupply;
        const pledgeBalanceWei = this.web3.utils.toWei(pledgeBalance.toString());
        const data = await readpariInfoNuminfoEarn(
          this.ethChainID,
          this.ethersprovider,
          tokensymbolA,
          tokensymbolB,
          pledgeBalanceWei
        );
        // console.log(data.aTokenbalance.toSignificant(6));
        // console.log(data.bTokenbalance.toSignificant(6));

        obj.usdtNum = data.aTokenbalance.multiply(data.price).add(data.bTokenbalance).toSignificant(6);
        obj.price = data.bTokenbalance.toSignificant(6)/data.aTokenbalance.toSignificant(6);
        this.$store.commit('changeEarnPrice', data.price && data.price.toSignificant(6));
      }
      return obj;
    },
  },
  computed: {
    ...mapState(['ethersprovider', 'ethChainID', 'ethAddress', 'web3', 'earnPrice']),
    isReady() {
      return this.ethChainID && this.ethersprovider;
    },
    isConnect() {
      return this.ethAddress;
    },
  },
  watch: {
    isReady(value) {
      if (value) {
        this.getListData();
      }
    },
    isConnect(value) {
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
.rewardMine-wrapper {
  position: relative;
  width: 100%;
  min-height: 700px;
}
</style>