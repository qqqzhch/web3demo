<template>
  <div class="asset-dialog">
    <Modal
      v-model="openAssetDialog"
      class-name="asset-modal"
      :transfer="true"
      :footer-hide="true"
      :closable="true"
    >
      <div class="modal-content">
        <p
          slot="header"
          class="title text-center"
        >
          Asset
        </p>
        <div class="input-warpper flex items-center">
          <img src="../../../assets/img/search-16.png">
          <input type="text">
        </div>
        <div
          class="asset-content"
          @click="selectToken('ETH')"
        >
          <div class="flex justify-between items-center">
            <div class="con-wapper flex justify-between items-center">
              <img
                src="../../../assets/img/ethlogo-32.png"
                alt="eth"
              >
              <div class="text-warpper">
                <p>ETH</p>
                <span>Ethereum</span>
              </div>
            </div>

            <div :class="token == 'ETH' ? 'icon-active' : 'img-warpper'">
              <img src="../../../assets/img/check-blue-24.png">
            </div>
          </div>
        </div>
        <div
          class="asset-content"
          @click="selectToken('USDT')"
        >
          <div class="flex justify-between items-center">
            <div class="con-wapper flex justify-between items-center">
              <img
                src="../../../assets/img/usdt.png"
                alt="eth"
              >
              <div class="text-warpper">
                <p>USDT</p>
                <span>TetherUS</span>
              </div>
            </div>
            <div :class="token == 'USDT' ? 'icon-active' : 'img-warpper'">
              <img src="../../../assets/img/check-blue-24.png">
            </div>
          </div>
        </div>
        <div
          class="asset-content"
          @click="selectToken('LAMB')"
        >
          <div class="flex justify-between items-center">
            <div class="con-wapper flex justify-between items-center">
              <img
                src="../../../assets/img/lamblogo-32.png"
                alt="eth"
              >
              <div class="text-warpper">
                <p>LAMB</p>
                <span>Lambda</span>
              </div>
            </div>
            <div :class="token == 'LAMB' ? 'icon-active' : 'img-warpper'">
              <img src="../../../assets/img/check-blue-24.png">
            </div>
          </div>
        </div>
        <div
          class="asset-content"
          @click="selectToken('mLAMB')"
        >
          <div class="flex justify-between items-center">
            <div class="con-wapper flex justify-between items-center">
              <img
                src="../../../assets/img/mlamb48.svg"
                alt="eth"
              >
              <div class="text-warpper">
                <p>mLAMB</p>
                <span>Lambda</span>
              </div>
            </div>
            <div :class="token == 'mLAMB' ? 'icon-active' : 'img-warpper'">
              <img src="../../../assets/img/check-blue-24.png">
            </div>
          </div>
        </div>
        <div
          class="asset-content"
          @click="selectToken('tLAMB')"
        >
          <div class="flex justify-between items-center">
            <div class="con-wapper flex justify-between items-center">
              <img
                src="../../../assets/img/tlamb48.svg"
                alt="eth"
              >
              <div class="text-warpper">
                <p>tLAMB</p>
                <span>Lambda</span>
              </div>
            </div>
            <div :class="token == 'tLAMB' ? 'icon-active' : 'img-warpper'">
              <img src="../../../assets/img/check-blue-24.png">
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      openAssetDialog: false,
    };
  },
  methods: {
    selectToken(token) {
      this.$store.commit('changeToken', token);
      this.openAssetDialog = false;
    },
    open() {
      this.openAssetDialog = true;
    },
  },
  computed: {
    ...mapState(['token']),
  },
};
</script>

<style lang="less" scoped>
.asset-modal {
  width: 452px;
  padding: 24px;
  .title {
    font-size: 24px;
    font-family: Gilroy-Medium, Gilroy;
    font-weight: 500;
    color: #14171c;
    line-height: 50px;
  }
  .input-warpper {
    padding: 5px 10px;
    width: 100%;
    height: 40px;
    background: #f7f8f9;
    border-radius: 6px;
    input {
      width: 80%;
      height: 100%;
      background: #f7f8f9;
      outline: none;
    }
  }

  .asset-content {
    cursor: pointer;
    margin-top: 20px;
    border-bottom: 1px solid #f7f8f9;
    padding: 12px 16px;
    // box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.06);
    img {
      max-width: 32px;
      margin-right: 16px;
    }
    .text-warpper {
      p {
        font-size: 16px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #14171c;
        line-height: 19px;
      }
      span {
        font-size: 12px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #828489;
        line-height: 14px;
      }
    }
    .img-warpper {
      display: none;
    }
    .icon-active {
      display: block;
    }
  }
}
</style>