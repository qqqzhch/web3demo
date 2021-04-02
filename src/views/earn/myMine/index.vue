<template>
  <div class="myPage-wrapper">
    <div v-if="showLoading">
      <loading />
    </div>
    <template v-else>
      <Table class="myPage-table-wrapper" :columns="columns" :data="data">
        <template slot="pool" slot-scope="{ row }">
          {{ row.name }}
        </template>

        <!-- <template slot="apy" slot-scope="{ row }">
          <span v-if="row.kind !== 'airdrop'" class="text-success">
            {{ row.data && row.data.rewardRate | formatReward(365, scashPrice, row.data && row.data.totalSupply) }}%
          </span>
          <span v-else>--</span>
        </template> -->
        <template slot="stake" slot-scope="{ row }">
          <span v-if="row.kind !== 'airdrop'">{{ row.data && row.data.balance }}</span>
          <span v-else>{{ row.data && row.data.balance }} scUSD</span>
        </template>
        <template slot="earned" slot-scope="{ row }">
          {{ row.data && row.data.earned | formatNormalValue(2) }} {{ row.data && row.data.rewardToken }}
        </template>

        <template slot="operation" slot-scope="{ row }">
          <div v-if="row.kind !== 'airdrop'" class="btn-wrapper flex justify-start items-center">
            <button class="table-btn claim" @click="openClaim(row)">
              {{ $t('myPage.table.claim') }}
            </button>
            <button class="table-btn stake" @click="openUnstake(row)">
              {{ $t('myPage.table.unstake') }}
              <span v-if="row.kind === 'multi'" class="ml-1">LP</span>
            </button>
          </div>
          <div v-else class="btn-wrapper">
            <button class="table-btn stake" @click="openAir(row)">
              提取空投
            </button>
          </div>
        </template>
      </Table>
    </template>
    <div class="modal-wrapper">
      <takeDialog ref="take" />
      <extractDialog ref="extract" />
      <airDropDialog ref="airdrop" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { StakingRewardListbatch } from '../utils/helpUtils/mineUtilFunc.js';
import { readpariInfoNuminfoEarn } from '@/contactLogic/readpairpool.js';
import event from '@/common/js/event';
import { getUnClaimedReward } from '@/contactLogic/earn/Reward.js';
import { fetchCollateralIndicatorsCurrentDebt } from '@/contactLogic/buildr/create.js';
import web3 from 'web3';
const BigNumber = require('bignumber.js');
export default {
  data() {
    return {
      data: [],
      showLoading: false,
    };
  },
  components: {
    loading: () => import('@/components/basic/loading.vue'),
    takeDialog: () => import('./dialog/takeoutDialog.vue'),
    extractDialog: () => import('./dialog/extractReward.vue'),
    airDropDialog: () => import('./dialog/airdropDialog.vue')
  },
  methods: {
    async getListData() {
      this.showLoading = true;
      try {
        const airData = await this.getAirdropList();
        console.log({ airData });
        const airObj = [
          {
            name: 'LAMB Vault',
            data: {
              balance: airData.staked,
              earned: airData.unclaimReward,
              rewardToken: 'SCASH',
            },
            kind: 'airdrop',
          },
        ];

        const data = await StakingRewardListbatch(this.ethersprovider, this.ethAddress, this.ethChainID);

        const result = data.concat(airObj);
        // console.log(data.push(airObj));
        // console.log(data);
        const [scashData] = data.filter((item) => item.symbol[0] === 'SCASH' && item.symbol[1] === 'USDT');
        // console.log(scashData);
        await this.getPriceData(scashData);
        this.data = result;
      } catch (error) {
        console.log(error);
      } finally {
        this.showLoading = false;
      }
    },
    async getPriceData(item) {
      const tokensymbolA = item.symbol[0];
      const tokensymbolB = item.symbol[1];
      const pledgeBalance = item.data && item.data.totalSupply;
      const pledgeBalanceWei = web3.utils.toWei(pledgeBalance.toString());
      const data = await readpariInfoNuminfoEarn(
        this.ethChainID,
        this.ethersprovider,
        tokensymbolA,
        tokensymbolB,
        pledgeBalanceWei
      );
      const price = data.price && data.price.toSignificant(6);
      this.$store.commit('changeScashPrice', price);
    },
    openClaim(data) {
      this.$refs.extract.open(data);
    },
    openUnstake(data) {
      this.$refs.take.open(data);
    },
    openAir(data) {
      this.$refs.airdrop.open(data);
    },
    async getAirdropList() {
      const web3 = this.web3;
      const chainID = this.ethChainID;
      const account = this.ethAddress;
      const library = this.ethersprovider;
      const tokenName = 'LAMB';
      const unclaimReward = await getUnClaimedReward({ web3, chainID, account, library, tokenName });
      // console.log();
      const stake = await fetchCollateralIndicatorsCurrentDebt({ web3, chainID, account, library, tokenName });
      const obj = {
        unclaimReward: new BigNumber(unclaimReward.toString()).div(1e18).toNumber(),
        staked: stake.toString(),
      };
      return obj;
    },
  },
  computed: {
    ...mapState(['ethersprovider', 'ethChainID', 'ethAddress', 'scashPrice', 'web3']),
    isReady() {
      return this.ethersprovider && this.ethChainID && this.ethAddress && this.web3;
    },
    columns() {
      const columns = [
        {
          title: this.$t('myPage.table.pool'),
          slot: 'pool',
        },
        // {
        //   title: this.$t('myPage.table.apy'),
        //   slot: 'apy',
        // },
        {
          title: this.$t('myPage.table.stake'),
          slot: 'stake',
        },
        {
          title: this.$t('myPage.table.unclaim'),
          slot: 'earned',
        },
        {
          title: this.$t('myPage.table.function'),
          slot: 'operation',
          minWidth: 140,
        },
      ];
      return columns;
    },
  },
  watch: {
    isReady(value) {
      if (value) {
        this.getListData();
        // this.getAirdropList();
      }
    },
  },
  created() {
    if (this.isReady) {
      this.getListData();
      // this.getAirdropList();
    }
  },
  mounted() {
    // this.getAirdropList();
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