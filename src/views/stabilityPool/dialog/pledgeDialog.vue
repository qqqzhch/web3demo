<template>
  <div class="pledge-dialog">
    <Modal v-model="openPledgeDialog" class-name="pledge-modal" :transfer="false" :footer-hide="true" :closable="true">
      <div class="pledge-content">
        <p class="title text-center">
          {{ $t('stability.stake') }}
        </p>
        <div class="pledge-wrapper">
          <div class="title-content">
            <span class="card-title">{{ $t('earn.dialog.stakeDialog.amount') }}</span>
            <div class="balance-item">
              <span class="mr-2 text-secondary">{{ $t('earn.dialog.stakeDialog.balance') }}</span>
              <span>{{ balance }} {{ LAI }}</span>
            </div>
          </div>
          <div class="pledge-wrapper flex">
            <input v-model.number="pledgeAmount" type="number" class="amount-input" @input="handleInput">
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
              {{ $t('earn.dialog.stakeDialog.max') }}
            </div>
          </div>
        </div>
        <div class="price-wrapper">
          <div class="price-item flex justify-between items-center">
            <span>{{ $t('earn.dialog.stakeDialog.willStake') }}</span>
            <p>{{ pledgeAmount || 0 }} {{ LAI }}</p>
          </div>
        </div>

        <div class="btn-wrapper">
          <Buttons v-if="sendLoading === false" height="48px" @click.native="stakeLQTStabilityPool">
            {{ $t('earn.dialog.stakeDialog.confirm') }}
          </Buttons>
          <Buttons v-else height="48px">
            {{ $t('earn.dialog.loading') }}
          </Buttons>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import event from '@/common/js/event';
export default {
  components: {
    Buttons: () => import('@/components/basic/buttons'),
  },
  data() {
    return {
      openPledgeDialog: false,
      pledgeAmount: '',
      data: {},
      previousData: '',
      sendLoading: false,
      balance: 0,
    };
  },
  computed: {
    ...mapState(['LAI']),
    ...mapState('pool', ['liquity']),
    liquityInstance() {
      const val = this.liquity && this.liquity.send;
      return val;
    },
  },
  methods: {
    open(data) {
      this.pledgeAmount = '';
      this.balance = data;
      this.openPledgeDialog = true;
    },

    async stakeLQTStabilityPool() {
      if (!this.checkData()) {
        return false;
      }
      this.sendLoading = true;
      try {
        const data = await this.liquityInstance.depositLUSDInStabilityPool(this.pledgeAmount, this.AddressZero, {
          gasLimit: this.$globalConfig.gasLimit,
        });
        event.$emit('sendSuccess');
        this.openPledgeDialog = false;
        event.$emit('sendtx', [
          data.rawSentTransaction,
          {
            okinfo: `${this.$t('common.stake')} ${this.pledgeAmount} LAI ${this.$t('notice.n42')}`,
            failinfo: `${this.$t('common.stake')} ${this.pledgeAmount} LAI  ${this.$t('notice.n43')}`,
          },
        ]);
      } catch (error) {
        console.log(error);
      } finally {
        this.openPledgeDialog = false;
        this.sendLoading = false;
      }
    },

    percentage(val) {
      const balance = this.$BigNumber(this.balance);
      const percent = this.$BigNumber(val);
      this.pledgeAmount = balance.multipliedBy(percent).decimalPlaces(6).toNumber();
    },

    // ??????Input????????????????????????
    handleInput(e) {
      const stringValue = e.target.value.toString();
      const regex = /^\d*(\.\d{1,6})?$/;
      if (!stringValue.match(regex) && this.pledgeAmount !== '') {
        this.pledgeAmount = this.previousData;
      }
      this.previousData = this.pledgeAmount;
    },

    // ????????????????????????
    checkData() {
      const balance = this.balance;
      const bigBalance = this.$BigNumber(balance);
      const amount = this.$BigNumber(this.pledgeAmount);
      if (this.pledgeAmount === '') {
        this.$Notice.warning({
          title: this.$t('notice.n'),
          desc: this.$t('notice.n30'),
        });
        return false;
      }
      if (parseFloat(this.pledgeAmount) <= 0) {
        this.$Notice.warning({
          title: this.$t('notice.n'),
          desc: this.$t('notice.n31'),
        });
        return false;
      }
      // console.log(amount.toNumber(),bigBalance.toNumber(),amount.isGreaterThan(bigBalance));
      if (amount.isGreaterThan(bigBalance)) {
        this.$Notice.warning({
          title: this.$t('notice.n'),
          desc: this.$t('notice.n29'),
        });
        return false;
      }

      return true;
    },
  },
};
</script>

<style lang="less" scoped>
.pledge-modal {
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  .pledge-content {
    .title {
      font-size: 24px;
      line-height: 28px;
      margin-bottom: 24px;
    }
    .pledge-wrapper {
      .title-content {
        overflow: hidden;
        margin: 24px 0 8px;
        span {
          float: left;
        }
        .balance-item {
          float: right;
          font-size: 12px;
          line-height: 14px;
        }
      }
      .pledge-wrapper {
        width: 100%;
        height: 72px;
        background: #f7f8f9;
        border-radius: 6px;
        position: relative;
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
          color: #828489;
          line-height: 36px;
          text-align: center;
        }
        :hover {
          border-color: #605AA5;
          color: #605AA5;
        }
      }
    }
    .price-wrapper {
      margin-top: 30px;
      span {
        font-size: 12px;
        color: #828489;
        line-height: 14px;
      }
      p {
        font-size: 12px;
        color: #14171c;
        line-height: 14px;
        margin-bottom: 8px;
      }
    }
    .btn-wrapper {
      margin-top: 16px;
    }
  }
}
</style>
