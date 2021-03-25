<template>
  <div class="remove-dialog">
    <Modal v-model="openRemoveDialog" class-name="remove-modal" :footer-hide="true" :closable="true">
      <div v-if="isShowRemove" class="remove-content">
        <p class="title text-center">
          {{ $t('swapHistory.removeDialog.title') }}
        </p>
        <div class="remove-wrapper">
          <div class="title-content">
            <span class="card-title">{{ $t('swapHistory.removeDialog.amount') }}</span>
            <div v-if="tokenA && tokenB" class="balance-item">
              <span class="mr-2 text-secondary">{{ tokenB.symbol }}/{{ tokenA.symbol }} LP Balance</span>
              <span>{{ balance | formatNormalValue }}</span>
            </div>
          </div>
          <div class="input-wrapper flex">
            <input v-model="Amount" type="text" class="amount-input" @keyup="numchange">
          </div>

          <div v-if="inputnoticeA" class="notice-warpper">
            <div class="notice-content">
              <img src="../../../assets/img/notice-red.png">
              <p>{{ inputnoticeA }}</p>
            </div>
          </div>
        </div>
        <div class="percentage">
          <div @click="percentage(0.25)">
            25%
          </div>
          <div @click="percentage(0.5)">
            50%
          </div>
          <div @click="percentage(0.75)">
            75%
          </div>
          <div @click="percentage(1)">
            MAX
          </div>
        </div>
        <div v-if="tokenA && tokenB" class="price-warpper">
          <div>
            <span>{{ $t('swapHistory.confirmDialog.willReceive') }} {{ tokenA.symbol }}</span>
            <p>{{ AmountA }} {{ tokenA.symbol }}</p>
          </div>
          <div>
            <span>{{ $t('swapHistory.confirmDialog.willReceive') }} {{ tokenB.symbol }}</span>
            <p>{{ AmountB }} {{ tokenB.symbol }}</p>
          </div>
          <div>
            <span>{{ $t('swapHistory.confirmDialog.Price') }}</span>
            <div class="price">
              <p>{{ price }} {{ tokenB.symbol }} = 1{{ tokenA.symbol }}</p>
              <p>1 {{ tokenB.symbol }} = {{ priceinvert }} {{ tokenA.symbol }}</p>
            </div>
          </div>
        </div>

        <div v-if="btnLoading">
          <Buttons>{{ $t('swapHistory.confirmDialog.loading') }}...</Buttons>
        </div>
        <div v-else @click="showConfirmRemove">
          <Buttons>{{ $t('swapHistory.removeDialog.button') }}</Buttons>
        </div>
      </div>

      <div v-else class="removeConfirm-content">
        <div class="arrow-warpper" @click="showRemove">
          <img src="../../../assets/img/arrow-left.svg" alt="arrow-left">
        </div>
        <p class="title text-center">
          {{ $t('swapHistory.confirmDialog.titleConfirm') }}
        </p>
        <p class="will-receive">
          {{ $t('swapHistory.confirmDialog.willReceive') }}
        </p>
        <div class="token-swap flex items-center justify-between">
          <div class="token-item">
            <img :src="getTokenImg(tokenA.symbol)" width="48" alt="copm">
            <p>{{ AmountA }}</p>
            <span>{{ tokenA.symbol }}</span>
          </div>
          <div class="add-warpper">
            <img src="../../../assets/img/add.svg" alt="add">
          </div>
          <div class="token-item">
            <img :src="getTokenImg(tokenB.symbol)" width="48" alt="copm">
            <p>{{ AmountB }}</p>
            <span>{{ tokenB.symbol }}</span>
          </div>
        </div>
        <div v-if="btnLoading" class="demo-spin-container">
          <loading />
        </div>
        <div v-else>
          <div v-if="tokenA && tokenB" class="price-warpper">
            <div>
              <span>{{ $t('swapHistory.confirmDialog.Price') }}</span>
              <div class="price">
                <p>{{ price }} {{ tokenA.symbol }} = 1USDT</p>
                <p>1 {{ tokenB.symbol }} = {{ priceinvert }} {{ tokenA.symbol }}</p>
              </div>
            </div>
            <div class="items-center">
              <span>{{ $t('swapHistory.confirmDialog.share') }}</span>
              <div class="sharePoll">
                <span>-{{ Reduceliquidit | formatRate }}</span>
                <p>to {{ Residualliquidity | formatRate }}</p>
              </div>
            </div>
            <div>
              <span>{{ $t('swapHistory.confirmDialog.fee') }}</span>
              <p>
                {{ fee | formatBalanceNumber }} {{ chainTokenName }}≈${{
                  (chainTokenPrice * fee) | formatBalanceNumber
                }}
              </p>
            </div>
          </div>
          <Buttons @click.native="RemoveConfirm">
            {{ $t('swapHistory.confirmDialog.titleConfirm') }}
          </Buttons>
          <div />
        </div>
      </div>
    </Modal>

    <haveSendDialog ref="haveSendtx" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getTokenImg } from '@/contactLogic/readbalance.js';

