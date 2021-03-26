<template>
  <div>
    <div class="content-wrapper flex justify-between">
      <div class="exchanges-wrapper">
        <div class="list-wrapper">
          <div class="list-title flex justify-between">
            <span class="pair">{{ $t('swap.Pair') }}</span>
            <span class="price">{{ $t('swap.Price') }}</span>
            <div class="change-title flex">
              <span>{{ $t('swap.Change') }}</span>
              <Tooltip placement="top" :content="$t('swap.ChangeTip')">
                <img src="../../assets/img/problem-16.png">
              </Tooltip>
            </div>
          </div>
          <div v-if="pairlistloading" class="demo-spin-container">
            <loading />
          </div>
          <div
            v-for="item in pairlist"
            v-else
            :key="item.pairName"
            :class="selectPairName == item.pairName ? 'list-item active' : 'list-item'"
            @click="selectPair(item)"
          >
            <div>
              <img width="32" :src="getTokenImg(item.listSymbol)">
              <p>{{ item.pairName }}</p>
            </div>
            <p class="price">
              {{ item.price | formatNormalValue }}
            </p>
            <p :class="item.change == '+' ? 'change' : 'change decline'">
              {{ item.change }} {{ item.prisechange | formatRate }}
            </p>
          </div>
        </div>
      </div>
      <div class="swap-wrapper">
        <div class="From-wrapper">
          <div class="title-content">
            <span class="card-title">{{ $t('swap.fromToken') }}</span>
            <div class="balance-item">
              <span class="mr-2 text-secondary">{{ $t('swap.balance') }}</span>
              <span v-if="inputcurrency">{{ inBalance | format1e18Value }} {{ inputcurrency.symbol }}</span>
            </div>
          </div>
          <div class="input-wrapper flex">
            <input
              v-model="inputAmount"
              type="text"
              :class="inputnotice == '' ? 'amount-input' : 'amount-input  amount-input-error'"
              @keyup="inputChange"
            >
            <div v-if="inputcurrency" class="flex unit">
              <img width="32" :src="getTokenImg(inputcurrency.symbol)">
              <p>
                {{ inputcurrency.symbol }}
              </p>
            </div>
          </div>
          <div class="result-wrapper">
            <!-- <span class="text-secondary mr-2">1 tLAMB ≈ 12.2343 USD</span> -->
          </div>
        </div>

        <div v-if="inputnotice" class="notice-wrapper">
          <div class="notice-content">
            <img src="../../assets/img/notice-red.png">
            <p>{{ inputnotice }}</p>
          </div>
        </div>

        <div v-if="isArrow" class="arrow-wrapper" @click="Changeparameters">
          <img src="../../assets/img/exchange-32.svg">
        </div>
        <div v-else class="arrow-wrapper arrow-active" @click="Changeparameters">
          <img src="../../assets/img/exchange-32-w.svg">
        </div>

        <div class="To-wrapper From-wrapper">
          <div class="title-content">
            <span class="card-title">{{ $t('swap.toToken') }}</span>
            <div class="balance-item">
              <span class="mr-2 text-secondary">{{ $t('swap.balance') }}</span>
              <span v-if="outputcurrency">{{ outBalance | format1e18Value }} {{ outputcurrency.symbol }}</span>
            </div>
          </div>
          <div class="input-wrapper flex">
            <input v-model="coinBValue" type="text" class="amount-input" readonly>
            <div v-if="outputcurrency" class="flex unit">
              <img width="32" :src="getTokenImg(outputcurrency.symbol)">
              <p>
                {{ outputcurrency.symbol }}
              </p>
            </div>
          </div>
        </div>

        <div class="details-wrapper">
          <div v-if="needApprove == false" class="details-items">
            <p>{{ $t('swap.ethgasfree') }}</p>
            <span>
              {{ gasfee | formatBalanceNumber }} {{ chainTokenName }} ≈ $
              {{ (chainTokenPrice * gasfee) | formatBalanceNumber }}
            </span>
          </div>
          <div class="details-items">
            <p>{{ $t('swap.PriceImpact') }}</p>
            <span>{{ PriceImpact }}</span>
          </div>
          <div class="details-items">
            <p>{{ $t('swap.Minimumreceived') }}</p>
            <span v-if="outputcurrency">{{ Minimumreceived }} {{ outputcurrency.symbol }}</span>
          </div>
        </div>

        <Buttons v-if="btnloading" border-radius="24px">
          Loading...
        </Buttons>
        <div v-else>
          <Buttons v-if="PriceImpactGreater == true" border-radius="24px">
            {{ $t('swap.PriceImpactError') }}
          </Buttons>
          <div v-else>
            <Buttons v-if="needApprove == false" border-radius="24px" @click.native="openconfirmtDialog">
              {{ $t('swap.swapBtn') }}
            </Buttons>
            <div v-else>
              <Buttons class="smallbtn" border-radius="24px" @click.native="makeApprove">
                {{ $t('swap.approve') }}
              </Buttons>
              <Buttons class="smallbtn disableBtn">
                {{ $t('swap.swapBtn') }}
              </Buttons>
            </div>
          </div>
        </div>
      </div>
    </div>

    <confirmtDialog ref="confirm" />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import { ChainId, TokenAmount } from '@webfans/uniswapsdk';

