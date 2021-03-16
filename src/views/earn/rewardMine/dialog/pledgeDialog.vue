<template>
  <div class="pledge-dialog">
    <Modal v-model="openPledgeDialog" class-name="pledge-modal" :footer-hide="true" :closable="true">
      <div v-if="isShowPledge" class="pledge-content">
        <p class="title text-center">
          Stake {{ data.name }}
        </p>
        <div class="pledge-wrapper">
          <div class="title-content">
            <span class="card-title">Amount</span>
            <div class="balance-item">
              <span class="mr-2 text-secondary">{{ data.name }} Balance</span>
              <span>{{ data.data && data.data.LPTokenbalance }}</span>
            </div>
          </div>
          <div class="pledge-wrapper flex">
            <input
              v-model.number="pledgeAmount"
              type="number"
              class="amount-input"
              @keyup="checkApprove"
              @input="handleInput"
            >
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
        </div>
        <div class="price-warpper">
          <div class="price-item">
            <span>Total staked LP of pool</span>
            <p>{{ data.data && data.data.totalSupply }} {{ data.name }}</p>
          </div>
          <div class="price-item">
            <span>Yield</span>
            <p>{{ data.data && data.data.rewardRate | formatRate }}</p>
          </div>
          <div class="price-item">
            <span>You will stake</span>
            <p>{{ pledgeAmount || 0 }} {{ data.name }}</p>
          </div>
          <div class="price-item">
            <span>share of pool</span>
            <p>
              <span class="sharePool">{{ increaseRate }}</span>
              to {{ totalRate }}
            </p>
          </div>
        </div>

        <div class="btn-warpper">
          <template v-if="needApprove">
            <Buttons v-if="approveLoading" class="dialogBtn">
              loading...
            </Buttons>
            <Buttons v-else class="dialogBtn" @click.native="approveTx">
              Approve
            </Buttons>
          </template>

          <template v-if="!needApprove">
            <Buttons @click.native="showConfirnDialog">
              Next
            </Buttons>
          </template>

          <p class="buy">
            Buy scUSD
          </p>
        </div>
      </div>

      <div v-else>
        <div class="confirmPledge-content">
          <div class="arrow-warpper" @click="showPledgeDialog">
            <img src="../../../../assets/img/arrow-left.svg" alt="arrow-left">
          </div>
          <p class="title text-center">
            Confirm
          </p>
          <div class="confirm-content">
            <div class="images-warpper items-center">
              <img src="../../../../assets/img/comp.svg" width="48" alt="comp">
              <img src="../../../../assets/img/comp.svg" width="48" alt="comp" class="img2">
            </div>
            <h2>{{ pledgeAmount }}</h2>
            <p>{{ data.name }}</p>
            <span>will be staked to mine</span>
          </div>
          <div class="price-warpper">
            <div>
              <span>Asset</span>
              <div>
                <div class="images-warpper">
                  <img src="../../../../assets/img/comp.svg" width="14" alt="comp">
                  <img src="../../../../assets/img/comp.svg" width="14" alt="comp" class="img2">
                </div>
                <p>{{ data.name }}</p>
              </div>
            </div>
            <div>
              <span>share of pool</span>
              <p>{{ increaseRate }}</p>
            </div>
            <div>
              <span>Fee</span>
              <p>0.1 ETH</p>
            </div>
          </div>
          <Buttons @click.native="confirmSendTx">
            Confirm
          </Buttons>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
