<template>
  <div class="remove-dialog">
    <Modal v-model="openRemoveDialog" class-name="remove-modal" :footer-hide="true" :closable="true">
      <div class="remove-content">
        <p class="title text-center">
          {{ $t('myPage.dialog.unstake.unstake') }} {{ coinName }}
        </p>
        <div class="remove-wrapper">
          <div class="title-content">
            <span class="card-title">{{ $t('common.amount') }}</span>
            <div class="balance-item">
              <span class="mr-2 text-secondary">{{ $t('myPage.dialog.unstake.staked') }} {{ coinName }}</span>
              <span>{{ stakeVal }}</span>
            </div>
          </div>
          <div class="remove-wrapper flex">
            <input v-model="stakeVal" readonly type="text" class="amount-input">
          </div>
        </div>
        <div class="price-warpper">
          <div class="price-item">
            <span>{{ $t('myPage.dialog.unstake.unstake') }} scUSD/USDT LP</span>
            <p>{{ stakeVal }} {{ coinName }}</p>
          </div>
        </div>

        <div class="btn-warpper">
          <Buttons v-if="!takeLoading" @click.native="sendTakeout">
            {{ $t('common.confirm') }}
          </Buttons>
          <Buttons v-else>
            {{ $t('common.loading') }}...
          </Buttons>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { useStakingRewardsContractSigna } from '../../utils/helpUtils/allowances.js';
import event from '@/common/js/event';
export default {
  inject: ['reload'],
  data() {
    return {
      openRemoveDialog: false,
      data: {},
      coinName: '',
      stakeVal: '',
      takeLoading: false,
    };
  },
  methods: {
    open(data) {
      this.data = data;
      this.stakeVal = data && data.data && data.data.balance;
      this.coinName = data && data.name;
      this.openRemoveDialog = true;
    },
    checkData() {
      if (this.stakeVal <= 0) {
        this.$Notice.warning({
          title: this.$t('notice.n'),
          desc: this.$t('notice.n31'),
        });
        return false;
      }
      return true;
    },

    // 取出LP
    async sendTakeout() {
      if (!this.checkData()) {
        return false;
      }
      this.takeLoading = true;
      const tokenJson = this.data;
      try {
        const stakingRewardsContract = useStakingRewardsContractSigna(this.ethersprovider, this.ethAddress, tokenJson);
        const esGas = await stakingRewardsContract.estimateGas.exit();
        const result = await stakingRewardsContract.exit({ gasLimit: esGas });

        this.$Notice.success({
          title: this.$t('notice.n33'),
        });

        event.$emit('sendtx', [
          result,
          {
            okinfo: `Unstake ${this.stakeVal} ${this.coinName} success`,
            failinfo: `Unstake ${this.stakeVal} ${this.coinName} fail`,
          },
        ]);
      } catch (error) {
        console.log(error);
        this.$Notice.error({
          title: this.$t('notice.n32'),
        });
      } finally {
        this.openRemoveDialog = false;
        this.takeLoading = false;
      }
    },
  },
  components: {
    Buttons: () => import('@/components/basic/buttons'),
  },
  computed: {
    ...mapState(['ethersprovider', 'ethAddress']),
  },
};
</script>

<style lang="less" scoped>
.remove-modal {
  width: 500px;
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  .remove-content {
    padding: 14px 28px;
    .title {
      height: 28px;
      font-size: 24px;

      font-weight: 500;
      color: #14171c;
      line-height: 28px;
      margin-bottom: 24px;
    }

    .remove-wrapper {
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
      }

    .price-warpper {
      margin-top: 30px;
      .price-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      span {
        height: 14px;
        font-size: 12px;

        font-weight: 500;
        color: #828489;
        line-height: 14px;
      }
      p {
        height: 14px;
        font-size: 12px;

        font-weight: 500;
        color: #14171c;
        line-height: 14px;
        margin-bottom: 8px;
      }
    }
    .btn-warpper {
      margin-top: 24px;
      .button-wrapper {
        height: 48px;
      }
    }
  }
}
</style>