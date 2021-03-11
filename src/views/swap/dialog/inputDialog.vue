<template>
  <div class="input-dialog">
    <Modal
      v-model="openInputDialog"
      class-name="input-modal"
      :footer-hide="true"
      :closable="true"
    >
      <div class="input-content">
        <p class="title text-center">
          Input
        </p>
        <div class="Input-wrapper">
          <div class="title-content">
            <span class="card-title">Input</span>
            <div class="balance-item">
              <span class="mr-2 text-secondary">Balance</span>
              <span v-if="tokenA">{{ tokenABalance |formatNormalValue }} {{ tokenA.symbol }}</span>
            </div>
          </div>
          <div class="input-wrapper flex">
            <input
              type="text"
              class="amount-input"
            >
            <div
              v-if="tokenA"
              class="flex unit"
            >
              <img
                width="32"
                :src="getTokenImg(tokenA.symbol)"
              >
              <p>{{ tokenA.symbol }}</p>
            </div>
          </div>
        </div>
        <div class="add-warpper">
          <img
            src="../../../assets/img/add.svg"
            alt="add"
          >
        </div>
        <div class="Input-wrapper">
          <div class="title-content">
            <span class="card-title">Input</span>
            <div class="balance-item">
              <span class="mr-2 text-secondary">Balance</span>
              <span v-if="tokenB">{{ tokenBBalance|formatNormalValue }} {{ tokenB.symbol }}</span>
            </div>
          </div>
          <div class="input-wrapper flex">
            <input
              type="text"
              class="amount-input amount-input-error"
            >
            <div
              v-if="tokenB"
              class="flex unit"
            >
              <img
                width="32"
                :src="getTokenImg(tokenB.symbol)"
              >
              <p>{{ tokenB.symbol }}</p>
            </div>
          </div>
        </div>
        <div class="price-warpper flex justify-between">
          <span>Price</span>
          <div>
            <p>1 scUSD = 12USDT</p>
            <p>12 USDT = 1scUSD</p>
          </div>
        </div>

        <div class="btn-warpper">
          <Buttons>Next</Buttons>
          <p class="buy">
            Buy scUSD
          </p>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>

import {readpariInfoNuminfo}  from '@/contactLogic/readpairpool.js';
import { mapState } from 'vuex';
import {getTokenImg,readSwapBalance} from '@/contactLogic/readbalance.js';

import Web3 from 'web3';



export default {
  components: {
    Buttons: () => import("@/components/basic/buttons"),
  },
  data() {
    return {
      openInputDialog: false,
      tokenA:null,
      tokenB:null,
      tokenABalance:'',
      tokenBBalance:''
    };
  },
  methods: {
    getTokenImg(tokensymbol){
      const chainID = this.ethChainID ;
      return getTokenImg(tokensymbol,chainID);
   },
   async open(pairs) {

       console.log('open');

      const chainID = this.ethChainID ;
      const library = this.ethersprovider; 
      const account = this.ethAddress;
      this.openInputDialog = true;

      console.log(pairs);

      

      this.$data.tokenA = pairs.Pair.tokenAmounts[0].token;
      this.$data.tokenB = pairs.Pair.tokenAmounts[1].token;

      // const TokenA = getToken(this.$data.inputcurrency.symbol,chainID);
      // const TokenB = getToken(this.$data.outputcurrency.symbol,chainID);

      const data = await readSwapBalance(chainID,library, account,this.$data.tokenA,this.$data.tokenB);
      console.log(data);
      this.$data.tokenABalance =Web3.utils.fromWei(data.TokenAamount.toString(), "ether") ;
      this.$data.tokenBBalance =Web3.utils.fromWei(data.TokenBamount.toString(), "ether") ;

      // const [tokensymbolA,tokensymbolB] = pairs.pairSymbols;
      // const  data = await readpariInfoNuminfo(chainID,library,account,tokensymbolA,tokensymbolB);
      // console.log(data);


    },
  },
  computed: {
    ...mapState(['ethChainID', 'ethAddress','web3','ethersprovider']),
  }
};
</script>

<style lang="less" scoped>
.input-modal {
  width: 500px;
  height: 573px;
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  .input-content {
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
    .Input-wrapper {
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
        .unit {
          position: absolute;
          right: 16px;
          top: 30%;
          p {
            margin-left: 8px;
            font-size: 16px;
            font-family: Gilroy-Medium, Gilroy;
            line-height: 32px;
            font-weight: 500;
            color: #14171c;
          }
        }
      }
    }
    .add-warpper {
      width: 40px;
      height: 40px;
      padding: 8px;
      background: #f7f8f9;
      border-radius: 4px;
      margin: 32px auto;
    }
    .price-warpper {
      margin-top: 30px;
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
    .btn-warpper {
      margin-top: 16px;
      .button-wrapper {
        height: 48px;
      }
      .buy {
        cursor: pointer;
        margin-top: 24px;
        text-align: center;
        font-size: 14px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #0058ff;
      }
    }
  }
}
</style>