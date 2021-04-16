<template>
  <div class="join-dialog-wrap">
    <Modal
      v-model="isOpen"
      class-name="farm-modal"
      :transfer="true"
      :footer-hide="true"
      :closable="false"
    >
      <div class="modal-content">
        <div class="step-two">
          <div class="title-warpper">
            <img src="../../../assets/img/arrow-left.svg" alt="arrow" @click="onClose">
            <h2>Confirm</h2>
          </div>
          <div class="confirm-content flex flex-col items-center">
            <img src="../../../assets/img/eth48.png">
            <h2>{{ orderData.volume }}</h2>
            <p>{{ orderData.product.baseSymbol }}</p>
          </div>
        </div>
        <div class="item-warpper">
          <div>
            <span>{{ orderData.side === 'buy' ? 'Buying' : 'Selling' }} Price</span>
            <p>1 {{ orderData.product.baseSymbol }} = {{ orderData.product.price }} scUSD</p>
          </div>
          <div>
            <span>Fee</span>
            <p>{{ orderData.totalFee | formatNormalValue }} {{ orderData.side === 'buy' ? 'scUSD' : orderData.product.baseSymbol }}</p>
          </div>
        </div>

        <div class="button-warpper">
          <button class="btn" @click="onOrderSubmit">
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { createOrder } from '../../../contactLogic/synth/order';

export default {
  data() {
    return {
      isOpen: false,
      orderData: {
        product: {
          baseSymbol: ''
        }
      }
    };
  },
  methods: {
    open(data) {
      this.isOpen = true;
      this.orderData = data;
    },
    onClose() {
      this.isOpen = false;
    },
    async onOrderSubmit() {
      const params = this.$parent.getParams();
      const tx = await createOrder(params);
      this.$parent.onOrderSubmit(tx);
      this.onClose();
    }
  }
};
</script>

<style lang="less" scoped>
.step-two {
  margin-top: 40px;
}
.modal-content {
  overflow: hidden;
  padding: 0 44px 10px;
  .title-warpper {
    margin-top: 40px;
    img {
      cursor: pointer;
      position: absolute;
      left: 30px;
      top: 30px;
    }
    h2 {
      height: 28px;
      font-size: 24px;
      font-weight: 500;
      line-height: 28px;
      text-align: center;
      margin: 8px 0;
    }
  }
  .confirm-content {
    margin-top: 32px;
    h2 {
      height: 47px;
      font-size: 40px;
      line-height: 47px;
    }
    p {
      height: 19px;
      font-size: 16px;
      line-height: 19px;
      margin: 8px 0;
    }
  }
  .item-warpper {
    margin-top: 72px;
    div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 16px;
      span {
        font-size: 14px;
        color: #828489;
        line-height: 16px;
      }
      p {
        font-size: 14px;
        line-height: 16px;
      }
    }
  }
  .button-warpper {
    width: 100%;
    height: 48px;
    background: #0058ff;
    border-radius: 6px;
    margin-top: 24px;
    overflow: hidden;
    .btn {
      width: 100%;
      height: 100%;
      font-size: 16px;
      color: #ffffff;
      line-height: 48px;
    }
  }
}
</style>
