<template>
  <div class="input-dialog">
    <Modal
      v-model="openInputDialog"
      class-name="input-modal"
      :footer-hide="true"
      :closable="true"
    >
      <div
        v-if="isShowInput"
        class="input-content"
      >
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
              v-model="aTokenAmount"
              type="text"
              class="amount-input"
              @keyup="aTokenChange"
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
              v-model="bTokenAmount"
              type="text"
              class="amount-input amount-input-error"
              @keyup="bTokenChange"
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
            <p v-if="tokenB&&tokenA&&price">
              {{ price }} {{ tokenB.symbol }} = 1 {{ tokenA.symbol }}
            </p>
            <p v-if="tokenB&&tokenA&&price">
              {{ priceinvert }} {{ tokenA.symbol }} = 1 {{ tokenB.symbol }}
            </p>
          </div>
        </div>

        <div class="btn-warpper">
          <div @click="showConfirmInput">
            <Buttons>Next</Buttons>
          </div>
          
          <p class="buy">
            Buy scUSD
          </p>
        </div>
      </div>

      <div
        v-else
        class="confirmInput-content"
      >
        <div
          class="arrow-warpper"
          @click="showInput"
        >
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

        <div class="confirm-content">
          <div class="images-warpper">
            <img
              src="../../../assets/img/comp.svg"
              alt="comp"
            >
            <img
              src="../../../assets/img/comp.svg"
              alt="comp"
              class="img2"
            >
          </div>
          <h2>1029.23</h2>
          <p>scUSD/USDT LP</p>
          <span>Output is estimated. You will receive at least 11.123 scUSD/USDT
            LP, or the transaction will revert.</span>
        </div>

        <div class="price-warpper">
          <div>
            <span>scUSD Input </span>
            <p>1234.21 scUSD</p>
          </div>
          <div>
            <span>USDT Input</span>
            <p>1234.21 USDT</p>
          </div>
          <div>
            <span>Price</span>
            <div class="price">
              <p>1 scUSD = 12USDT</p>
              <p>12 USDT = 1scUSD</p>
            </div>
          </div>
          <div class="items-center">
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

import {readpariInfoNuminfo,calculationLiquidity}  from '@/contactLogic/readpairpool.js';
import { mapState } from 'vuex';
import {getTokenImg,readSwapBalance,getToken} from '@/contactLogic/readbalance.js';

import Web3 from 'web3';

import { ChainId, Token, TokenAmount, Fetcher ,
    Route, Percent, Router,TradeType,
} from "@webfans/uniswapsdk";

const debounce = require('debounce');



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
      tokenBBalance:'',
      price:'',
      priceinvert:'',
      aTokenAmount:'',
      bTokenAmount:'',
      isShowInput:true,
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
      const  dataPrise = await readpariInfoNuminfo(chainID,library,account, this.$data.tokenA.symbol,this.$data.tokenB.symbol);
      console.log('dataPrise',dataPrise);
      this.$data.price = dataPrise.price.toSignificant(6);
      this.$data.priceinvert = dataPrise.priceinvert.toSignificant(6);


    },
    aTokenChange  : debounce(async function (){
     console.log('aTokenChange');
     const chainID = this.ethChainID ;
      const library = this.ethersprovider; 
      const account = this.ethAddress;

      const TokenA = getToken(this.$data.tokenA.symbol,chainID);
      const TokenB = getToken(this.$data.tokenB.symbol,chainID);

      const num = this.$data.aTokenAmount ;

      const coinATokenAmount = new TokenAmount(
        TokenA,
        Web3.utils.toWei(num, "ether")) ;
      
      const coinBTokenAmount = new TokenAmount(
        TokenB,
        Web3.utils.toWei('0', "ether"));

      const istargetBToken =true;


      const  data = await calculationLiquidity(library,chainID,coinATokenAmount,coinBTokenAmount,istargetBToken,account);
      
      console.log(data);
      this.$data.bTokenAmount = data.outputNum.toSignificant(6) ;

   },1000),
    bTokenChange: debounce(async function () {
     console.log('bTokenChange');
      const chainID = this.ethChainID ;
      const library = this.ethersprovider; 
      const account = this.ethAddress;

      const TokenA = getToken(this.$data.tokenA.symbol,chainID);
      const TokenB = getToken(this.$data.tokenB.symbol,chainID);

      const num = this.$data.bTokenAmount ;

      const coinATokenAmount = new TokenAmount(
        TokenA,
        Web3.utils.toWei('0', "ether")) ;
      
      const coinBTokenAmount = new TokenAmount(
        TokenB,
        Web3.utils.toWei(num, "ether"));

      const istargetBToken =false;


      const  data = await calculationLiquidity(library,chainID,coinATokenAmount,coinBTokenAmount,istargetBToken,account);
      
      console.log(data);
      this.$data.aTokenAmount = data.outputNum.toSignificant(6) ;

   },1000),
   build(){

   },
   showConfirmInput(){
     this.isShowInput = false;
     console.log(11111111111111111);
   },
   showInput(){
     this.isShowInput = true;
   }
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

  .confirmInput-content {
    padding: 0 40px 20px;
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

    .confirm-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      div{
          width: 60px;
          height: 48px;
          position: relative;
          img{
              position: absolute;
              left: -12px;
              top: 0;
          }
          .img2{
              left: 12px;
              top: 0;
          }
      }
      h2 {
        height: 47px;
        font-size: 40px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #14171c;
        line-height: 47px;
        margin: 8px 0;
      }
      p {
        height: 19px;
        font-size: 16px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #14171c;
        line-height: 19px;
      }
      span {
        height: 32px;
        font-size: 14px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #828489;
        line-height: 16px;
        text-align: center;
        margin-top: 8px;
      }
    }

    .price-warpper {
      margin-top: 30px;
      div {
        display: flex;
        justify-content: space-between;
        .sharePoll {
          margin: 16px 0;
          span {
            color: #00D075;
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