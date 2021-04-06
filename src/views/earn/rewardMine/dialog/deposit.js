import { mapState } from 'vuex';
const BigNumber = require('bignumber.js');
BigNumber.config({ DECIMAL_PLACES: 6, ROUNDING_MODE: BigNumber.ROUND_DOWN });
import numeral from 'numeral';
import { useStakingRewardsContractSigna } from '../../utils/helpUtils/allowances';
import event from '@/common/js/event';
import config from '@/config/config.js';
export default {
  components: {
    Buttons: () => import('@/components/basic/buttons'),
  },
  data() {
    return {
      openPledgeDialog: false,
      pledgeAmount: '',
      data: {},
      previousData: '',
      tokenObj: {},
      amountApproveObj: {},
      sendLoading: false,
      balance: 0
    };
  },
  computed: {
    ...mapState(['ethersprovider', 'ethAddress', 'ethChainID', 'web3', 'chainTokenPrice']),
    increaseRate() {
      const inputAmount = new BigNumber(this.pledgeAmount);
      const amountStake = new BigNumber(this.data && this.data.data && this.data.data.totalSupply);
      const rate = inputAmount.div(amountStake.plus(inputAmount)).decimalPlaces(6).toNumber();
      // console.log({rate});
      return numeral(rate).format('0.[0000]%');
    },
  },
  methods: {
    showConfirnDialog() {
      if (!this.checkData()) {
        return false;
      }
      this.getFee();
      this.isShowPledge = false;
    },
    showPledgeDialog() {
      this.isShowPledge = true;
    },

    // 获取scUSD余额
    async getSCUSDBalance() {
      const contractAddress = config.scUSDContractAddress;
      const abi = config.erc20Abi;
      const contract = new this.web3.eth.Contract(abi, contractAddress);
      try {
        const res = await contract.methods
          .balanceOf(this.ethAddress)
          .call();
        let result = new BigNumber(res).div("1e18").decimalPlaces(6).toNumber();
        if (isNaN(result)) {
          result = 0;
        }
        this.balance = result;
      } catch (error) {
        console.log(error);
      }
    },
    open() {
      // this.data = {};
      // this.data = data;
      this.pledgeAmount = '';
      this.getSCUSDBalance();
      this.openPledgeDialog = true;
    },
    percentage(val) {
      const balance = new BigNumber(this.balance);
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
      const balance = this.balance;
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

    // 质押操作
    async confirmSendTx() {
      // if (!this.checkData()) {
      //   return false;
      // }
      this.sendLoading = true;
      const num = this.pledgeAmount.toString();
      const amount = this.web3.utils.toWei(num, 'ether');
      const tokenJson = this.data;
      try {
        const stakingRewardsContract = useStakingRewardsContractSigna(this.ethersprovider, this.ethAddress, tokenJson);
        const esGas = await stakingRewardsContract.estimateGas.stake(amount);
        const result = await stakingRewardsContract.stake(amount, {
          gasLimit: esGas
        });
        const name = this.data && this.data.name;
        this.$Notice.success({
          title: this.$t('notice.n33'),
        });
        event.$emit('sendtx', [
          result,
          {
            okinfo: `${this.$t('common.stake')} ${this.pledgeAmount} ${name} ${this.$t('notice.n42')}`,
            failinfo: `${this.$t('common.stake')} ${this.pledgeAmount} ${name} ${this.$t('notice.n43')}`,
          },
        ]);
      } catch (error) {
        console.log(error);
      } finally {
        this.openPledgeDialog = false;
        this.sendLoading = false;
      }
    },
  },
};

