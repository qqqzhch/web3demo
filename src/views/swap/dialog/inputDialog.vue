<template>
  <div class="input-dialog">
    <Modal v-model="openInputDialog" class-name="input-modal" :footer-hide="true" :closable="true">
      <div v-if="isShowInput" class="input-content">
        <p class="title text-center">
          {{ $t('swapHistory.inputDialog.title') }}
        </p>
        <div class="Input-wrapper">
          <div class="title-content">
            <span class="card-title">{{ $t('swapHistory.inputDialog.title') }}</span>
            <div class="balance-item">
              <span class="mr-2 text-secondary">{{ $t('swapHistory.inputDialog.balance') }}</span>
              <span v-if="tokenA">{{ tokenABalance | formatNormalValue }} {{ tokenA.symbol }}</span>
            </div>
          </div>
          <div class="input-wrapper flex">
            <input
              v-model="aTokenAmount"
              type="text"
              :class="inputnoticeA ? 'amount-input amount-input-error' : 'amount-input'"
              @keyup="aTokenChange"
            >
            <div v-if="tokenA" class="flex unit">
              <img width="32" :src="getTokenImg(tokenA.symbol)">
              <p>{{ tokenA.symbol }}</p>
            </div>
          </div>
          <div v-if="inputnoticeA" class="notice-warpper">
            <div class="notice-content">
              <img src="../../../assets/img/notice-red.png">
              <p>{{ inputnoticeA }}</p>
            </div>
          </div>
        </div>
        <div class="add-warpper">
          <img src="../../../assets/img/add.svg" alt="add">
        </div>
        <div class="Input-wrapper">
          <div class="title-content">
            <span class="card-title">{{ $t('swapHistory.inputDialog.title') }}</span>
            <div class="balance-item">
              <span class="mr-2 text-secondary">{{ $t('swapHistory.inputDialog.balance') }}</span>
              <span v-if="tokenB">{{ tokenBBalance | formatNormalValue }} {{ tokenB.symbol }}</span>
            </div>
          </div>
          <div class="input-wrapper flex">
            <input
              v-model="bTokenAmount"
              type="text"
              :class="inputnoticeB ? 'amount-input amount-input-error' : 'amount-input'"
              @keyup="bTokenChange"
            >
            <div v-if="tokenB" class="flex unit">
              <img width="32" :src="getTokenImg(tokenB.symbol)">
              <p>{{ tokenB.symbol }}</p>
            </div>
          </div>
          <div v-if="inputnoticeB" class="notice-warpper">
            <div class="notice-content">
              <img src="../../../assets/img/notice-red.png">
              <p>{{ inputnoticeB }}</p>
            </div>
          </div>
        </div>
        <div class="price-warpper flex justify-between">
          <span>{{ $t('swapHistory.confirmDialog.Price') }}</span>
          <div>
            <p v-if="tokenB && tokenA && price">
              {{ price }} {{ tokenB.symbol }} = 1 {{ tokenA.symbol }}
            </p>
            <p v-if="tokenB && tokenA && price">
              {{ priceinvert }} {{ tokenA.symbol }} = 1 {{ tokenB.symbol }}
            </p>
          </div>
        </div>

        <div class="btn-warpper">
          <div v-if="btnloading">
            <Buttons>{{ $t('swapHistory.confirmDialog.loading') }}</Buttons>
          </div>
          <div v-else>
            <div v-if="tokenAnotNeed == false || tokenBnotNeed == false">
              <div>
                <Buttons v-if="tokenAnotNeed == false" @click.native="approveA">
                  {{ tokenA.symbol }} {{ $t('swapHistory.removeDialog.button') }}
                </Buttons>
              </div>
              <br>
              <div>
                <Buttons v-if="tokenBnotNeed == false" @click.native="approveB">
                  {{ tokenB.symbol }} {{ $t('swapHistory.removeDialog.button') }}
                </Buttons>
              </div>
            </div>

            <div v-else @click="showConfirmInput">
              <Buttons>{{ $t('swapHistory.inputDialog.button') }}</Buttons>
            </div>
            <p class="buy" @click="toexchange">
              {{ $t('swapHistory.inputDialog.buy') }}
            </p>
          </div>
        </div>
      </div>
      <div v-else>
        <div v-if="LiquidityInfo" class="confirmInput-content">
          <div class="arrow-warpper" @click="showInput">
            <img src="../../../assets/img/arrow-left.svg" alt="arrow-left">
          </div>
          <p class="title text-center">
            {{ $t('swapHistory.confirmDialog.titleConfirm') }}
          </p>
          <p class="will-receive">
            {{ $t('swapHistory.confirmDialog.willReceive') }}
          </p>

          <div class="confirm-content">
            <div class="images-warpper">
              <img :src="getTokenImg(tokenB.symbol)" width="48" alt="comp">
              <img :src="getTokenImg(tokenA.symbol)" width="48" alt="comp" class="img2">
            </div>
            <h2>{{ LiquidityInfo.liquidityMinted }}</h2>
            <p>{{ tokenA.symbol }}/{{ tokenB.symbol }} LP</p>
            <span>
              {{ $t('swapHistory.confirmDialog.content1') }} {{ LiquidityInfo.liquidityMinted }} {{ tokenA.symbol }}/{{
                tokenB.symbol
              }}
              {{ $t('swapHistory.confirmDialog.content2') }}
            </span>
          </div>
          <div v-if="btnloading" class="demo-spin-container">
            <loading />
          </div>
          <div v-else>
            <div class="price-warpper">
              <div>
                <span>{{ tokenA.symbol }} {{ $t('swapHistory.inputDialog.title') }}</span>
                <p>{{ aTokenAmount }} {{ tokenA.symbol }}</p>
              </div>
              <div>
                <span>{{ tokenB.symbol }} {{ $t('swapHistory.inputDialog.title') }}</span>
                <p>{{ bTokenAmount }} {{ tokenB.symbol }}</p>
              </div>
              <div>
                <span>{{ $t('swapHistory.confirmDialog.Price') }}</span>
                <div class="price">
                  <p v-if="tokenB && tokenA && price">
                    {{ price }} {{ tokenB.symbol }} = 1 {{ tokenA.symbol }}
                  </p>
                  <p v-if="tokenB && tokenA && price">
                    {{ priceinvert }} {{ tokenA.symbol }} = 1
                    {{ tokenB.symbol }}
                  </p>
                </div>
              </div>
              <div class="items-center">
                <span>{{ $t('swapHistory.confirmDialog.share') }}</span>
                <div class="sharePoll">
                  <span>+{{ LiquidityInfo.poolPercentData | formatRate }}</span>
                  <p>{{ $t('swapHistory.confirmDialog.to') }} {{ newpercent | formatRate }}</p>
                </div>
              </div>
              <div>
                <span>{{ $t('swapHistory.confirmDialog.fee') }}</span>
                <p>{{ fee | formatBalanceNumber }} HT≈${{ (chainTokenPrice * fee) | formatBalanceNumber }}</p>
              </div>
            </div>
            <Buttons @click.native="sendTX">
              {{ $t('swapHistory.confirmDialog.titleConfirm') }}
            </Buttons>
          </div>
        </div>
      </div>
    </Modal>
    <haveSendDialog ref="haveSendtx" />
  </div>
