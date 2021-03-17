<template>
  <div class="asset-dialog">
    <Modal
      v-model="openConfirmDialog"
      class-name="confirm-modal"
      :transfer="true"
      :footer-hide="true"
      :closable="true"
    >
      <div
        v-if="tradeData"
        class="right-wrapper"
      >
        <div class="connect-content">
          <p
            slot="header"
            class="title text-center"
          >
            Confirm
          </p>

          <div class="confrim-tLamb text-center">
            <p>{{ tradeData.inputAmount }}<span class="ml-2">{{ tradeData.inputcurrency.symbol }}</span></p>
          </div>

          <div class="move-item flex justify-between items-center">
            <div class="from-item card-item">
              <p class="card-title text-center">
                From
              </p>
              <div class="main">
                <img
                  :src="getTokenImg(tradeData.inputcurrency.symbol)"
                  width="48"
                  alt="eth48"
                  class="mb-8 mx-auto"
                >
                <p class="net-name mx-auto">
                  {{ tradeData.inputcurrency.symbol }}
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
                  :src="getTokenImg(tradeData.outputcurrency.symbol)"
                  alt="binance48"
                  width="48"
                  class="mb-8 mx-auto"
                >
                <div class="net-name netname-2 mx-auto">
                  {{ tradeData.outputcurrency.symbol }}
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="btnloading"
          >
            <loading />
          </div>
          <div
            v-else
            class="details-warpper"
          >
            <div class="details-items">
              <p>Asset</p>
              <div class="details-items">
                <img
                  width="16"
                  :src="getTokenImg(tradeData.inputcurrency.symbol)"
                >
                <span>{{ tradeData.inputcurrency.symbol }}</span>
              </div>
            </div>
            <div class="details-items">
              <p>Destination</p>
              <span>{{ `${this.ethAddress.slice(0,6)}...${this.ethAddress.slice(-6)}` }}</span>
            </div>
            <div class="details-items">
              <p>Network Fee</p>
              <span>{{ tradeData.gasfee |formatBalanceNumber }} HT ≈ $ {{ htPrice * tradeData.gasfee | formatBalanceNumber }}</span>
            </div>
            <div class="details-items">
              <p>You will receive</p>
              <div class="flex justify-between items-center">
                <img src="../../../assets/img/ethlogo-32.png">
                <span>{{ tradeData.coinBValue }} {{ tradeData.outputcurrency.symbol }}</span>
              </div>
            </div>
          </div>


          <Buttons
            v-if="btnloading"
            class="disableBtn"
          >
            Confirm
          </Buttons>
          <Buttons
            v-else
            @click.native="Sendtx"
          >
            Confirm
          </Buttons>
        </div>
      </div>
    </Modal>
    <haveSendDialog ref="haveSendtx" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import {SwapSend} from '@/contactLogic/swaplogoc.js';
import event from '@/common/js/event';

import {getTokenImg} from '@/contactLogic/readbalance.js';

let nowTrade;
export default {
  components: {
    Buttons: () => import("@/components/basic/buttons"),
    haveSendDialog: () => import("@/components/basic/haveSendDialog.vue"),
    loading: () => import("@/components/basic/loading.vue"),
  },
  data() {
    return {
      openConfirmDialog: false,
      tradeData:null,
      btnloading:false,
    };
  },
  methods: {
    getTokenImg(tokensymbol){
      const chainID = this.ethChainID ;
      return getTokenImg(tokensymbol,chainID);
    },
    open(data,Trade) {
      console.log('open');

      this.$data.tradeData=data;
      this.openConfirmDialog = true;
      nowTrade = Trade;
    },
   async Sendtx(){
      const chainID = this.ethChainID ;
      const library = this.ethersprovider;
      const account = this.ethAddress;
      try {
        this.$data.btnloading= true;
      const tx = await SwapSend(library,account,chainID,nowTrade);
      console.log(tx);
      // this.$Notice.success({
      //               title: '交易已发送',
      //               desc: tx.base
      //           });
      this.$refs.haveSendtx.open(tx.base);
      event.$emit('sendtx',[tx.response,{
        okinfo:tx.base+"成功",
        failinfo:tx.base+'失败'
      }]);
      this.openConfirmDialog = false;
      } catch (error) {
        console.log(error);
        this.$Notice.error({
                    title: '交易已取消',
                });

      }
      finally{
        this.$data.btnloading= false;

      }


    }
  },
  computed: {
    ...mapState(['ethChainID', 'ethAddress','web3','ethersprovider','htPrice']),
  }
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
   .demo-spin-col{
        height: 100px;
        position: relative;
        // border: 1px solid #eee;

    }

}
</style>