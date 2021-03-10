<template>
  <div class="remove-dialog">
    <Modal
      v-model="openRemoveDialog"
      class-name="remove-modal"
      :footer-hide="true"
      :closable="true"
    >
      <div class="remove-content">
        <p class="title text-center">
          Remove
        </p>
        <div class="remove-wrapper">
          <div class="title-content">
            <span class="card-title">Amount</span>
            <div class="balance-item">
              <span class="mr-2 text-secondary">scUSd/USDT LP Balance</span>
              <span>{{ balance }} scUSD</span>
            </div>
          </div>
          <div class="input-wrapper flex">
            <input
              v-model="Amount"
              type="text"
              class="amount-input"
            >
          </div>
        </div>
        <div class="percentage">
          <div @click="percentage(.25)">
            25%
          </div>
          <div @click="percentage(.50)">
            50%
          </div>
          <div @click="percentage(.75)">
            75%
          </div>
          <div @click="percentage(1)">
            MAX
          </div>
        </div>
        <div class="price-warpper">
          <div>
            <span>You will receive scUSD</span>
            <p>1234.21 scUSD</p>
          </div>
          <div>
            <span>You will receive USDT</span>
            <p>1234.21 USDT</p>
          </div>
          <div>
            <span>Price</span>
            <div class="price">
              <p>1 scUSD = 12USDT</p>
              <p>12 USDT = 1scUSD</p>
            </div>
          </div>
        </div>
        <Buttons>Next</Buttons>
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
      openRemoveDialog: false,
      balance:'10000',
      Amount:'',
    };
  },
  methods: {
    open() {
      this.openRemoveDialog = true;
    },
    percentage(i){
        this.Amount = this.balance * i;
    }
  },
};
</script>

<style lang="less" scoped>
.remove-modal {
  width: 500px;
  height: 573px;
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  .remove-content {
    padding: 0 44px 20px;
    .title {
      height: 28px;
      font-size: 24px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #14171c;
      line-height: 28px;
      margin-bottom: 24px;
    }
    .remove-wrapper {
      .title-content {
        overflow: hidden;
        margin: 16px 0 8px;
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
    .price-warpper {
      margin-top: 30px;
      div{
        display: flex;
        justify-content: space-between;
      }
      .price{
          display: block;
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

    .button-wrapper {
      margin-top: 16px;
      height: 48px;
    }
  }
}
</style>