<template>
  <div class="wallet-dialog">
    <Modal
      v-model="openSettingDialog"
      class-name="wallet-modal"
      :transfer="true"
      :footer-hide="true"
      :closable="true"
    >
      <div class="modal-content">
        <div class="top-link">
          <a href="https://babelfi.gitbook.io/babel-fi/" target="_blank">BABEL Docs</a>
          <a href="https://www.coinspect.com/liquity-audit/" target="_blank">Security Audits</a>
          <a href="https://github.com/babelfi/babel" target="_blank">GitHub</a>
        </div>
        <div class="bottom-link">
          <a href="https://twitter.com/babel_fi" target="_blank">Twitter</a>
          <a href="https://babelfi.medium.com/" target="_blank">Medium</a>
          <a href="https://t.me/babelfi" target="_blank">Telegram</a>
          <p>© 2021 BABEL All rights reserved</p>
        </div>
      </div>
    </modal>
  </div>
  </Modal>
  </div>
</template>

<script>

export default {
  data() {
    return {
      openSettingDialog: false,
    };
  },
  methods: {
    open() {
      this.openSettingDialog = true;
    },
  },
};
</script>

<style lang="less" scoped>
.modal-content {
    padding: 10px ;
    a{
        display: block;
        height: 24px;
        font-size: 22px;
        line-height: 24px;
        color: #333;
        margin:24px 0px;
        text-align: center;
    }
    p{
        height: 20px;
        color: #ccc;
        text-align: center;
        font-size: 16px;
        line-height: 20px;
        padding-top: 10px;
    }
    .top-link{
        border-bottom: 1px solid #333;
    }

}
</style>