import {
  INITIAL_ALLOWED_SLIPPAGE,
  ROUTER_ADDRESS,
} from '@/constants/index.js';

import { readpairpool } from '@/contactLogic/readpairpool.js';
import { readSwapBalance, getToken, getTokenImg } from '@/contactLogic/readbalance.js';

import { tradeCalculate, SwapGas } from '@/contactLogic/swaplogoc.js';
import Web3 from 'web3';

import { useNeedApprove } from '@/contacthelp/useNeedApprove.js';
import { useTokenApprove } from '@/contacthelp/Approve.js';

import event from '@/common/js/event';

const debounce = require('debounce');

const BigNumber = require('bignumber.js');
BigNumber.config({ DECIMAL_PLACES: 6, ROUNDING_MODE: BigNumber.ROUND_DOWN });

let nowTrade;

export default {
  data() {
    return {
      isArrow: true,
      pairlist: [],
      selectPairName: '',
      inputcurrency: null,
      outputcurrency: null,
      inputAmount: '',
      inBalance: '',
      outBalance: '',
      selectPairOBJ: null,
      PriceImpact: '',
      PriceImpactGreater: false,
      coinBValue: '',
      Minimumreceived: '',
      btnloading: false,
      needApprove: false,
      gasfee: '',
      pairlistloading: false,
      inputnotice: '',
    };
  },
  components: {
    Buttons: () => import('@/components/basic/buttons'),
    confirmtDialog: () => import('@/views/swap/dialog/confirmDialog'),
    loading: () => import('@/components/basic/loading.vue'),
  },
  methods: {
    getTokenImg(tokensymbol) {
      const chainID = this.ethChainID;
      return getTokenImg(tokensymbol, chainID);
    },
    exchange() {
      this.isArrow = !this.isArrow;
    },
    async readList() {
      const chainID = this.ethChainID;
      const library = this.ethersprovider;
      // const account = this.ethAddress;
      this.$data.pairlistloading = true;
      const data = await readpairpool(chainID, library);
      this.$data.pairlistloading = false;

      console.log({ data });
      this.$data.pairlist = data;
      if (data && data[0] && this.selectPairOBJ === null) {
        setTimeout(() => {
          this.selectPair(data[0]);
        }, 1000);
      }
    },
    async selectPair(pair) {
      console.log(pair);

      this.$data.selectPairOBJ = pair;

      this.$data.selectPairName = pair.pairName;

      this.$data.inputcurrency = pair.Pair.tokenAmounts[1].currency;
      this.$data.outputcurrency = pair.Pair.tokenAmounts[0].currency;
      this.isArrow = true;
      this.showparameters();
    },
    Changeparameters() {
      console.log('Changeparameters');
      if (this.$data.selectPairOBJ) {
        this.isArrow = !this.isArrow;
        this.$data.inputcurrency = this.$data.selectPairOBJ.Pair.tokenAmounts[this.isArrow ? 1 : 0].currency;
        this.$data.outputcurrency = this.$data.selectPairOBJ.Pair.tokenAmounts[this.isArrow ? 0 : 1].currency;
        this.showparameters();
        this.clearData();
      }
    },
    async showparameters() {
      const chainID = this.ethChainID;
      const library = this.ethersprovider;
      const account = this.ethAddress;
      if (account === '') {
        return;
      }
      this.clearData();

      const TokenA = getToken(this.$data.inputcurrency.symbol, chainID);
      const TokenB = getToken(this.$data.outputcurrency.symbol, chainID);

      const data = await readSwapBalance(chainID, library, account, TokenA, TokenB);

      this.$data.inBalance = data.TokenAamount.toString();
      this.$data.outBalance = data.TokenBamount.toString();
    },
    inputChange: debounce(async function () {
      //debounce(
      console.log(this.$data.inputAmount);
      this.$data.inputnotice = '';
      if (this.inputcheckup()) {
        try {
          this.$data.btnloading = true;
          await this.calculationOutPut(this.$data.inputAmount);
        } catch (error) {
          console.log(error);
        } finally {
          this.$data.btnloading = false;
        }
      }
    }, 1000),
    inputcheckup() {
      try {
        const num = parseFloat(this.$data.inputAmount);
        if (isNaN(num)) {
          this.$data.inputnotice = this.$t('swap.enterthequantity');
          nowTrade = null;
          return false;
        }
        const inamount = new BigNumber(Web3.utils.toWei(this.$data.inputAmount, 'ether'));
        if (inamount.isGreaterThan(this.inBalance) || inamount.isLessThanOrEqualTo('0')) {
          this.$data.inputnotice = this.$t('swap.actions.Amountexceedsbalance');
          nowTrade = null;
          return false;
        }
      } catch (error) {
        console.log(error);
        this.$data.inputnotice = this.$t('swap.actions.needNumber');
        nowTrade = null;
      }

      return true;
    },
    clearData() {
      this.$data.inputAmount = '';
      this.$data.coinBValue = '';
      nowTrade = null;
      this.$data.inputnotice = '';
    },
    async calculationOutPut(num) {
      const chainID = this.ethChainID;
      const TokenA = getToken(this.$data.inputcurrency.symbol, chainID);
      const TokenB = getToken(this.$data.outputcurrency.symbol, chainID);

      const inputAmount = new TokenAmount(TokenA, Web3.utils.toWei(num, 'ether'));

      const outToken = new TokenAmount(TokenB, Web3.utils.toWei('0', 'ether'));

      console.log(inputAmount, outToken);

      const result = await tradeCalculate(inputAmount, outToken);

      console.log(result);

      this.$data.PriceImpact = result.PriceImpact;
      this.$data.PriceImpactGreater = result.PriceImpactGreater;
      this.$data.coinBValue = result.coinBValue.toSignificant(6);
      this.$data.Minimumreceived = result.Minimumreceived.toSignificant(6);
      nowTrade = result.trade;

      setTimeout(() => {
        this.getGasFee(result.trade);
      }, 100);
    },
    async getGasFee(trade) {
      const library = this.ethersprovider;
      const account = this.ethAddress;

      console.log(trade);
      const needApprove = await useNeedApprove(account, library, trade, INITIAL_ALLOWED_SLIPPAGE);
      this.$data.needApprove = needApprove;

      console.log(needApprove);
      if (needApprove === false) {
        const gasfee = await SwapGas(library, account, ChainId, trade);
        console.log('gasfee', gasfee);
        this.$data.gasfee = gasfee;
      }
    },
    async makeApprove() {
      console.log('makeApprove');

      const chainID = this.ethChainID;
      const library = this.ethersprovider;
      const account = this.ethAddress;
      const num = this.$data.inputAmount;

      const TokenA = getToken(this.$data.inputcurrency.symbol, chainID);
      const amount = Web3.utils.toWei(num, 'ether');
      const spender = ROUTER_ADDRESS;

      try {
        this.btnloading = true;
        const transaction = await useTokenApprove(library, account, TokenA, spender, amount);
        console.log(transaction);
        if (transaction) {
          const waitdata = await transaction.wait([1]);
          console.log(waitdata);
          this.$data.needApprove = false;
          this.calculationOutPut(num);
        } else {
          //取消授权
          //需要提示
          this.$Notice.error({
            title: this.$t('swap.actions.approvecancel'),
          });
        }
      } catch (error) {
        console.log(error);
        this.$Notice.error({
          title: this.$t('swap.actions.Transactionfailure'),
          desc: error.message,
        });
      } finally {
        this.btnloading = false;
      }
    },
    openconfirmtDialog() {
      if (nowTrade) {
        this.$refs.confirm.open(this.$data, nowTrade);
      }
    },
  },
  computed: {
    ...mapState(['ethChainID', 'ethAddress', 'web3', 'ethersprovider', 'chainTokenPrice', 'chainTokenName']),
  },
  async mounted() {
    if (this.ethChainID) {
      this.readList();
    }
    //txsuccess
    event.$on('txsuccess', () => {
      this.readList();
      this.showparameters();
    });
  },
  watch: {
    ethChainID: function () {
      if (this.ethChainID) {
        this.readList();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.content-wrapper {
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  margin-top: 16px;
  padding: 44px;
  .exchanges-wrapper {
    width: 48%;
    .list-wrapper {
      width: 100%;
      .list-title {
        width: 100%;
        padding: 0px 16px 8px 16px;
        span {
          height: 14px;
          font-size: 12px;
          font-weight: 500;
          color: #828489;
          line-height: 14px;
        }
        .pair {
          width: 50%;
        }
        .price {
          width: 25%;
        }
        .change-title {
          width: 25%;
          img {
            margin-left: 4px;
            cursor: pointer;
            position: relative;
            :hover::after {
              content: 'fslkasfjlkasjflaksfjklasjfasfalksfjlkasjflkafj';
              display: block;
              width: 156px;
              height: 40px;
              background: rgba(14, 17, 28, 0.6);
              border-radius: 6px;
              position: absolute;
              right: 10%;
              top: 0;
            }
          }
        }
      }
      .list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        cursor: pointer;
        height: 56px;
        box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.06);
        padding: 16px;
        position: relative;
        div {
          display: flex;
          width: 50%;
          align-items: center;
          line-height: 32px;
          img {
            max-width: 24px;
            max-height: 24px;
            margin-right: 8px;
            p {
              height: 80px;
              font-size: 16px;
              font-weight: 500;
              color: #14171c;
              line-height: 19px;
            }
          }
        }
        .price {
          width: 25%;
          height: 19px;
          font-size: 16px;
          font-weight: 500;
          color: #14171c;
          line-height: 19px;
        }
        .change {
          width: 25%;
          height: 19px;
          font-size: 16px;
          font-weight: 500;
          color: #00d075;
          line-height: 19px;
        }
        .decline {
          color: #ff3c00;
        }
      }
      .list-item::before {
        content: '';
        height: 56px;
        width: 2px;
        background: #0058ff;
        position: absolute;
        left: 0;
        top: 0;
        display: none;
      }
      .active {
        background: rgba(0, 88, 255, 0.04);
      }
      .active::before {
        display: block;
      }
    }
  }
  .swap-wrapper {
    width: 48%;
    margin-left: 72px;
    .swap-title {
      font-size: 20px;
      font-weight: 500;
      color: #14171c;
      line-height: 24px;
    }
    .From-wrapper {
      .title-content {
        overflow: hidden;
        margin-bottom: 8px;
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
          width: 80px;
          justify-content: space-between;
          align-items: center;
          line-height: 32px;
          img{
            max-width: 24px;
            max-height: 24px;
          }
          p {
            font-size: 16px;
            font-weight: 500;
            color: #14171c;
          }
          img{
            max-width: 24px;
          }
        }
      }
      .result-wrapper {
        margin-top: 8px;
        font-size: 12px;
        span {
          font-size: 12px;
          font-weight: 500;
          color: #0058ff;
        }
      }
    }
    .notice-wrapper {
      // display: none;
      .notice-content {
        margin: 20px 0;
        display: flex;
        align-items: center;
        padding: 9px 30px;
        width: 412px;
        height: 32px;
        background: rgba(255, 60, 0, 0.1);
        border-radius: 4px;
        img {
          margin-right: 10px;
        }
        p {
          font-size: 12px;
          font-weight: 500;
          color: #ff3c00;
          line-height: 14px;
        }
      }
    }
    .arrow-wrapper {
      position: relative;
      cursor: pointer;
      width:32px;
      height:32px;
      background: #f7f8f9;
      border-radius: 4px;
      margin: 34px auto;
      img {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        max-width: 32px;
      }
    }
    .arrow-active {
      background: #0058ff;
    }

    .details-wrapper {
      .details-items {
        margin-top: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        p {
          font-size: 14px;
          font-weight: 500;
          color: #828489;
          line-height: 16px;
        }
        span {
          font-size: 14px;
          font-weight: 500;
          color: #14171c;
          line-height: 16px;
          margin-left: 8px;
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
  .smallbtn {
    width: 45%;
    display: inline-block;
    margin: 2.5%;
  }
}

.demo-spin-container {
  display: inline-block;
  width: 100%;
  height: 100px;
  position: relative;
}
</style>