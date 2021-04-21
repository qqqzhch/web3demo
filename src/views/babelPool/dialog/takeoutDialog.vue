<template>
  <div class="pledge-dialog">
    <Modal v-model="openPledgeDialog" class-name="pledge-modal" :transfer="false" :footer-hide="true" :closable="true">
      <div class="pledge-content">
        <p class="title text-center">
          取出
        </p>
        <div class="pledge-wrapper">
          <div class="title-content">
            <span class="card-title">{{ $t('earn.dialog.stakeDialog.amount') }}</span>
            <div class="balance-item">
              <span class="mr-2 text-secondary">{{ $t('earn.dialog.stakeDialog.balance') }}</span>
              <span>{{ stakedLQTY }} Babel</span>
            </div>
          </div>
          <div class="pledge-wrapper flex">
            <input v-model.number="pledgeAmount" type="number" class="amount-input" @input="handleInput">
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
              {{ $t('earn.dialog.stakeDialog.max') }}
            </div>
          </div>
        </div>
        <div class="price-wrapper">
          <div class="price-item flex justify-between items-center">
            <span>你将取出</span>
            <p>{{ pledgeAmount || 0 }}</p>
          </div>
        </div>

        <div class="btn-wrapper">
          <Buttons v-if="sendLoading === false" height="48px" @click.native="extract">
            {{ $t('earn.dialog.stakeDialog.confirm') }}
          </Buttons>
          <Buttons v-else height="48px">
            {{ $t('earn.dialog.loading') }}
          </Buttons>
        </div>
      </div>
    </Modal>
    <haveSendDialog ref="haveSendtx" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
const BigNumber = require('bignumber.js');
BigNumber.config({ DECIMAL_PLACES: 6, ROUNDING_MODE: BigNumber.ROUND_DOWN });

import initLiquity from '@/common/mixin/initLiquity';
const { EthersLiquity,  _connectByChainId } = require("@webfans/lib-ethers");
import { AddressZero } from "@ethersproject/constants";
import event from '@/common/js/event';


export default {
  components: {
    Buttons: () => import('@/components/basic/buttons'),
    haveSendDialog: () => import('@/components/basic/haveSendDialog.vue'),
  },
  data() {
    return {
      openPledgeDialog: false,
      pledgeAmount: '',
      data: {},
      previousData: '',
      sendLoading: false,
      balance: 0,
    };
  },
  computed: {
    ...mapState(['ethersprovider', 'ethAddress', 'ethChainID', 'web3', 'chainTokenPrice']),
    ...mapState('buildr', ['liquityState']),
    ...mapState('pool', ['liquity']),
    stakedLQTY:function(){
      return this.liquityState&&this.liquityState.lqtyStake&&this.liquityState.lqtyStake.stakedLQTY.shorten();
    }
  },
  methods: {
    open() {
      this.pledgeAmount = '';
      this.openPledgeDialog = true;
    },

    percentage(val) {
      const stakedLQTY = this.liquityState&&this.liquityState.lqtyStake&&this.liquityState.lqtyStake.stakedLQTY;
      if(stakedLQTY== undefined){
        return ;
      }
      const balance = new BigNumber(stakedLQTY.toString());
      const percent = new BigNumber(val);

      this.pledgeAmount = balance.multipliedBy(percent).decimalPlaces(6).toNumber();

    },

    // 限制Input输入小数点的长度
    handleInput(e) {
      const stringValue = e.target.value.toString();
      const regex = /^\d*(\.\d{1,6})?$/;
      if (!stringValue.match(regex) && this.pledgeAmount !== '') {
        this.pledgeAmount = this.previousData;
      }
      this.previousData = this.pledgeAmount;
    },

    // 检验数据是否合法
    checkData() {
      const stakedLQTY = this.liquityState&&this.liquityState.lqtyStake&&this.liquityState.lqtyStake.stakedLQTY;
      if(stakedLQTY== undefined){
        return false;
      }
      const balance = new BigNumber(stakedLQTY.toString());
      const bigBalance = new BigNumber(balance);
      const amount = new BigNumber(this.pledgeAmount);
      if (this.pledgeAmount === '') {
        this.$Notice.warning({
          title: this.$t('notice.n'),
          desc: this.$t('notice.n30'),
        });
        return false;
      }
      if (parseFloat(this.pledgeAmount) <= 0) {
        this.$Notice.warning({
          title: this.$t('notice.n'),
          desc: this.$t('notice.n31'),
        });
        return false;
      }
      // console.log(amount.toNumber(),bigBalance.toNumber(),amount.isGreaterThan(bigBalance));
      if (amount.isGreaterThan(bigBalance)) {
        this.$Notice.warning({
          title: this.$t('notice.n'),
          desc: this.$t('notice.n29'),
        });
        return false;
      }

      return true;
    },
    async extract(){
      if(this.checkData()==false){
        return ;
      }
      console.log(this.$data);
      // const provider = this.ethersprovider;
      // const account = this.ethAddress;
      // const chainId = this.ethChainID ;
      //  const connection =  _connectByChainId(provider, provider.getSigner(account), chainId, {
      //     userAddress: account,
      //     frontendTag: AddressZero,
      //     useStore: "blockPolled"
      //   });
      //   console.log(connection);
      // const liquity = EthersLiquity._from(connection);
       try {
         const transaction = await  this.liquity.send.unstakeLQTY(this.pledgeAmount,{gasLimit:800000});
      console.log(transaction);
      const baseTip = `unstake ${this.pledgeAmount} Babel`;
        this.$refs.haveSendtx.open(baseTip);
        event.$emit('sendtx', [
          transaction.rawSentTransaction,
          {
            okinfo: baseTip +this.$t('swapConfirm.success'),
            failinfo: baseTip + this.$t('swapConfirm.fail'),
          },
        ]);
          this.openPledgeDialog = false;
       } catch (error) {
           this.$Notice.error({
          title: this.$t('notice.swapNotice.n3'),
        });
         
       }
      


    }
  },
};
</script>

<style lang="less" scoped>
.pledge-modal {
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  .pledge-content {
    .title {
      font-size: 24px;
      line-height: 28px;
      margin-bottom: 24px;
    }
    .pledge-wrapper {
      .title-content {
        overflow: hidden;
        margin: 24px 0 8px;
        span {
          float: left;
        }
        .balance-item {
          float: right;
          font-size: 12px;
          line-height: 14px;
        }
      }
      .pledge-wrapper {
        width: 100%;
        height: 72px;
        background: #f7f8f9;
        border-radius: 6px;
        position: relative;
        .amount-input-error {
          &:focus {
            border: 1px solid #ff3c00;
            border-radius: 4px;
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
          color: #828489;
          line-height: 36px;
          text-align: center;
        }
        :hover {
          border-color: #0058ff;
          color: #0058ff;
        }
      }
    }
    .price-wrapper {
      margin-top: 30px;
      span {
        font-size: 12px;
        color: #828489;
        line-height: 14px;
      }
      p {
        font-size: 12px;
        color: #14171c;
        line-height: 14px;
        margin-bottom: 8px;
      }
    }
    .btn-wrapper {
      margin-top: 16px;
    }
  }
}
</style>
