<template>
  <div class="withdraw-dialog">
    <Modal v-model="openDepositDialog" class-name="withdraw-modal" :footer-hide="true" :closable="true">
      <div class="withdraw-content">
        <p class="title text-center">
          Deposit
        </p>
        <div class="withdraw-wrapper">
          <div class="change-warpper">
            <h2 class="card-title">
              Direction
            </h2>
            <div class="change-content flex items-center justify-between">
              <div class="left-content">
                <div>
                  <div class="circle" />
                  <p>From</p>
                </div>
                <div class="line" />
                <div>
                  <div class="circle" />
                  <p>To</p>
                </div>
              </div>
              <div class="center-content">
                <p class="Wallet">
                  Wallet
                </p>
                <p class="Synth">
                  Synth
                </p>
              </div>
              <div class="right-content">
                <!-- <img src="../../../assets/img/change-32.svg" alt="exchange"> -->
              </div>
            </div>
          </div>
          <div class="asset-warpper">
            <h2 class="card-title">
              Asset
            </h2>
            <div class="asset-item">
              <img :src="getTokenImg('scUSD')">
              <p>scUSD</p>
            </div>
          </div>
          <div class="title-content">
            <span class="card-title">Amount</span>
            <div class="balance-item">
              <span class="mr-2 text-secondary">Balance</span>
              <span>{{ scusdBalance || 0 }} scUSD</span>
            </div>
          </div>
          <div class="input-wrapper flex">
            <input v-model.number="depositAmount" type="number" class="amount-input" @input="handleInput">
            <div class="flex unit">
              <img width="32" :src="getTokenImg('scUSD')">
              <p>scUSD</p>
              <p class="MAX" @click="toMax">
                MAX
              </p>
            </div>
          </div>
        </div>

        <div class="btn-warpper">
          <button v-if="!sendLoading" class="dialogBtn" @click="depositScusd">
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
import Web3 from 'web3';
import event from '@/common/js/event';
import { getSCUSDVaultContract } from '@/contactLogic/earn/scusdDeposit.js';
export default {
  data() {
    return {
      sendLoading: false,
      openDepositDialog: false,
      depositAmount: '',
      previousData: '',
      scusdBalance: '',
    };
  },
  computed: {
    ...mapState(['ethersprovider', 'ethAddress', 'ethChainID']),
  },
  methods: {
    getTokenImg(tokensymbol){
      return this.$parent.getTokenImg(tokensymbol);
    },
    open(data) {
      this.depositAmount = '';
      this.scusdBalance = data;
      this.openDepositDialog = true;
    },

    toMax() {
      this.depositAmount = this.scusdBalance;
    },

    // 限制Input输入小数点的长度
    handleInput(e) {
      const stringValue = e.target.value.toString();
      const regex = /^\d*(\.\d{1,6})?$/;
      if (!stringValue.match(regex) && this.depositAmount !== '') {
        this.depositAmount = this.previousData;
      }
      this.previousData = this.depositAmount;
    },

    // 检验数据是否合法
    checkData() {
      const bigBalance = new BigNumber(this.scusdBalance);
      const amount = new BigNumber(this.depositAmount);
      if (this.depositAmount === '') {
        this.$Notice.warning({
          title: this.$t('notice.n'),
          desc: this.$t('notice.n30'),
        });
        return false;
      }
      if (parseFloat(this.depositAmount) <= 0) {
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

    // 存入scUSD
    async depositScusd() {
      if (!this.checkData()) {
        return false;
      }
      this.sendLoading = true;
      try {
        const chainID = this.ethChainID;
        const account = this.ethAddress;
        const library = this.ethersprovider;
        const Contract = getSCUSDVaultContract({ chainID, account, library });
        const amount = Web3.utils.toWei(this.depositAmount.toString());
        const esGas = await Contract.estimateGas.stake(amount);
        const tx = await Contract.stake(amount, {
          gasLimit: esGas,
        });
        if (tx.hash) {
          event.$emit('sendSuccess');
          this.openwithdrawDialog = false;
          event.$emit('sendtx', [
            tx,
            {
              okinfo: `存入 ${this.depositAmount} scUSD ${this.$t('notice.n42')}`,
              failinfo: `存入 ${this.depositAmount} scUSD ${this.$t('notice.n43')}`,
            },
          ]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.openDepositDialog = false;
        this.sendLoading = false;
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
  h2 {
    height: 19px;
    font-size: 16px;
    font-family: Gilroy-Medium, Gilroy;
    font-weight: 500;
    color: #14171c;
    line-height: 19px;
    margin: 20px 0 8px 0;
  }
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
      .change-warpper {
        .change-content {
          padding: 20px 16px;
          background: #f7f8f9;
          border-radius: 6px;
          .left-content {
            height: 100%;
            display: flex;
            flex-direction: column;
            div {
              display: flex;
              align-items: center;
            }
            .line {
              width: 1px;
              height: 40px;
              background: #0058ff;
              margin-left: 3px;
            }

            .circle {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #0058ff;
              margin-right: 16px;
            }
            p {
              height: 19px;
              font-size: 16px;
              font-family: Gilroy-Medium, Gilroy;
              font-weight: 500;
              color: #8690a8;
              line-height: 19px;
            }
          }
          .center-content {
            width: 50%;
            .Wallet {
              padding-bottom: 20px;
              border-bottom: 1px solid rgba(0, 0, 0, 0.06);
            }
            .Synth {
              padding-top: 20px;
            }
            p {
              font-size: 16px;
              font-family: Gilroy-Medium, Gilroy;
              font-weight: 500;
              color: #14171c;
              line-height: 19px;
            }
          }
          .right-content {
            // cursor: pointer;
            width: 40px;
            height: 40px;
            background: transparent;
            // border-radius: 4px;
            // border: 1px solid #0058ff;
            // padding: 4px;
            // img {
            //   max-width: 32px;
            // }
          }
        }
      }
      .asset-warpper {
        .asset-item {
          cursor: pointer;
          padding: 12px 16px;
          display: flex;
          background: #f7f8f9;
          border-radius: 4px;
          align-items: center;
          img {
            margin-right: 8px;
            max-width: 24px;
          }
          p {
            font-size: 16px;
            font-family: Gilroy-Medium, Gilroy;
            font-weight: 500;
            color: #14171c;
            line-height: 19px;
          }
        }
      }

      .title-content {
        overflow: hidden;
        margin-top: 24px;
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
      .input-wrapper {
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
        .unit {
          position: absolute;
          right: 16px;
          top: 24%;
          justify-content: space-between;
          align-items: center;
          line-height: 32px;
          img {
            max-width: 24px;
            max-height: 24px;
          }
          p {
            font-size: 16px;
            font-weight: 500;
            color: #14171c;
          }
          img {
            max-width: 24px;
            margin-right: 8px;
          }
          .MAX {
            cursor: pointer;
            color: #0058ff;
            margin-left: 16px;
          }
        }
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
</style>
