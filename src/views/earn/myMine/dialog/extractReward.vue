<template>
  <div class="claim-dialog">
    <Modal
      v-model="openClaimDialog"
      class-name="claim-modal"
      :footer-hide="true"
      :closable="true"
    >
      <div class="claim-content">
        <p class="title text-center">
          Claim
        </p>
        <div class="claim-wrapper">
          <div class="title-content">
            <span class="card-title">Amount</span>
            <div class="balance-item">
              <span class="mr-2 text-secondary">Unclaimed CASH</span>
              <span>{{ cashBalance }} CASH</span>
            </div>
          </div>
          <div class="claim-wrapper">
            <input v-model="claimAmount" type="text" class="amount-input">
            <div class="unit">
              <p class="MAX" @click="maxAmount">
                MAX
              </p>
            </div>
          </div>
        </div>
        <div class="price-warpper">
          <div class="price-item">
            <span>You will receive SCASH</span>
            <p>1234.21 SCASH</p>
          </div>
          <div class="price-item">
            <span>Price</span>
            <p>1 CASH = 0.12 USDT</p>
          </div>
          <div class="price-item">
            <span>Fee</span>
            <p>0.1 ETH</p>
          </div>
        </div>

        <div class="btn-warpper">
          <Buttons>Next</Buttons>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  components: {
    Buttons: () => import("@/components/basic/buttons"),
  },
  data() {
    return {
      openClaimDialog: false,
      cashBalance:10000,
      claimAmount: "",
    };
  },
  methods: {
      maxAmount(){
          this.claimAmount = this.cashBalance;
      }
  },
  computed: {},
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
          .MAX {
            width: 29px;
            height: 16px;
            font-size: 14px;
            font-family: Gilroy-Medium, Gilroy;
            font-weight: 500;
            color: #0058ff;
            line-height: 16px;
          }
        }
        .amount-input-error {
          &:focus {
            border: 1px solid #ff3c00;
            border-radius: 4px;
          }
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

.demo-spin-container {
  display: inline-block;
  width: 400px;
  height: 200px;
  position: relative;
}
</style>