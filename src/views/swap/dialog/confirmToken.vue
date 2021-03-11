<template>
  <div class="conToken-dialog">
    <Modal
      v-model="openconTokenDialog"
      class-name="remove-modal"
      :footer-hide="true"
    >
      <div class="remove-content">
        <div class="arrow-warpper">
          <img
            src="../../../assets/img/arrow-left.svg"
            alt="arrow-left"
          >
        </div>
        <p class="title text-center">
          Confirm
        </p>
        <p class="will-receive">
          You will receive
        </p>
        <div class="token-swap flex items-center justify-between">
          <div class="token-item">
            <img
              src="../../../assets/img/comp.svg"
              alt="copm"
            >
            <p>1029.23</p>
            <span>scUSD</span>
          </div>
          <div class="add-warpper">
            <img
              src="../../../assets/img/add.svg"
              alt="add"
            >
          </div>
          <div class="token-item">
            <img
              src="../../../assets/img/comp.svg"
              alt="copm"
            >
            <p>1029.23</p>
            <span>USDT</span>
          </div>
        </div>
        <div class="price-warpper">
          <div>
            <span>Price</span>
            <div class="price">
              <p>1 scUSD = 12USDT</p>
              <p>12 USDT = 1scUSD</p>
            </div>
          </div>
          <div class=" items-center">
            <span>share of pool</span>
            <div class="sharePoll">
              <span>-1.02%</span>
              <p>to 1.23%</p>
            </div>
          </div>
          <div>
            <span>Fee</span>
            <p>0.1 ETH</p>
          </div>
        </div>
        <Buttons>Confirm</Buttons>
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
      openconTokenDialog: false,
    };
  },
  methods: {
    open() {
      this.openconTokenDialog = true;
    },
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
    position: relative;
    .arrow-warpper {
      cursor: pointer;
      position: absolute;
      left: 24px;
      top: 0;
    }
    .title {
      height: 28px;
      font-size: 24px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #14171c;
      line-height: 28px;
      margin-bottom: 24px;
    }
    .will-receive {
      text-align: center;
      margin: 24px 0 32px;
      height: 19px;
      font-size: 16px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #14171c;
      line-height: 19px;
    }
    .token-swap {
        padding:0 50px 18px;
      .token-item {
          display: flex;
          align-items: center;
          flex-direction: column;
        p {
          height: 28px;
          font-size: 24px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #14171c;
          line-height: 28px;
          margin: 8px 0 4px;
        }
        span {
          font-size: 14px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #14171c;
          line-height: 16px;
        }
      }
    }

    .price-warpper {
      margin-top: 30px;
      div {
        display: flex;
        justify-content: space-between;
        .sharePoll{
            margin: 16px 0;
            span{
                color: #FF3C00;
                margin-right: 5px;
            }
        }
      }
      .price {
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
      margin-top: 24px;
      height: 48px;
    }
  }
}
</style>