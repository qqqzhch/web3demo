<template>
  <div class="text-center">
    <buttons
      background="#000"
      color="#fff"
      @click.native="openDialog"
    >
      打开弹窗
    </buttons>

    <button @click="openSuccesDialog">
      openSuccesDialog
    </button>
    <button @click="openWalletDialog">
      openWalletDialog
    </button>
    <button @click="openAssetDialog">
      openAssetDialog
    </button>
    <button @click="openconfirmtDialog">
      openconfirmtDialog
    </button>


    <div class="modal-wrapper">
      <Modal
        v-model="open"
        class-name="my-modal"
        title="啊啊啊"
        :footer-hide="true"
      >
        <div class="modal-content">
          aaa
        </div>
      </Modal>
    </div>

    <div class="modal-wrapper">
      <assetDialog ref="asset" />
      <succesDialog ref="succes" />
      <walletdialog ref="wallet" />
      <confirmtDialog ref="confirm" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {
    buttons: () => import("@/components/basic/buttons"),
    assetDialog: () => import("@/views/transfer/dialog/assetDialog"),
    succesDialog: () => import("@/views/transfer/dialog/succesDialog"),
    walletdialog: () => import("@/views/transfer/dialog/walletDialog"),
    confirmtDialog:() => import("@/views/transfer/dialog/confirmDialog")

  },
  data() {
    return {
      open: false,
    };
  },
  methods: {
    openDialog() {
      this.open = true;
    },
    openSuccesDialog() {
      this.$refs.succes.open();
    },
    openWalletDialog() {
      this.$refs.wallet.open();
    },
    openAssetDialog() {
      this.$refs.asset.open();
    },
    openconfirmtDialog(){
      this.$refs.confirm.open();
    }
  },
};
</script>
<style lang="less" scoped>
button {
  margin: 20px;
}
</style>
