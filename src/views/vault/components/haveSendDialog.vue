<template>
  <div class="success-dialog">
    <Modal
      v-model="openSuccesDialog"
      class-name="succes-modal"
      :transfer="true"
      :footer-hide="true"
      :closable="true"
    >
      <div v-if="status==='ok'" class="modal-content">
        <div class="img-warpper text-center">
          <img src="../../../assets/img/check-green-64.png">
        </div>
        <h1> Deposit {{ data.depositAmount }} BNB,  Borrow {{ data.borrowAmount }} {{ data.stableName }},  {{ $t('vault-created') }}.</h1>
        <Buttons @click.native="onClose">
          Close
        </Buttons>
      </div>
      <div v-if="status==='created'" class="modal-content">
        <div class="text-center">
          <Loading />
        </div>
        <h1>{{ $t('vault-please-wait') }}....</h1>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    components: {
      Buttons: () => import("@/components/basic/buttons"),
      Loading: () => import("@/components/basic/loading.vue"),
    },
    data() {
      return {
        openSuccesDialog: false,
        data:'',
        status: ''
      };
    },
    methods: {
      onClose(){
        this.openSuccesDialog = false;
        // 引导
        this.$router.push(`/vault/balance`);
      },
      open(data, status){
        this.openSuccesDialog = true;
        this.status = status;
        this.data = data;
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
