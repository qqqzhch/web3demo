<template>
  <div class="pool-wrapper">
    <!-- <div class="pool-title flex justify-between items-center">
      <p class="title">
        LP Pool
      </p>
      <p class="subTitle">
        LP Pool
      </p>
    </div> -->

    <div v-if="showLoading">
      <loading />
    </div>

    <div v-else class="pool-content">
      <a class="title" href="https://exchange.pancakeswap.finance/#/pool" target="_blank">
        BNB-LAI
      </a>

      <div class="tag-wrapper flex justify-center items-center">
        <div class="tag-item tag1">
          BABEL
        </div>
        <div class="tag-item tag2">
          Transfer Fee
        </div>
      </div>

      <div class="pool-detail">
        <!-- <div class="detail-item">
          <span class="title">APY</span>
          <span class="value text-success">10000%</span>
        </div> -->

        <div class="detail-item">
          <span class="title">Total Stake</span>
          <span class="value">{{ totalStake || '--' }} LP</span>
        </div>

        <div class="detail-item">
          <span class="title">Staked</span>
          <span class="value">{{ haveStake || '--' }} LP</span>
        </div>

        <div class="detail-item">
          <span class="title">Unclaimed BABEL</span>
          <span class="value">{{ unclaim || '--' }} BABEL</span>
        </div>
      </div>

      <div class="pool-btn-wrapper">
        <template v-if="ethAddress">
          <button class="pool-btn" @click="openPledge">
            Stake LP
          </button>

          <button class="pool-btn" @click="openExtract">
            Claim
          </button>

          <button class="pool-btn" @click="openTake">
            Unstake LP
          </button>
        </template>

        <template v-else>
          <button class="pool-btn disableBtn">
            Stake LP
          </button>

          <button class="pool-btn disableBtn">
            Claim
          </button>

          <button class="pool-btn disableBtn">
            Unstake LP
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
// import { pairListEarn } from '@/contactLogic/readpairpool.js';
import { StakingRewardListbatch } from '@/contactLogic/earn/lpPool/lpPool.js';
import { mapState } from 'vuex';
import event from '@/common/js/event';
import web3 from 'web3';
import _ from 'underscore';
export default {
  data() {
    return {
      liquidityData: {},
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
    async getListData() {
      this.showLoading = true;
      try {
        const data = await StakingRewardListbatch(this.ethersprovider, this.ethAddress, this.ethChainID);
        console.log(data);
        // 读取所有的价格信息
        // const pairListPrice = await pairListEarn(this.ethChainID, this.ethersprovider);
        const [tempLiquidity] = data.filter((item) => item.kind === 'liquity');
        // const result = [];
        // const results = async () => {
        //   for (let index = 0; index < tempLiquidity.length; index++) {
        //     const item = tempLiquidity[index];
        //     const res = await this.getPriceData(item, pairListPrice);
        //     result.push({
        //       ...item,
        //       poolValue: res.usdtNum,
        //       price: res.price,
        //     });
        //   }
        // };
        // await results();
        // this.liquidityData = result;
        // console.log({result});
        console.log(tempLiquidity);
        this.liquidityData = tempLiquidity;
        // console.log({ tempLiquidity });
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
    openPledge() {
      this.$refs.pledge.open(this.liquidityData);
    },
    openExtract() {
      this.$refs.extract.open(this.liquidityData);
    },
    openTake() {
      this.$refs.take.open(this.liquidityData);
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
    totalStake() {
      const val = this.liquidityData && this.liquidityData.data && this.liquidityData.data.totalSupply.toString();
      const bigValue = this.$BigNumber(val).decimalPlaces(2).toNumber();
      return bigValue;
    },
    haveStake() {
      const val = this.liquidityData && this.liquidityData.data && this.liquidityData.data.balance.toString();
      const bigValue = this.$BigNumber(val).decimalPlaces(2).toNumber();
      return bigValue;
    },
    unclaim() {
      const val = this.liquidityData && this.liquidityData.data && this.liquidityData.data.earned.toString();
      const bigValue = this.$BigNumber(val).decimalPlaces(2).toNumber();
      return bigValue;
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
@import '../../common/css/pool.less';
</style>