<template>
  <div class="pool-warpper">
    <div class="rewards-warpper">
      <div class="rewards-item">
        <h2>Liquidity provider rewards</h2>
        <p>
          Liquidity providers earn a transaction fee by providing liquidity to
          trade pairs, and can redeem liquidity and earnings by removing
          liquidity.
        </p>
      </div>
      <div class="rewards-item">
        <h2>How to get scUSD ?</h2>
        <div class="flex items-center buttons-warpper">
          <div class="button-item">
            <h3>Build scUSD</h3>
            <div class="border-image">
              <button>SuperCash Builder</button>
            </div>
          </div>
          <div class="button-item">
            <h3>Buy scUSD</h3>
            <div class="border-image">
              <button>SuperCash Exchange</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="liquidityPool">
      <h2>Liquidity Pool</h2>
      <p>
        You can get liquidity pool token by inputing liquidity to the following
        trading pairs.
      </p>
      <div
        v-if="pairlistloading"
        class="demo-spin-container "
      >
        <loading />
      </div>
      <div
        v-for="item in dataList"
        v-else
        :key="item.pairName"
        class="poolCon"
      >
        <div class="flex items-center justify-between">
          <div class="img-warpper flex">
            <img
              :src="getTokenImg(item.pairSymbols[0])"
              alt=""
              width="48"
            >
            <img
              :src="getTokenImg(item.pairSymbols[1])"
              width="48"
              class="otherImg"
            >
          </div>
          <div>
            <p>{{ item.pairName }}</p>
            <span>{{ item.price }} {{ item.pairSymbols[0] }} = 1 {{ item.pairSymbols[1] }}</span>
          </div>
        </div>
        <div>
          <span>Total Inputed</span>
          <p>{{ item.totalSupply|formatBalance }}</p>
        </div>
        <div class="rightdiv">
          <span>Inputed {{ item.pairSymbols[1] }}</span>
          <span>Inputed {{ item.pairSymbols[0] }}</span>
          <span>My share of pool</span>
        </div>
        <div class="number">
          <span>{{ item.aTokenbalance }}</span>
          <span>{{ item.bTokenbalance }}</span>
          <span>{{ Calculatepercentage(item.balance,item.totalSupply) |formatRate }}</span>
        </div>
        <div>
          <div class="input-warpper">
            <button @click="openInput(item)">
              Input
            </button>
          </div>
          <div class="remove-warpper">
            <button @click="openRemove(item)">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-wrapper">
      <inputDialog ref="input" />
      <removeDialog ref="remove" />
    </div>
  </div>
</template>

<script>
import  {readpairLiquidity} from '@/contactLogic/readpairpool.js';
import { mapState } from 'vuex';
const debounce = require('debounce');

const BigNumber = require("bignumber.js");

import {getTokenImg} from '@/contactLogic/readbalance.js';


export default {
  data() {
    return {
      dataList:[],
      pairlistloading:false
    };
  },
  components: {
    inputDialog: () => import("./dialog/inputDialog.vue"),
    removeDialog: () => import("./dialog/removeDialog.vue"),
    loading: () => import("@/components/basic/loading.vue"),
  },
  mounted() {
    if(this.ethChainID){
      this.$data.pairlistloading = true ;
      this.readList();
      
    }
    
  },
  watch:{
    ethChainID:function(){
      if(this.ethChainID){
        this.$data.pairlistloading = true ;
       this.readList();

      } 
    },
    ethAddress:function(){
      if(this.ethAddress){
        this.$data.pairlistloading = true ;
        this.readList();
      }

    }

  },
  methods: {
    getTokenImg(tokensymbol){
      const chainID = this.ethChainID ;
      return getTokenImg(tokensymbol,chainID);
    },
    Calculatepercentage(balance,totalSupply){
       const balance_ = new BigNumber(balance);
       const totalSupply_ = new BigNumber(totalSupply);
       return balance_.div(totalSupply_).toString() ;


    },
    openInput(pairs) {
      this.$refs.input.open(pairs);
    },
    openRemove(pairs) {
      this.$refs.remove.open(pairs);
    },
   readList:debounce(async function(){
       console.log('readList');
      const chainID = this.ethChainID ;
      const library = this.ethersprovider; 
      const account = this.ethAddress;
      try {
        
        const list = await readpairLiquidity(chainID,library,account);
        console.log(list);
        this.$data.dataList = list;
        
      } catch (error) {
        console.log(error);
        
      }
      finally{
        this.$data.pairlistloading = false ;
      }
      
      
      
      },1000),
  },
  computed: {
    ...mapState(['ethChainID', 'ethAddress','web3','ethersprovider']),
  }
};
</script>

