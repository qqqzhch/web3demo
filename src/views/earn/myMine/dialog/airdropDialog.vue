<template>
  <div class="claim-dialog">
    <Modal v-model="openClaimDialog" class-name="claim-modal" :footer-hide="true" :closable="true">
      <div class="claim-content">
        <p class="title text-center">
          {{ $t('myPage.claim') }}
        </p>
        <div class="claim-wrapper">
          <div class="title-content">
            <span class="card-title">{{ $t('common.amount') }}</span>
            <div class="balance-item">
              <span class="mr-2 text-secondary">{{ $t('myPage.dialog.claim.unclaim') }}</span>
              <span>{{ claimAmount }} {{ rewardToken }}</span>
            </div>
          </div>
          <div class="claim-wrapper">
            <input v-model="claimAmount" readonly type="text" class="amount-input">
          </div>
        </div>

        <div class="btn-warpper">
          <Buttons v-if="!extractAirdropLoading" @click.native="sendExtractAirdrop">
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
import event from '@/common/js/event';
const BigNumber = require('bignumber.js');
BigNumber.config({ DECIMAL_PLACES: 6, ROUNDING_MODE: BigNumber.ROUND_DOWN });
import { withdrawAirDropValue } from '@/contactLogic/AirDrop.js';
export default {
  data() {
    return {
      openClaimDialog: false,
      claimAmount: '',
      data: {},
      coinName: '',
      extractAirdropLoading: false,
      fee: '',
      rewardToken: '',
    };
  },
  methods: {
    open(data) {
      this.data = data;
      // this.coinName = data && data.name;
      this.claimAmount = data && data.data && data.data.earned;
      this.rewardToken = data && data.data && data.data.rewardToken;
      this.openClaimDialog = true;
    },
    checkData() {
      if (this.claimAmount <= 0) {
        this.$Notice.warning({
          title: this.$t('notice.n'),
          desc: this.$t('notice.n31'),
        });
        return false;
      }
      return true;
    },

    // 提取收益
    async sendExtractAirdrop() {
      if (!this.checkData()) {
        return false;
      }
      this.extractAirdropLoading = true;
      try {
        const chainID = this.ethChainID;
        const account = this.ethAddress;
        const library = this.ethersprovider;
        const result = await withdrawAirDropValue(library, account, chainID);
        // console.log('领取的奖励', result);
        this.$Notice.success({
          title: this.$t('notice.n33'),
        });
        event.$emit('sendtx', [
          result,
          {
            okinfo: `${this.$t('common.claimAirdrop')} ${this.claimAmount} LAMB ${this.$t('notice.n42')}`,
            failinfo: `${this.$t('common.claimAirdrop')} ${this.$t('notice.n43')}`,
          },
        ]);
      } catch (error) {
        console.log(error);
        this.$Notice.error({
          title: this.$t('notice.n32'),
        });
      } finally {
        const timer = setTimeout(() => {
          this.openClaimDialog = false;
          this.extractAirdropLoading = false;
          clearTimeout(timer);
        }, 1000);
      }
    },
  },
  components: {
    Buttons: () => import('@/components/basic/buttons'),
  },
  computed: {
    ...mapState(['ethersprovider','ethChainID','ethAddress', 'chainTokenPrice', 'web3']),
  },
};
</script>

<style lang="less" scoped>
.claim-modal {
  width: 500px;
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  .claim-content {
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
    .claim-wrapper {
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
      .claim-wrapper {
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
        .unit {
          cursor: pointer;
          position: absolute;
          right: 16px;
          top: 28px;
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
      margin-top: 24px;
      .button-wrapper {
        height: 48px;
      }
    }
  }
}
</style>