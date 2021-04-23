<template>
  <div class="pledge-dialog">
    <Modal v-model="openPledgeDialog" class-name="pledge-modal" :transfer="false" :footer-hide="true" :closable="true">
      <div class="pledge-content">
        <p class="title text-center">
          {{ $t('stability.stake') }} {{ coinName }}
        </p>
        <div class="pledge-wrapper">
          <div class="title-content">
            <span class="card-title">{{ $t('earn.dialog.stakeDialog.amount') }}</span>
            <div class="balance-item">
              <span class="mr-2 text-secondary">{{ $t('earn.dialog.stakeDialog.balance') }}</span>
              <span>{{ data.data && data.data.LPTokenbalance }} {{ coinName }}</span>
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
        <div class="price-wrapper mb-4">
          <div class="price-item flex justify-between items-center">
            <span>{{ $t('earn.dialog.stakeDialog.willStake') }}</span>
            <p>{{ pledgeAmount || 0 }} {{ coinName }}</p>
          </div>
        </div>

        <div class="btn-warpper">
          <template v-if="needApprove">
            <Buttons v-if="approveLoading" height="48px" class="dialogBtn">
              {{ $t('earn.dialog.loading') }}
            </Buttons>
            <Buttons v-else height="48px" class="dialogBtn" @click.native="approveTx">
              {{ $t('earn.dialog.stakeDialog.approve') }}
            </Buttons>
          </template>

          <template v-if="!needApprove">
            <Buttons height="48px" @click.native="confirmSendTx">
              {{ $t('common.confirm') }}
            </Buttons>
          </template>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script src="./pledge.js">
</script>

<style lang="less" scoped>
.pledge-modal {
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  .pledge-content {
    .title {
      font-size: 18px;
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
