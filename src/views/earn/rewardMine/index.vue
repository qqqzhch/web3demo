<template>
  <div class="rewardMine-wrapper">
    <div v-if="showLoading">
      <loading />
    </div>
    <template v-else>
      <airDrop :data="airDropData" />
      <singeMineList :data="designatedData" />
      <multiMineList :data="liquidityData" />
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { StakingRewardListbatch } from '../utils/helpUtils/mineUtilFunc.js';
import event from '@/common/js/event';
import { readpariInfoNuminfoEarn } from '@/contactLogic/readpairpool.js';
export default {
  data() {
    return {
      designatedData: [],
      liquidityData: [],
      airDropData: [],
      showLoading: false,
    };
  },
  components: {
    airDrop: ()=> import('./components/airDrop.vue'),
    singeMineList: () => import('./components/singleMineList.vue'),
    multiMineList: () => import('./components/multiMineList.vue'),
    loading: () => import('@/components/basic/loading.vue'),
  },
  methods: {
    async getListData() {
      this.showLoading = true;
      try {
        const data = await StakingRewardListbatch(this.ethersprovider, this.ethAddress, this.ethChainID);
        const airDrop = data.filter(item => item.kind === 'airdrop');
        // console.log({data});
        const tempLiquidity = data.filter((item) => item.kind === 'multi');
        // console.log({tempLiquidity});
        const result = [];
        const results = async () => {
          for (let index = 0; index < tempLiquidity.length; index++) {
            const item = tempLiquidity[index];
            const res = await this.getPriceData(item);
            result.push({
              ...item,
              poolValue: res.usdtNum,
              price: res.price,
            });
          }
        };
        await results();
        this.liquidityData = result;

        this.designatedData = data.filter((item) => item.kind === 'single');
      } catch (error) {
        console.log(error);
      } finally {
        this.showLoading = false;
      }
    },
    async getPriceData(item) {
      // console.log({ item });
      const obj = {};
      const tokensymbolA = item.symbol[0];
      const tokensymbolB = item.symbol[1];
      const pledgeBalance = item && item.data && item.data.totalSupply;
      const pledgeBalanceWei = this.web3.utils.toWei(pledgeBalance.toString());
      const data = await readpariInfoNuminfoEarn(
        this.ethChainID,
        this.ethersprovider,
        tokensymbolA,
        tokensymbolB,
        pledgeBalanceWei
      );
      obj.usdtNum = data.aTokenbalance.multiply(data.price).add(data.bTokenbalance).toSignificant(6);
      obj.price = data.price && data.price.toSignificant(6);
      if (tokensymbolA === 'SCASH' && tokensymbolB === 'USDT') {
        this.$store.commit('changeScashPrice', obj.price);
      }
      this.$store.commit('changeEarnPrice', obj.price);
      return obj;
    },
  },
  computed: {
    ...mapState(['ethersprovider', 'ethChainID', 'ethAddress', 'web3', 'earnPrice', 'scashPrice']),
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
  // min-height: 700px;
}
</style>