<style lang="less" scoped>
.pool-warpper {
  .rewards-warpper {
    width: 1000px;
    margin-left: 100px;
    display: flex;
    justify-content: space-between;
    .rewards-item {
      width: 400px;
      h2 {
        height: 38px;
        width: 430px;
        font-size: 32px;
        font-family: Gilroy-Bold, Gilroy;
        font-weight: bold;
        color: #14171c;
        line-height: 38px;
      }
      p {
        width: 100%;
        width: 430px;
        font-size: 16px;
        font-family: Gilroy-Regular, Gilroy;
        font-weight: 400;
        color: #14171c;
        line-height: 19px;
        margin-top: 16px;
      }
      .buttons-warpper {
        margin-top: 12px;
        .button-item {
          margin-right: 24px;
          h3 {
            height: 19px;
            font-size: 16px;
            font-family: Gilroy-Bold, Gilroy;
            font-weight: bold;
            color: #14171c;
            line-height: 19px;
          }
          .border-image {
            margin-top: 12px;
            width: 180px;
            height: 40px;
            border-radius: 6px;
            border: 1px solid;
            border-image: linear-gradient(
                90deg,
                rgba(251, 70, 107, 1),
                rgba(63, 94, 251, 1)
              )
              1 1;
            button {
              width: 100%;
              height: 100%;
              font-family: Gilroy-Medium, Gilroy;
              font-weight: 500;
              color: #3f5efb;
              line-height: 19px;
            }
          }
        }
      }
    }
  }
  .liquidityPool {
    margin: 44px 0 0 100px;
    padding: 32px 44px;
    width: 1000px;
    height: 559px;
    background: #ffffff;
    box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
    border-radius: 12px;
    h2 {
      height: 24px;
      font-size: 20px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #14171c;
      line-height: 24px;
      margin-bottom: 24px;
    }
    p {
      height: 19px;
      font-size: 16px;
      font-family: Gilroy-Regular, Gilroy;
      font-weight: 400;
      color: #14171c;
      line-height: 19px;
    }
    .poolCon {
      display: flex;
      margin-top: 24px;
      padding: 22px 24px;
      align-items: center;
      justify-content: space-between;
      div {
        p {
          height: 24px;
          font-size: 20px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #14171c;
          line-height: 24px;
        }
        span {
          display: block;
          height: 16px;
          font-size: 14px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #828489;
          line-height: 16px;
          margin-bottom: 6px;
        }
        .img-warpper {
          margin-right: 16px;
          width: 72px;
          height: 48px;
          position: relative;
          img {
            position: absolute;
            left: 0;
            bottom: 0;
          }
          .otherImg {
            left: 24px;
          }
        }
        .input-warpper {
          width: 120px;
          height: 36px;
          background: #0058ff;
          border-radius: 6px;
          button {
            width: 100%;
            height: 100%;
            font-size: 16px;
            font-family: Gilroy-Medium, Gilroy;
            font-weight: 500;
            color: #ffffff;
            line-height: 19px;
          }
        }
        .remove-warpper {
          margin-top: 8px;
          width: 120px;
          height: 36px;
          border-radius: 6px;
          border: 1px solid #0058ff;
          button {
            width: 100%;
            height: 100%;
            font-size: 16px;
            font-family: Gilroy-Medium, Gilroy;
            font-weight: 500;
            color: #0058ff;
            line-height: 19px;
          }
        }
      }
      .number {
        span {
          color: #14171c;
        }
      }
    }
  }

  .rightdiv{
    span{
      text-align: right;
    }
  }
}
.demo-spin-container{
    display: inline-block;
    width: 100%;
    height: 200px;
    position: relative;
    margin-top: 100px;
  }
</style>