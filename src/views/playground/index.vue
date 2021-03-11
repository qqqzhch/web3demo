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
    <button @click="pairlist">
      读取默认交易对
    </button>
    <button @click="readswapamount">
      读取交易对各个币种的余额
    </button>
    <button @click="buildswap">
      构造交易对象
    </button>

    <button @click="getreadpairLiquidity">
      读取交易对提供流动性的信息
    </button>

    <button @click="getreadpariInfo">
      根据两个个参数读取交易对
    </button>

    <button @click="Calculationliquidity">
      计算提供流动性
    </button>

    <button @click="howbuildAddliquidityParam">
      拼接提供流动性参数
    </button>

    <button @click="getreadpariInfoNuminfo">
      单个交易对详情
    </button>
    
    <button @click="getreadpariInfoNuminfo">
      单个交易对详情
    </button>

    <button @click="Removeliquiditylocalauthorization">
      移除流动性本地授权
    </button>


    <button @click="Removeliquiditylocalauthorization">
      移除流动性本地授权
    </button>

    <button @click="calculationRemoveliquidity">
      移除流动性本地计算
    </button>
    


    <!-- howbuildAddliquidityParam -->


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
import { mapState } from 'vuex';

import { ChainId, Token, TokenAmount, Fetcher ,
    Route, Percent, Router,TradeType,
} from "@webfans/uniswapsdk";

import {readpairpool,readpairLiquidity,readpariInfo,
calculationLiquidity,buildAddliquidityParam,checkoutTokenAllowance,readpariInfoNuminfo } from '@/contactLogic/readpairpool.js';
import {readSwapBalance,getToken} from '@/contactLogic/readbalance.js';

import {tradeCalculate} from '@/contactLogic/swaplogoc.js';
import Web3 from 'web3';

import {localApprove} from '@/contactLogic/removeLiquidity.js';

import Bignumber  from 'bignumber.js';



export default {
  name: "Home",
  components: {
    buttons: () => import("@/components/basic/buttons"),
    assetDialog: () => import("@/views/transfer/dialog/assetDialog"),
    succesDialog: () => import("@/views/transfer/dialog/succesDialog"),
    walletdialog: () => import("@/views/transfer/dialog/walletDialog"),
    confirmtDialog:() => import("@/views/transfer/dialog/confirmDialog"),
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
    },
    pairlist(){
      const chainID = this.ethChainID ;
      const library = this.ethersprovider; 
      const account = this.ethAddress;

      readpairpool(chainID,library, account);

    },
   async readswapamount(){
      const chainID = this.ethChainID ;
      const library = this.ethersprovider; 
      const account = this.ethAddress;
      const TokenA = getToken('tUSD',chainID);
      const TokenB = getToken('USDT',chainID);

      const data = await readSwapBalance(chainID,library, account,TokenA,TokenB);

      console.log(data);

      

    },
    async buildswap(){
     console.log('buildswap');
      const chainID = this.ethChainID ;
      const library = this.ethersprovider; 
      const account = this.ethAddress;
      const TokenA = getToken('tUSD',chainID);
      const TokenB = getToken('USDT',chainID);

      const num = '1' ;

      const inputAmount = new TokenAmount(
        TokenA,
        Web3.utils.toWei(num, "ether")) ;
      
      const outToken = new TokenAmount(
        TokenB,
        Web3.utils.toWei('0', "ether"));

      console.log(inputAmount,outToken);
      
      const result = await tradeCalculate(inputAmount,outToken);

      console.log(result);

      

      // console.log(data);

      

    },
    async getreadpairLiquidity(){
      const chainID = this.ethChainID ;
      const library = this.ethersprovider; 
      const account = this.ethAddress;
      const  data = await readpairLiquidity(chainID,library,account);
      console.log(data);

    },
    async getreadpariInfo(){
      const chainID = this.ethChainID ;
      const library = this.ethersprovider; 
      const account = this.ethAddress;
      const  tokensymbolA = 'tUSD';
      const  tokensymbolB = 'USDT';
      const data = await readpariInfo(chainID,library,tokensymbolA,tokensymbolB) ;
      
      console.log(data);
    },
    async Calculationliquidity(){
      const chainID = this.ethChainID ;
      const library = this.ethersprovider; 
      const account = this.ethAddress;

      const TokenA = getToken('tUSD',chainID);
      const TokenB = getToken('USDT',chainID);

      const num = '1' ;

      const coinATokenAmount = new TokenAmount(
        TokenA,
        Web3.utils.toWei(num, "ether")) ;
      
      const coinBTokenAmount = new TokenAmount(
        TokenB,
        Web3.utils.toWei('0', "ether"));

      const istargetBToken =true;
        
      const data = await calculationLiquidity(library,chainID,coinATokenAmount,coinBTokenAmount,istargetBToken,account);
      
      console.log(data);

    },
    async howbuildAddliquidityParam(){

      const library = this.ethersprovider; 
      const account = this.ethAddress;
      const chainID = this.ethChainID ;

      const num = '1' ;

      const TokenA = getToken('tUSD',chainID);
      const TokenB = getToken('USDT',chainID);

      const coinATokenAmount = new TokenAmount(
        TokenA,
        Web3.utils.toWei(num, "ether")) ;

      const coinBTokenAmount = new TokenAmount(
        TokenB,
        Web3.utils.toWei('2', "ether"));

      const data =await buildAddliquidityParam(coinATokenAmount,coinBTokenAmount,account);

      console.log(data);

      const   result =await checkoutTokenAllowance(TokenA,TokenB,library,chainID,account);
      
      console.log(result);


    },
    async getreadpariInfoNuminfo(){

      const chainID = this.ethChainID ;
      const library = this.ethersprovider; 
      const account = this.ethAddress;

      const tokensymbolA = 'tUSD';
      const tokensymbolB = 'USDT';

      const result = await readpariInfoNuminfo(chainID,library,account,tokensymbolA,tokensymbolB);

      console.log(result);

      return result;



    },
    async Removeliquiditylocalauthorization(){
      const chainId = this.ethChainID ;
      const library = this.ethersprovider; 
      const account = this.ethAddress;
      const  pairinfo = await this.getreadpariInfoNuminfo();

      console.log(pairinfo);

     const ToRemoveAmount = new TokenAmount(
        pairinfo.pairInfo.liquidityToken,
        '1'
      );

     const ApproveData = await  localApprove(library,chainId,account,pairinfo.pairInfo,ToRemoveAmount);
     
     console.log(ApproveData);

    },
    async calculationRemoveliquidity(){
      const chainId = this.ethChainID ;
      const library = this.ethersprovider; 
      const account = this.ethAddress;
      const  pairinfo = await this.getreadpariInfoNuminfo();
      
      console.log('pairinfo',pairinfo);
      
      const percent = new Bignumber(1);
      const mybalance = new Bignumber( pairinfo.balance.toString());

      const removenum = mybalance.multipliedBy(percent) ;
      const removenumA = pairinfo.aTokenbalance.multiply(percent);
      const removenumB = pairinfo.bTokenbalance.multiply(percent);

      console.log(removenum);

     

    }
  },
  computed: {
    ...mapState(['ethAddress','ethChainID','web3','ethersprovider']),
  }
};
</script>
<style lang="less" scoped>
button {
  margin: 20px;
}
</style>
