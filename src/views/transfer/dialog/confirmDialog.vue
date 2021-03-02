<template>
  <div class="asset-dialog">
    <Modal
      v-model="openConfirmDialog"
      class-name="confirm-modal"
      :transfer="true"
      :footer-hide="true"
      :closable="true"
    >
      <div class="right-wrapper">
        <div class="connect-content">
          <p
            slot="header"
            class="title text-center"
          >
            Confirm
          </p>

          <div class="confrim-tLamb text-center">
            <p>1029.23<span class="ml-2">tLAMB</span></p>
          </div>

          <div class="move-item flex justify-between items-center">
            <div class="from-item card-item">
              <p class="card-title text-center">
                From
              </p>
              <div class="main">
                <img
                  src="../../../assets/img/eth48.png"
                  alt="eth48"
                  class="mb-8 mx-auto"
                >
                <p class="net-name mx-auto">
                  Ethereum Network
                </p>
              </div>
            </div>

            <div class="arrow-item">
              <img
                src="../../../assets/img/bigRight.svg"
                alt="big-right-arrow"
              >
            </div>

            <div class="to-item card-item">
              <p class="card-title text-center">
                To
              </p>
              <div class="main">
                <img
                  src="../../../assets/img/binance48.svg"
                  alt="binance48"
                  class="mb-8 mx-auto"
                >
                <div class="net-name netname-2 mx-auto">
                  Binance Smart Chain Network
                </div>
              </div>
            </div>
          </div>

          <div class="details-warpper">
            <div class="details-items">
              <p>Asset</p>
              <div class="details-items">
                <img src="../../../assets/img/lamblogo-32.png">
                <span>tLAMB</span>
              </div>
            </div>
            <div class="details-items">
              <p>Destination</p>
              <span>0x298jk…jh23llkn25</span>
            </div>
            <div class="details-items">
              <p>Network Fee</p>
              <span>11 (100% discount)</span>
            </div>
            <div class="details-items">
              <p>You will receive</p>
              <div class="flex justify-between items-center">
                <img src="../../../assets/img/ethlogo-32.png">
                <span>≈ 12.3847 ETH</span>
              </div>
            </div>
          </div>

          <Buttons>Confirm</Buttons>
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
      openConfirmDialog: false,
      token: "",
    };
  },
  methods: {
    open() {
      this.openConfirmDialog = true;
    },
  },
};
</script>

<style lang="less" scoped>
.right-wrapper {
  width: 500px;
  background: #ffffff;
  border-radius: 12px;
  padding: 36px 44px;
  .connect-content {
    .title {
      width: 100%;
      height: 28px;
      font-size: 24px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #14171c;
      line-height: 28px;
      margin-bottom: 30px;
    }
    .confrim-tLamb {
      width: 100%;
      text-align: center;
      height: 47px;
      font-size: 40px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #14171c;
      line-height: 47px;

      p {
        span {
          font-size: 24px;
        }
      }
    }

    .move-item {
      margin-top: 32px;
      margin-bottom: 32px;
      .card-item {
        .card-title {
          font-size: 16px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #14171c;
          line-height: 19px;
        }
        .main {
          width: 174px;
          height: 128px;
          padding: 16px;
          .net-name {
            width: 62px;
            text-align: center;
            font-size: 14px;
            font-family: Gilroy-Medium, Gilroy;
            font-weight: 500;
            color: #14171c;
            line-height: 16px;
          }
          .netname-2 {
            width: 96px;
          }
        }
      }
      .arrow-item {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 28px;
        height: 28px;
        background: #f7f8f9;
        border-radius: 4px;
      }
    }

    .details-warpper {
      .details-items {
        margin-top: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        p {
          width: 100px;
          font-size: 14px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #828489;
          line-height: 16px;
        }
        span {
          font-size: 14px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #14171c;
          line-height: 16px;
          margin-left: 8px;
        }
        img {
          width: 16px;
          height: 16x;
        }
      }
    }

    .button-wrapper {
      height: 48px;
      margin-top: 24px;
      button {
        font-size: 16px;
      }
    }
  }
}
</style>