const BigNumber = require('bignumber.js');
BigNumber.config({ DECIMAL_PLACES: 6, ROUNDING_MODE: BigNumber.ROUND_DOWN });
import numeral from 'numeral';
import { debounce } from 'debounce';
import { TokenAmount, Token } from '@webfans/uniswapsdk';
import { useNeedApproveInput } from '@/contacthelp/useNeedApprove.js';
import { useApproveCallback } from '@/contacthelp/useApproveCallback.js';
import { useStakingRewardsContractSigna } from '../utils/helpUtils/allowances.js';
// import { useTokenApprove } from '@/contacthelp/Approve.js';
export default {
  components: {
    Buttons: () => import('@/components/basic/buttons'),
  },
  data() {
    return {
      openPledgeDialog: false,
      isShowPledge: true,
      pledgeAmount: '',
      data: {},
      needApprove: false,
      approveLoading: false,
      previousData: '',
      tokenObj: {},
      amountApproveObj: {},
    };
  },
  computed: {
    ...mapState(['ethersprovider', 'ethAddress', 'ethChainID', 'web3']),
    increaseRate() {
      const inputAmount = new BigNumber(this.pledgeAmount);
      const amountStake = new BigNumber(this.data && this.data.data && this.data.data.totalSupply);
      const rate = inputAmount.div(amountStake.plus(inputAmount)).decimalPlaces(6).toNumber();
      // console.log({rate});
      return numeral(rate).format('0.[0000]%');
    },
    totalRate() {
      const inputAmount = new BigNumber(this.pledgeAmount);
      const balanceAmount = new BigNumber(this.data && this.data.data && this.data.data.LPTokenbalance);
      const amountStake = new BigNumber(this.data && this.data.data && this.data.data.totalSupply);
      const rate = inputAmount.div(balanceAmount.plus(amountStake).plus(inputAmount)).decimalPlaces(6).toNumber();
      // console.log({rate});
      return numeral(rate).format('0.[0000]%');
    },
  },
  methods: {
    showConfirnDialog() {
      this.isShowPledge = false;
    },
    showPledgeDialog() {
      this.isShowPledge = true;
    },
    open(data) {
      console.log(data);
      this.data = data;
      this.openPledgeDialog = true;
    },
    percentage(val) {
      const balance = new BigNumber(this.data.data.LPTokenbalance);
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

    // 检查授权
    checkApprove: debounce(async function () {
      try {
        const BN = this.web3.utils.BN;
        const chainId = this.ethChainID;
        const address = this.data && this.data.data && this.data.data.LPTokenAddress;
        const decimals = this.data && this.data.decimals;
        const symbol = this.data && this.data.symbol;
        const tokenData = new Token(chainId, address, decimals, symbol);

        // 需要将数据转为web3支持的BN
        const amount = new BN(this.pledgeAmount);
        const amountToApprove = new TokenAmount(tokenData, this.web3.utils.toWei(amount, 'ether'));

        this.tokenObj.dataAddress = this.data && this.data.address;
        this.tokenObj.amountToApprove = amountToApprove;

        // 检查授权
        this.needApprove = await useNeedApproveInput(
          this.ethAddress,
          this.ethersprovider,
          amountToApprove,
          this.tokenObj.dataAddress
        );
        console.log(this.needApprove);
      } catch (error) {
        console.log(error);
      }
    }, 800),

    // 授权操作
    async approveTx() {
      if (!this.checkData()) {
        return false;
      }
      try {
        this.approveLoading = true;
        const result = await useApproveCallback(
          this.ethAddress,
          this.ethersprovider,
          this.tokenObj.amountToApprove,
          this.tokenObj.dataAddress
        );
        const txInfo = await this.getTransaction(result.hash);

        if (txInfo.status === false) {
          this.approveLoading = false;
          throw new Error('发送交易失败');
        } else {
          const timer = setTimeout(() => {
            this.approveLoading = false;
            this.needApprove = false;
            clearTimeout(timer);
          }, 1000);
        }
      } catch (error) {
        this.approveLoading = false;
        console.log(error);
      }
    },

    // 检验数据是否合法
    checkData() {
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

      return true;
    },

    getTx(hash) {
      return new Promise((resolve, reject) => {
        this.web3.eth.getTransactionReceipt(hash, (error, data) => {
          if (error) {
            reject(error);
          }
          resolve(data);
        });
      });
    },

    getTransaction(hash) {
      let timeid;
      return new Promise((resolve) => {
        timeid = setInterval(async () => {
          const data = await this.getTx(hash);
          if (data && data.blockNumber !== null) {
            clearInterval(timeid);
            resolve(data);
          }
        }, 1000 * 10);
      });
    },

    async confirmSendTx() {
      if (!this.checkData()) {
        return false;
      }
      this.sendLoading = true;
      const BN = this.web3.utils.BN;
      const num = new BN(this.pledgeAmount);
      const amount = this.web3.utils.toWei(num, 'ether');
      console.log(amount);
      const tokenJson = this.data;
      console.log(tokenJson);
      try {
        const stakingRewardsContract = useStakingRewardsContractSigna(this.ethersprovider, this.ethAddress, tokenJson);
        const result = await stakingRewardsContract.stake(amount, { gasLimit: 350000 });
        console.log('返回结果', result);
        const txInfo = await this.getTransaction(result.hash);
        console.log(txInfo);
        if (txInfo.status === false) {
          // console.log('status', txInfo);
          this.$Notice.error({
            title:this.$t('notice.n32'),
          });
        } else {
          this.$Notice.success({
            title: this.$t('notice.n33'),
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
  watch: {
    pledgeAmount() {
      this.checkApprove();
    },
  },
};
</script>

<style lang="less" scoped>
.pledge-modal {
  width: 500px;
  height: 573px;
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  .pledge-content {
    padding: 14px 28px;
    .title {
      height: 28px;
      font-size: 24px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #14171c;
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
          font-weight: 500;
          line-height: 14px;
        }
      }
      .pledge-wrapper {
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
    }
    .price-warpper {
      margin-top: 30px;
      .price-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .sharePool {
          color: #00d075;
        }
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

  .confirmPledge-content {
    padding: 16px 28px;
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
      margin-bottom: 40px;
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
      margin-top: 56px;
      div {
        display: flex;
        justify-content: space-between;
        .images-warpper {
          width: 22px;
          height: 14px;
          position: relative;
          margin-right: 8px;
          img {
            position: absolute;
            left: 0;
            top: 0;
          }
          .img2 {
            left: 6px;
            top: 0;
            z-index: 3;
          }
        }
      }

      span {
        height: 14px;
        font-size: 14px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #828489;
        line-height: 16px;
      }
      p {
        height: 14px;
        font-size: 14px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #14171c;
        line-height: 16px;
        margin-bottom: 16px;
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