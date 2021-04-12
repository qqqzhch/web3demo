<template>
  <div class="rewardMine-wrapper">
    <div v-if="showLoading">
      <loading />
    </div>
    <template v-else>
      <synth />
      <airDrop />
      <singeMineList :data="designatedData" />
      <multiMineList :data="liquidityData" />
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { StakingRewardListbatch } from '../utils/helpUtils/mineUtilFunc.js';
import event from '@/common/js/event';
import { pairListEarn } from '@/contactLogic/readpairpool.js';
import web3 from 'web3';
import _ from 'underscore';

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
    airDrop: () => import('./components/airDrop.vue'),
    synth: () => import('./components/synth.vue'),
    singeMineList: () => import('./components/singleMineList.vue'),
    multiMineList: () => import('./components/multiMineList.vue'),
    loading: () => import('@/components/basic/loading.vue'),
  },
  methods: {
    async getListData() {
      this.showLoading = true;
      try {
        const data = await StakingRewardListbatch(this.ethersprovider, this.ethAddress, this.ethChainID);

        // 读取所有的价格信息
        const pairListPrice = await pairListEarn(this.ethChainID, this.ethersprovider);

        const tempLiquidity = data.filter((item) => item.kind === 'multi');
        const result = [];
        const results = async () => {
          for (let index = 0; index < tempLiquidity.length; index++) {
            const item = tempLiquidity[index];
            const res = await this.getPriceData(item, pairListPrice);
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
    async getPriceData(item, pairListPrice) {
      const obj = {};
      const tokensymbolA = item.symbol[0];
      const tokensymbolB = item.symbol[1];
      const pledgeBalance = item && item.data && item.data.totalSupply;
      const pledgeBalanceWei = web3.utils.toWei(pledgeBalance.toString());

      // 匹配读取价格信息
      const priceItem = _.find(pairListPrice, (pairItem) => {
        if (
          (pairItem.pairInfo.tokenAmounts[0].token.symbol == tokensymbolA &&
            pairItem.pairInfo.tokenAmounts[1].token.symbol == tokensymbolB) ||
          (pairItem.pairInfo.tokenAmounts[1].token.symbol == tokensymbolA &&
            pairItem.pairInfo.tokenAmounts[0].token.symbol == tokensymbolB)
        ) {
          return pairItem;
        }
      });

      // 构造价格相关信息
      const data = {
        aTokenbalance: priceItem.aTokenbalance(pledgeBalanceWei),
        bTokenbalance: priceItem.bTokenbalance(pledgeBalanceWei),
        price: priceItem.price(tokensymbolA, tokensymbolB).price,
      };

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
    ...mapState(['ethersprovider', 'ethChainID', 'ethAddress', 'earnPrice', 'scashPrice']),
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