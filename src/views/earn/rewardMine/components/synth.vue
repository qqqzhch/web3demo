<template>
  <div class="synth-wrapper mb-6">
    <div class="title-wrapper flex justify-between items-center">
      <div class="left">
        <span class="title">{{ $t('synth.SynthMining') }}</span>
      </div>
      <div class="right">
        {{ $t('synth.getSynth') }}
      </div>
    </div>
    <div class="airdrop-content-wrapper flex justify-between items-center">
      <div class="airdrop-item name">
        <img src="../../../../assets/img/susd48.svg" alt="susd">
        <span>scUSD</span>
      </div>

      <div class="airdrop-item apy">
        <p class="drop-title">
          {{ $t('synth.APY') }}
        </p>
        <p class="apy-num">
          1044%
        </p>

        <p class="tag">
          <span class="mine font10px">{{ $t('synth.SCashMining') }}</span>
          <span class="reward font10px">{{ $t('synth.FeeRewards') }}</span>
        </p>
      </div>

      <div class="airdrop-item balance">
        <div class="balance-item">
          <span class="title">{{ $t('synth.TotalDeposited') }}</span>
          <span class="value">{{ scusdDeposit || 0 }} scUSD</span>
        </div>
        <div class="balance-item">
          <span class="title">{{ $t('synth.DailyOutput') }}</span>
          <span class="value">123 SCASH</span>
        </div>
      </div>

      <div class="airdrop-item create">
        <button v-if="ethAddress" class="createBtn" @click="openDeposit">
          {{ $t('synth.Deposit') }} scUSD
        </button>
        <button v-else class="createBtn disableBtn">
          {{ $t('synth.Deposit') }} scUSD
        </button>
      </div>
    </div>

    <depositDialog ref="deposit" />
  </div>
</template>

<script>
import { getSCUSDVaultContract } from '@/contactLogic/earn/scusdDeposit.js';
import sythAddressData from '@/constants/synthetix.json';
import { mapState } from 'vuex';
const BigNumber = require('bignumber.js');
export default {
  data() {
    return {
      scusdDeposit: '',
    };
  },
  props: {
    data: {
      type: Array,
    },
  },
  components: {
    depositDialog: () => import('../dialog/depositDialog.vue'),
  },
  computed: {
    ...mapState(['ethChainID', 'ethAddress', 'ethersprovider']),
    isReady() {
      return this.ethChainID && this.ethersprovider && this.ethAddress;
    },
  },
  methods: {
    openDeposit() {
      this.$refs.deposit.open();
    },

    // 获取scUSD总存入量
    async readscsudValt() {
      try {
        const chainID = this.ethChainID;
        const account = this.ethAddress;
        const library = this.ethersprovider;
        const contract = getSCUSDVaultContract({ chainID, account, library });
        const [recieiveItem] = sythAddressData.filter(
          (item) => item.name === 'Blackhole' && item.chainId === this.ethChainID
        );
        const recieiveAddress = recieiveItem.address;
        const totalSupply = await contract.balanceOf(recieiveAddress);
        const scusdDeposit = new BigNumber(totalSupply.toString()).div('1e18').decimalPlaces(6).toNumber();
        this.scusdDeposit = scusdDeposit;
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    if (this.isReady) {
      this.readscsudValt();
    }
  },
};
</script>

<style lang="less" scoped>
.synth-wrapper {
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 32px 44px 44px 44px;
  .title-wrapper {
    .left {
      .title {
        font-size: 20px;
        font-weight: 500;
        color: #14171c;
        line-height: 24px;
      }
    }
    .right {
      font-size: 16px;
      font-weight: 400;
      color: #8690a8;
      line-height: 19px;
    }
  }
  .airdrop-content-wrapper {
    width: 100%;
    margin-top: 24px;
    background: #ffffff;
    box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
    border-radius: 12px;
    padding: 32px 24px;
    .name {
      width: 20%;
      display: flex;
      flex-direction: row;
      justify-self: space-between;
      align-items: center;
      span {
        margin-left: 28px;
        font-size: 20px;
        color: #14171c;
        line-height: 24px;
      }
    }
    .apy {
      width: 20%;
      .apy-num {
        margin-top: 8px;
        font-size: 26px;
        color: #00d075;
        line-height: 30px;
      }
      .tag {
        .mine {
          margin-right: 4px;
          padding: 4px;
          background: rgba(0, 208, 117, 0.2);
          border-radius: 2px;
          color: #00d075;
          line-height: 11px;
        }
        .reward {
          padding: 4px;
          background: rgba(135, 87, 236, 0.2);
          border-radius: 2px;
          color: #8757ec;
          line-height: 11px;
        }
      }
    }
    .balance {
      width: 30%;
      .balance-item {
        margin-bottom: 16px;
        overflow: hidden;
        .title {
          float: left;
          font-size: 14px;
          color: #8690a8;
          line-height: 16px;
          // margin-right: 50px;
        }
        .value {
          float: right;
          font-size: 14px;
          color: #14171c;
          line-height: 16px;
        }
      }
    }
  }
}
.createBtn {
  font-size: 16px;
  color: #ffffff;
  line-height: 19px;
  padding: 8px 16px;
  background: #0058ff;
  border-radius: 18px;
}
.drop-title {
  font-size: 14px;
  color: #8690a8;
  line-height: 16px;
}
</style>