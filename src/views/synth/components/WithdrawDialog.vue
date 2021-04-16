<template>
  <div class="withdraw-dialog">
    <Modal v-model="openwithdrawDialog" class-name="withdraw-modal" :footer-hide="true" :closable="true">
      <div class="withdraw-content">
        <p class="title text-center">
          Withdraw
        </p>
        <div class="withdraw-wrapper">
          <div class="title-content">
            <span class="card-title">Amount</span>
            <div class="balance-item">
              <span class="mr-2 text-secondary">Balance</span>
              <span>{{ participateNum || 0 }} scUSD</span>
            </div>
          </div>
          <div class="withdraw-wrapper flex">
            <input v-model.number="withdrawAmount" type="number" class="amount-input" @input="handleInput">
          </div>

          <div class="percentage">
            <div @click="percentage(0.25)">
              25%
            </div>
            <div @click="percentage(0.5)">
              50%
            </div>
            <div @click="percentage(0.75)">
              75%
            </div>
            <div @click="percentage(1)">
              MAX
            </div>
          </div>
        </div>
        <div class="price-warpper">
          <p class="prompt">
            After withdrawal , you will receive scUSD and mining rewards , and will not participate in Synth.
          </p>

          <div class="price-item">
            <span>Withdraw scUSD</span>
            <p>{{ withdrawAmount || 0 }} scUSD</p>
          </div>
          <!-- <div class="price-item">
            <span>System Debt</span>
            <p>-20.32 scUSD</p>
          </div> -->
          <!-- <div class="price-item">
            <span>You will receive</span>
            <p>1324.23 scUSD</p>
          </div> -->
        </div>

        <div class="btn-warpper">
          <button v-if="!takeLoading" class="dialogBtn" @click="sendTakeout">
            Confirm
          </button>
          <button v-else class="dialogBtn">
            {{ $t('common.loading') }}...
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
const BigNumber = require('bignumber.js');
import { mapState } from 'vuex';
import web3 from 'web3';
import event from '@/common/js/event';
import { getSCUSDVaultContract } from '@/contactLogic/earn/scusdDeposit.js';
export default {
  data() {
    return {
      withdrawAmount: '',
      openwithdrawDialog: false,
      previousData: '',
      takeLoading: false,
    };
  },
  computed: {
    ...mapState(['ethersprovider', 'ethAddress', 'ethChainID']),
    ...mapState('synth', ['synthScUSDAmount']),
    participateNum() {
      return this.synthScUSDAmount;
    }
  },
  methods: {
    open() {
      this.withdrawAmount = '';
      this.openwithdrawDialog = true;
    },

    // 计算百分比
    percentage(val) {
      const balance = new BigNumber(this.participateNum);
      const percent = new BigNumber(val);
      this.withdrawAmount = balance.multipliedBy(percent).decimalPlaces(6).toNumber();
    },

    // 限制Input输入小数点的长度
    handleInput(e) {
      const stringValue = e.target.value.toString();
      const regex = /^\d*(\.\d{1,6})?$/;
      if (!stringValue.match(regex) && this.withdrawAmount !== '') {
        this.withdrawAmount = this.previousData;
      }
      this.previousData = this.withdrawAmount;
    },

    // 检验数据是否合法
    checkData() {
      const bigBalance = new BigNumber(this.participateNum);
      const amount = new BigNumber(this.withdrawAmount);
      if (this.withdrawAmount === '') {
        this.$Notice.warning({
          title: this.$t('notice.n'),
          desc: this.$t('notice.n30'),
        });
        return false;
      }
      if (parseFloat(this.withdrawAmount) <= 0) {
        this.$Notice.warning({
          title: this.$t('notice.n'),
          desc: this.$t('notice.n31'),
        });
        return false;
      }
      if (amount.isGreaterThan(bigBalance)) {
        this.$Notice.warning({
          title: this.$t('notice.n'),
          desc: this.$t('notice.n29'),
        });
        return false;
      }

      return true;
    },

    // 取出scUSD
    async sendTakeout() {
      if (!this.checkData()) {
        return false;
      }
      this.takeLoading = true;
      try {
        const chainID = this.ethChainID;
        const account = this.ethAddress;
        const library = this.ethersprovider;
        const contract = getSCUSDVaultContract({ chainID, account, library });
        const amount = web3.utils.toWei(this.withdrawAmount.toString());
        const esGas = await contract.estimateGas.exit(amount);
        const result = await contract.exit(amount, {
          gasLimit: esGas,
        });
        event.$emit('sendSuccess');
        this.openwithdrawDialog = false;
        event.$emit('sendtx', [
          result,
          {
            okinfo: `${this.$t('common.unstake')} ${this.withdrawAmount} scUSD ${this.$t('notice.n42')}`,
            failinfo: `${this.$t('common.unstake')} ${this.withdrawAmount} scUSD ${this.$t('notice.n43')}`,
          },
        ]);
      } catch (error) {
        console.log(error);
        this.$Notice.error({
          title: this.$t('notice.n32'),
        });
      } finally {
        this.openwithdrawDialog = false;
        this.takeLoading = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.withdraw-modal {
  width: 500px;
  height: 573px;
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  .withdraw-content {
    padding: 14px 28px;
    .title {
      height: 28px;
      font-size: 24px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #14171c;
      line-height: 28px;
      margin-bottom: 24px;
    }
    .withdraw-wrapper {
      .title-content {
        overflow: hidden;
        margin: 24px 0 8px;
        span {
          float: left;
        }
        .balance-item {
          float: right;
          font-size: 12px;
          font-weight: 500;
          line-height: 14px;
        }
      }
      .withdraw-wrapper {
        width: 100%;
        height: 72px;
        background: #f7f8f9;
        border-radius: 6px;
        position: relative;
        .amount-input {
          width: 100%;
          height: 100%;
          outline: none;
          border: none;
          background: #f7f8f9;
          font-size: 40px;
          line-height: 47px;
          color: #14171c;
          padding: 16px;
          caret-color: #0058ff;
          &:focus {
            border: 1px solid #0058ff;
            border-radius: 4px;
          }
        }
        .amount-input-error {
          &:focus {
            border: 1px solid #ff3c00;
            border-radius: 4px;
          }
        }
      }

      .percentage {
        margin-top: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        div {
          cursor: pointer;
          width: 23%;
          height: 36px;
          border-radius: 6px;
          border: 1px solid rgba(0, 0, 0, 0.06);
          font-size: 14px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #828489;
          line-height: 36px;
          text-align: center;
        }
        :hover {
          border-color: #0058ff;
          color: #0058ff;
        }
      }
    }
    .price-warpper {
      margin-top: 30px;

      .price-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .sharePool {
          color: #00d075;
        }
      }
      span {
        height: 14px;
        font-size: 12px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #828489;
        line-height: 14px;
      }
      .prompt {
        width: 100%;
        margin-bottom: 24px;
        font-size: 12px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #828489;
        line-height: 14px;
      }
      p {
        height: 14px;
        font-size: 12px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #14171c;
        line-height: 14px;
        margin-bottom: 8px;
      }
    }
    .btn-warpper {
      margin-top: 16px;
      button {
        width: 100%;
        height: 48px;
        background: #0058ff;
        border-radius: 24px;
        font-size: 16px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #ffffff;
        line-height: 48px;
      }
    }
  }
}

.demo-spin-container {
  display: inline-block;
  width: 400px;
  height: 200px;
  position: relative;
}
</style>