</template>

<script>
import {
  readpariInfoNuminfo,
  calculationLiquidity,
  checkApprove,
  buildAddliquidityParam,
  addliquidityGas,
  sendaddliquidity,
} from '@/contactLogic/readpairpool.js';
import { mapState } from 'vuex';
import { getTokenImg, readSwapBalance, getToken } from '@/contactLogic/readbalance.js';

import Web3 from 'web3';

import { TokenAmount } from '@webfans/uniswapsdk';

const debounce = require('debounce');

import { useTokenApprove } from '@/contacthelp/Approve.js';

import { ROUTER_ADDRESS } from '@/constants/index.js';

import event from '@/common/js/event';
const BigNumber = require('bignumber.js');

import getChainCoinInfo from '@/constants/networkCoinconfig.js';


export default {
  components: {
    Buttons: () => import('@/components/basic/buttons'),
    loading: () => import('@/components/basic/loading.vue'),
    haveSendDialog: () => import('@/components/basic/haveSendDialog.vue'),
  },
  data() {
    return {
      openInputDialog: false,
      tokenA: null,
      tokenB: null,
      tokenABalance: '',
      tokenBBalance: '',
      price: '',
      priceinvert: '',
      aTokenAmount: '',
      bTokenAmount: '',
      isShowInput: true,
      LiquidityInfo: null,
      tokenAnotNeed: true,
      tokenBnotNeed: true,
      btnloading: false,
      fee: '',
      poolPercentData: '',
      parameters: [],
      inputnoticeA: '',
      inputnoticeB: '',
      lpbalance: '',
      ethamount:''
    };
  },
  methods: {
    toexchange() {
      this.$router.push('/exchange');
    },
    clearData() {
      this.$data.aTokenAmount = '';
      this.$data.bTokenAmount = '';
      this.$data.parameters = [];
    },
    getTokenImg(tokensymbol) {
      const chainID = this.ethChainID;
      return getTokenImg(tokensymbol, chainID);
    },
    async open(pairs) {
      console.log('open');
      this.clearData();

      const chainID = this.ethChainID;
      const library = this.ethersprovider;
      const account = this.ethAddress;
      this.openInputDialog = true;
      this.isShowInput = true;

      console.log(pairs);

      this.$data.tokenA = pairs.Pair.tokenAmounts[0].token;
      this.$data.tokenB = pairs.Pair.tokenAmounts[1].token;

      // const TokenA = getToken(this.$data.inputcurrency.symbol,chainID);
      // const TokenB = getToken(this.$data.outputcurrency.symbol,chainID);

      const data = await readSwapBalance(chainID, library, account, this.$data.tokenA, this.$data.tokenB);
      console.log(data);
      this.$data.tokenABalance = Web3.utils.fromWei(data.TokenAamount.toString(), 'ether');
      this.$data.tokenBBalance = Web3.utils.fromWei(data.TokenBamount.toString(), 'ether');

      // const [tokensymbolA,tokensymbolB] = pairs.pairSymbols;
      const dataPrise = await readpariInfoNuminfo(
        chainID,
        library,
        account,
        this.$data.tokenA.symbol,
        this.$data.tokenB.symbol
      );
      console.log('dataPrise', dataPrise);
      this.$data.price = dataPrise.price.toSignificant(6);
      this.$data.priceinvert = dataPrise.priceinvert.toSignificant(6);
      this.$data.poolPercentData = dataPrise.poolPercentData;
      this.$data.lpbalance = dataPrise.balance.toString();
      this.$data.totalSupply = dataPrise.totalSupply.toString();
    },
    aTokenChange: debounce(async function () {
      console.log('aTokenChange');
      const chainID = this.ethChainID;
      const library = this.ethersprovider;
      const account = this.ethAddress;
      this.$data.btnloading = true;

      const TokenA = getToken(this.$data.tokenA.symbol, chainID);
      const TokenB = getToken(this.$data.tokenB.symbol, chainID);

      const num = this.$data.aTokenAmount;

      if (this.inputcheckupA() == false) {
        return;
      }

      const coinATokenAmount = new TokenAmount(TokenA, Web3.utils.toWei(num, 'ether'));

      const coinBTokenAmount = new TokenAmount(TokenB, Web3.utils.toWei('0', 'ether'));

      const istargetBToken = true;

      const data = await calculationLiquidity(
        library,
        chainID,
        coinATokenAmount,
        coinBTokenAmount,
        istargetBToken,
        account
      );

      console.log(data);
      this.$data.bTokenAmount = data.outputNum.toSignificant(6);
      const liquidityMinted = data.liquidityMinted.toSignificant(6);
      this.$data.LiquidityInfo = {
        aTokenAmount: this.$data.aTokenAmount,
        bTokenAmount: this.$data.bTokenAmount,
        liquidityMinted,
        poolPercentData: data.poolPercentData,
      };

      await this.checkeAprove();
      this.$data.btnloading = false;
    }, 1000),
    bTokenChange: debounce(async function () {
      console.log('bTokenChange');
      const chainID = this.ethChainID;
      const library = this.ethersprovider;
      const account = this.ethAddress;

      const TokenA = getToken(this.$data.tokenA.symbol, chainID);
      const TokenB = getToken(this.$data.tokenB.symbol, chainID);

      const num = this.$data.bTokenAmount;

      if (this.inputcheckupB() == false) {
        return;
      }

      this.$data.btnloading = true;
      const coinATokenAmount = new TokenAmount(TokenA, Web3.utils.toWei('0', 'ether'));

      const coinBTokenAmount = new TokenAmount(TokenB, Web3.utils.toWei(num, 'ether'));

      const istargetBToken = false;

      const data = await calculationLiquidity(
        library,
        chainID,
        coinATokenAmount,
        coinBTokenAmount,
        istargetBToken,
        account
      );

      console.log(data);
      this.$data.aTokenAmount = data.outputNum.toSignificant(6);

      const liquidityMinted = data.liquidityMinted.toSignificant(6);
      this.$data.LiquidityInfo = {
        aTokenAmount: this.$data.aTokenAmount,
        bTokenAmount: this.$data.bTokenAmount,
        liquidityMinted,
        poolPercentData: data.poolPercentData,
      };
      await this.checkeAprove();
      this.$data.btnloading = false;
    }, 1000),
    build() {},
    async showConfirmInput() {
      //构造参数计算手续费

      const chainID = this.ethChainID;
      const library = this.ethersprovider;
      const account = this.ethAddress;

      console.log(this.checkAmount());
      if (this.checkAmount()) {
        return;
      }

      const TokenA = getToken(this.$data.tokenA.symbol, chainID);
      const TokenB = getToken(this.$data.tokenB.symbol, chainID);

      const numa = this.$data.aTokenAmount;
      const numb = this.$data.bTokenAmount;

      const coinATokenAmount = new TokenAmount(TokenA, Web3.utils.toWei(numa, 'ether'));

      const coinBTokenAmount = new TokenAmount(TokenB, Web3.utils.toWei(numb, 'ether'));

      let ethamount;
      const coinInfo = getChainCoinInfo(chainID);
      this.$data.ethamount= '';
      if(this.$data.tokenA.symbol==coinInfo.coinName){
        ethamount = Web3.utils.toWei(numa, "ether") ;
        this.$data.ethamount = ethamount ;
      }else{
        ethamount = Web3.utils.toWei(numb, "ether") ;
        this.$data.ethamount = ethamount ;
      }

      this.$data.btnloading = true;
      try {
        const parameters = await buildAddliquidityParam(coinATokenAmount, coinBTokenAmount, account,chainID);
        console.log(parameters);
        this.$data.parameters = parameters;

        const fee = await addliquidityGas(chainID, library, account, parameters,ethamount);

        console.log(fee);

        this.$data.fee = fee;
        this.isShowInput = false;
      } catch (error) {
        console.log(error);
        this.$Notice.error({
          title: this.$t('notice.swapNotice.n5'),
        });
      }
      this.$data.btnloading = false;
    },
    showInput() {
      this.isShowInput = true;
    },
    async checkeAprove() {
      const chainID = this.ethChainID;
      const library = this.ethersprovider;
      const account = this.ethAddress;
      const TokenA = getToken(this.$data.tokenA.symbol, chainID);
      const TokenB = getToken(this.$data.tokenB.symbol, chainID);

      if (this.checkAmount()) {
        return;
      }

      const numa = this.$data.aTokenAmount;
      const numb = this.$data.bTokenAmount;

      const coinATokenAmount = new TokenAmount(TokenA, Web3.utils.toWei(numa, 'ether'));

      const coinBTokenAmount = new TokenAmount(TokenB, Web3.utils.toWei(numb, 'ether'));

      const result = await checkApprove(chainID, library, account, coinATokenAmount, coinBTokenAmount);

      console.log(result);
      this.$data.tokenAnotNeed = result.tokenAnotNeed;
      this.$data.tokenBnotNeed = result.tokenBnotNeed;
    },
    checkAmount() {
      this.$data.inputnoticeA = '';
      this.$data.inputnoticeB = '';
      const a = this.inputcheckupA();
      const b = this.inputcheckupB();
      if (a === false || b === false) {
        return true;
      } else {
        return false;
      }
    },
    inputcheckupA() {
      try {
        // if(this.$data.aTokenAmount == ''){
        //   // this.$data.bTokenAmount = '';
        //   return ;
        // }
        const num = parseFloat(this.$data.aTokenAmount);
        if (isNaN(num)) {
          this.$data.inputnoticeA = this.$t('notice.swapNotice.n1');
          return false;
        }
        const inamount = new BigNumber(this.$data.aTokenAmount);
        if (inamount.isGreaterThan(this.tokenABalance) || inamount.isLessThanOrEqualTo('0')) {
          this.$data.inputnoticeA = this.$t('notice.swapNotice.n2');
          return false;
        }
      } catch (error) {
        console.log(error);
        this.$data.inputnoticeA = this.$t('notice.swapNotice.n1');
      }
    },
    inputcheckupB() {
      try {
        // if(this.$data.bTokenAmount == ''){
        //   // this.$data.aTokenAmount = '';
        //   return;
        // }
        const num = parseFloat(this.$data.bTokenAmount);
        if (isNaN(num)) {
          this.$data.inputnoticeB = this.$t('notice.swapNotice.n1');
          return false;
        }
        const inamount = new BigNumber(this.$data.bTokenAmount);
        if (inamount.isGreaterThan(this.tokenBBalance) || inamount.isLessThanOrEqualTo('0')) {
          this.$data.inputnoticeB = this.$t('notice.swapNotice.n2');
          return false;
        }
      } catch (error) {
        console.log(error);
        this.$data.inputnoticeB = this.$t('notice.swapNotice.n1');
      }
    },
    async approveA() {
      const chainID = this.ethChainID;
      const library = this.ethersprovider;
      const account = this.ethAddress;
      const TokenA = getToken(this.$data.tokenA.symbol, chainID);

      const numa = this.$data.aTokenAmount;
      const amount = Web3.utils.toWei(numa);

      if (this.checkAmount()) {
        return;
      }

      const spender = ROUTER_ADDRESS;
      this.$data.btnloading = true;

      const transaction = await useTokenApprove(library, account, TokenA, spender, amount);
      console.log(transaction);
      if (transaction) {
        const waitdata = await transaction.wait([1]);
        console.log(waitdata);
        this.$data.tokenAnotNeed = true;
      } else {
        //取消授权
        //需要提示
        this.$Notice.error({
          title: this.$t('notice.swapNotice.n4'),
        });
      }
      this.$data.btnloading = false;
    },
    async approveB() {
      const chainID = this.ethChainID;
      const library = this.ethersprovider;
      const account = this.ethAddress;

      if (this.checkAmount()) {
        return;
      }

      const TokenB = getToken(this.$data.tokenB.symbol, chainID);

      const numb = this.$data.bTokenAmount;

      const amount = Web3.utils.toWei(numb);

      const spender = ROUTER_ADDRESS;

      this.$data.btnloading = true;

      const transaction = await useTokenApprove(library, account, TokenB, spender, amount);
      console.log(transaction);
      if (transaction) {
        const waitdata = await transaction.wait([1]);
        console.log(waitdata);
        this.$data.tokenBnotNeed = true;
      } else {
        //取消授权
        //需要提示
        this.$Notice.error({
          title: this.$t('notice.swapNotice.n4'),
        });
      }
      this.$data.btnloading = false;
    },
    async sendTX() {
      const chainID = this.ethChainID;
      const library = this.ethersprovider;
      const account = this.ethAddress;

      const parameters = this.$data.parameters;

      if (this.checkAmount()) {
        return;
      }

      this.$data.btnloading = true;
      try {
        const tx = await sendaddliquidity(chainID, library, account, parameters,this.$data.ethamount);

        const baseTip = `add ${this.$data.LiquidityInfo.liquidityMinted} ${this.$data.tokenA.symbol}/${this.$data.tokenB.symbol}LP `;
        this.$refs.haveSendtx.open(baseTip);
        event.$emit('sendtx', [
          tx,
          {
            okinfo: baseTip + 'success',
            failinfo: baseTip + 'fail',
          },
        ]);
        this.$data.openInputDialog = false;
      } catch (error) {
        this.$Notice.error({
          title: this.$t('notice.swapNotice.n3'),
        });
      }
      this.$data.btnloading = false;
    },
  },
  computed: {
    ...mapState(['ethChainID', 'ethAddress', 'web3', 'ethersprovider', 'chainTokenPrice']),
    newpercent() {
      const addlp = Web3.utils.toWei(this.$data.LiquidityInfo.liquidityMinted);
      const oldlp = Web3.utils.toWei(this.lpbalance);
      const oldalllp = Web3.utils.toWei(this.$data.totalSupply);

      const addlpBG = new BigNumber(addlp);
      const oldlpBG = new BigNumber(oldlp);
      const oldalllpBG = new BigNumber(oldalllp);

      let data = addlpBG.plus(oldlpBG).div(addlpBG.plus(oldalllpBG));
      return (data = data.toString());
    },
  },
  watch: {},
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
          justify-content: space-between;
          width: 88px;
          right: 16px;
          top: 30%;
          p {
            font-size: 16px;
            font-family: Gilroy-Medium, Gilroy;
            line-height: 32px;
            font-weight: 500;
            color: #14171c;
          }
        }
      }
      .notice-warpper {
        margin-top: 10px;
        .notice-content {
          padding: 10px;
          display: flex;
          align-items: center;
          width: 100%;
          height: 40px;
          background: rgba(255, 60, 0, 0.1);
          border-radius: 4px;
          img {
            margin-right: 10px;
          }
          p {
            width: 100%;
            height: 14px;
            font-size: 12px;
            font-family: Gilroy-Medium, Gilroy;
            font-weight: 500;
            color: #ff3c00;
            line-height: 14px;
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
      div {
        width: 60px;
        height: 48px;
        position: relative;
        img {
          position: absolute;
          left: -12px;
          top: 0;
        }
        .img2 {
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
            color: #00d075;
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

.demo-spin-container {
  display: inline-block;
  width: 400px;
  height: 200px;
  position: relative;
}
</style>