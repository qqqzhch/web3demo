<template>
  <div class="success-dialog">
    <Modal
      v-model="openSuccesDialog"
      class-name="succes-modal"
      :transfer="true"
      :footer-hide="true"
      :closable="true"
    >
      <div class="modal-content">
        <div class="img-warpper text-center">
          <img src="../../../assets/img/check-green-64.png">
        </div>
        <h1>Asset migration successful</h1>
        <p>123 tLamb assets have been successfully migrated to the BSC network, please check in your Wallet.</p>
        <Buttons>Confirm</Buttons>
      </div>
    </modal>

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
      openSuccesDialog: false,
      wallet: "",
    };
  },
  methods: {
    selectwallet(wallet) {
      this.wallet = wallet;
    },
    open(){
      this.openSuccesDialog = true;
    }
  },
};
</script>

<style lang="less" scoped>
.modal-content {
  padding: 40px;
  .img-warpper {
      margin-top: 40px;
    img {
      width: 64px;
      margin: auto;
    }
  }
  h1 {
    margin: 16px 0 24px;
    font-size: 24px;
    text-align: center;
    font-family: Gilroy-Medium, Gilroy;
    font-weight: 500;
    color: #14171c;
    line-height: 28px;
  }
  p {
    margin: auto;
    width: 80%;
    text-align: center;
    font-size: 16px;
    font-family: Gilroy-Medium, Gilroy;
    font-weight: 500;
    color: #14171c;
    line-height: 19px;
  }
  .button-wrapper {
    height: 48px;
    text-align: center;
    margin-top: 40px;
    button {
      font-size: 16px;
    }
  }
}
</style>