import Web3 from 'web3';

import {  TokenAmount} from '@webfans/uniswapsdk';

const debounce = require('debounce');

// import { useTokenApprove } from '@/contacthelp/Approve.js';

// import { ROUTER_ADDRESS } from '@/constants/index.js';

import event from '@/common/js/event';
const BigNumber = require('bignumber.js');
BigNumber.config({ DECIMAL_PLACES: 6, ROUNDING_MODE: BigNumber.ROUND_DOWN });

import { readpariInfoNuminfo } from '@/contactLogic/readpairpool.js';
import {
  localApprove,
  buildremoveparameter,
  removeliquidityGas,
  sendremoveliquidity,
} from '@/contactLogic/removeLiquidity.js';

let pariInfo;

export default {
  components: {
    Buttons: () => import('@/components/basic/buttons'),
    haveSendDialog: () => import('@/components/basic/haveSendDialog.vue'),
    loading: () => import('@/components/basic/loading.vue'),
  },
  data() {
    return {
      openRemoveDialog: false,
      balance: '',
      Amount: '',
      isShowRemove: true,
      removeAmount: '',
      tokenB: null,
      tokenA: null,
      liquidityToken: null,
      tokenAAmountWei: '',
      tokenBAmountWei: '',
      AmountA: '--',
      AmountB: '--',
      SignatureData: '',
      price: '',
      priceinvert: '',
      btnLoading: false,
      fee: '',
      parameter: [],
      totalSupply: '',
      inputnoticeA: '',
    };
  },
  methods: {
    clearData() {
      this.$data.Amount = '';
      this.$data.parameter = [];
      this.$data.SignatureData = '';
      this.$data.AmountA = '--';
      this.$data.AmountB = '--';
      this.$data.inputnoticeA = '';
    },
    inputcheckupA() {
      try {
        this.$data.inputnoticeA = '';
        const num = parseFloat(this.$data.Amount);
        if (isNaN(num)) {
          this.$data.inputnoticeA = this.$t('notice.swapNotice.n1');
          return false;
        }
        const inamount = new BigNumber(this.$data.Amount);
        if (inamount.isGreaterThan(this.balance) || inamount.isLessThanOrEqualTo('0')) {
          this.$data.inputnoticeA = this.$t('notice.swapNotice.n2');
          return false;
        }
      } catch (error) {
        console.log(error);
        this.$data.inputnoticeA = this.$t('notice.swapNotice.n1');
      }
    },
    getTokenImg(tokensymbol) {
      const chainID = this.ethChainID;
      return getTokenImg(tokensymbol, chainID);
    },
    async open(pairs) {
      const chainID = this.ethChainID;
      const library = this.ethersprovider;
      const account = this.ethAddress;

      this.clearData();

      this.openRemoveDialog = true;
      this.$data.btnLoading = true;
      this.$data.isShowRemove = true;

      console.log('open');

      this.$data.tokenA = pairs.Pair.tokenAmounts[0].token;
      this.$data.tokenB = pairs.Pair.tokenAmounts[1].token;

      const dataPrise = await readpariInfoNuminfo(
        chainID,
        library,
        account,
        this.$data.tokenA.symbol,
        this.$data.tokenB.symbol
      );

      this.$data.balance = Web3.utils.fromWei(dataPrise.balance.toString(), 'ether');
      this.$data.balanceWei = dataPrise.balance.toString();
      this.$data.liquidityToken = dataPrise.pairInfo.liquidityToken;

      this.$data.tokenAAmountWei = dataPrise.aTokenbalance.raw.toString();
      this.$data.tokenBAmountWei = dataPrise.bTokenbalance.raw.toString();

      pariInfo = dataPrise.pairInfo;

      this.$data.price = dataPrise.price.toSignificant(6);
      this.$data.priceinvert = dataPrise.priceinvert.toSignificant(6);
      this.$data.totalSupply = dataPrise.totalSupply.toString();

      console.log(dataPrise);
      this.$data.btnLoading = false;
    },
    percentage(i, cus) {
      if (this.$data.btnLoading == true) {
        return;
      }

      if (cus == undefined) {
        this.Amount = new BigNumber(this.$data.balanceWei).div(1e18).times(i).toFixed(6);
      }

      this.AmountA = new BigNumber(this.$data.tokenAAmountWei).div(1e18).times(i).toFixed(6);
      this.AmountB = new BigNumber(this.$data.tokenBAmountWei).div(1e18).times(i).toFixed(6);

      // this.Amount = new  BigNumber(this.balance * i).toFixed(6) ;
    },
    showRemove() {
      this.isShowRemove = true;
    },
    async showConfirmRemove() {
      const chainID = this.ethChainID;
      const library = this.ethersprovider;
      const account = this.ethAddress;

      const num = this.$data.Amount;
      const numA = this.$data.AmountA;
      const numB = this.$data.AmountB;

      if (this.inputcheckupA() == false) {
        return;
      }

      this.$data.btnLoading = true;

      const ToRemoveAmount = new TokenAmount(this.$data.liquidityToken, Web3.utils.toWei(num, 'ether'));

      try {
        const SignatureData = await localApprove(library, chainID, account, pariInfo, ToRemoveAmount);

        this.$data.SignatureData = SignatureData;

        const chainId = chainID;
        const pair = pariInfo;
        const signatureData = SignatureData;

        const currencyAmountA = new TokenAmount(this.$data.tokenA, Web3.utils.toWei(numA, 'ether'));

        const currencyAmountB = new TokenAmount(this.$data.tokenB, Web3.utils.toWei(numB, 'ether'));

        const parameter = await buildremoveparameter({
          library,
          chainId,
          account,
          pair,
          signatureData,
          ToRemoveAmount,
          currencyAmountA,
          currencyAmountB,
        });

        console.log(parameter);
        this.$data.parameter = parameter;
        const fee = await removeliquidityGas(chainID, library, account, parameter);

        this.$data.fee = fee;

        this.isShowRemove = false;
      } catch (error) {
        console.log(error);
      }

      this.$data.btnLoading = false;
    },
    async RemoveConfirm() {
      const chainID = this.ethChainID;
      const library = this.ethersprovider;
      const account = this.ethAddress;
      const parameters = this.$data.parameter;

      try {
        this.$data.btnLoading = true;

        const tx = await sendremoveliquidity(chainID, library, account, parameters);
        const baseTip = `remove ${this.$data.Amount} ${this.$data.tokenA.symbol}/${this.$data.tokenB.symbol} LP `;

        this.$refs.haveSendtx.open(baseTip);
        this.openRemoveDialog = false;

        event.$emit('sendtx', [
          tx,
          {
            okinfo: baseTip + 'success',
            failinfo: baseTip + 'fail',
          },
        ]);
      } catch (error) {
        console.log(error);
        this.$Notice.error({
          title: this.$t('notice.swapNotice.n3'),
        });
      }

      this.$data.btnLoading = false;
    },
    numchange: debounce(function () {
      if (this.inputcheckupA() == false) {
        return;
      }

      const num = this.$data.Amount;
      const result = this.$data.Amount / this.$data.balance;

      this.percentage(result, true);
    }, 1000),
  },
  computed: {
    ...mapState(['ethChainID', 'ethAddress', 'web3', 'ethersprovider', 'chainTokenPrice', 'chainTokenName']),
    Reduceliquidit() {
      const num = new BigNumber(this.$data.Amount).times(1e18).div(this.$data.totalSupply).toFixed(6);
      return num;
    },
    Residualliquidity() {
      const b1 = new BigNumber(Web3.utils.toWei(this.$data.balance));
      const a1 = new BigNumber(Web3.utils.toWei(this.$data.Amount));
      const s1 = new BigNumber(this.$data.totalSupply);

      const num = b1.minus(a1).div(s1.minus(a1)).toFixed(6);
      return num;
    },
  },
  watch: {
    balance: function () {
      if (this.$data.Amount != '') {
        this.numchange();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.remove-modal {
  width: 500px;
  height: 573px;
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  .remove-content {
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
    .remove-wrapper {
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
    .percentage {
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      div {
        cursor: pointer;
        width: 23%;
        height: 36px;
        border-radius: 6px;
        border: 1px solid rgba(0, 0, 0, 0.06);
        font-size: 14px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #828489;
        line-height: 36px;
        text-align: center;
      }
      :hover {
        border-color: #0058ff;
        color: #0058ff;
      }
    }
    .price-warpper {
      margin-top: 30px;
      div {
        display: flex;
        justify-content: space-between;
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
      margin-top: 16px;
      height: 48px;
    }
  }

  .removeConfirm-content {
    padding: 0 44px 20px;
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
    .token-swap {
      padding: 0 50px 18px;
      .token-item {
        display: flex;
        align-items: center;
        flex-direction: column;
        p {
          height: 28px;
          font-size: 24px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #14171c;
          line-height: 28px;
          margin: 8px 0 4px;
        }
        span {
          font-size: 14px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #14171c;
          line-height: 16px;
        }
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
            color: #ff3c00;
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