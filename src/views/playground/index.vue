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

import {readpairpool} from '@/contactLogic/readpairpool.js';
import {readSwapBalance,getToken} from '@/contactLogic/readbalance.js';

import {tradeCalculate} from '@/contactLogic/swaplogoc.js';
import Web3 from 'web3';



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
    },
    pairlist(){
      const chainID = this.ethChainID ;
      const library = window.ethersprovider; 
      const account = this.ethAddress;

      readpairpool(chainID,library, account);

    },
   async readswapamount(){
      const chainID = this.ethChainID ;
      const library = window.ethersprovider; 
      const account = this.ethAddress;
      const TokenA = getToken('tUSD',chainID);
      const TokenB = getToken('USDT',chainID);

      const data = await readSwapBalance(chainID,library, account,TokenA,TokenB);

      console.log(data);

      

    },
    async buildswap(){
     console.log('buildswap');
      const chainID = this.ethChainID ;
      const library = window.ethersprovider; 
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

      

    }
  },
  computed: {
    ...mapState(['ethAddress','ethChainID']),
  }
};
</script>
<style lang="less" scoped>
button {
  margin: 20px;
}
</style>
