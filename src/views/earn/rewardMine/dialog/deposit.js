import { mapState } from 'vuex';
const BigNumber = require('bignumber.js');
BigNumber.config({ DECIMAL_PLACES: 6, ROUNDING_MODE: BigNumber.ROUND_DOWN });
import numeral from 'numeral';
import event from '@/common/js/event';
import config from '@/config/config.js';
import { getSCUSDVaultContract } from '@/contactLogic/earn/scusdDeposit.js';
import Web3 from 'web3';
import token from '@/constants/token.json';
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
    // 存入scUSD
    async depositScusd() {
      if (!this.checkData()) {
        return false;
      }
      this.sendLoading = true;
      try {
        const chainID = this.ethChainID;
        const account = this.ethAddress;
        const library = this.ethersprovider;
        const Contract = getSCUSDVaultContract({ chainID, account, library });
        const amount = Web3.utils.toWei(this.pledgeAmount.toString());
        const esGas = await Contract.estimateGas.stake(amount);
        const tx = await Contract.stake(amount, {
          gasLimit: esGas
        });
        if (tx.hash) {
          event.$emit('sendSuccess');
          this.openPledgeDialog = false;
          event.$emit('sendtx', [
            tx,
            {
              okinfo: `存入 ${this.pledgeAmount} scUSD ${this.$t('notice.n42')}`,
              failinfo: `存入 ${this.pledgeAmount} scUSD ${this.$t('notice.n43')}`,
            },
          ]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.openPledgeDialog = false;
        this.sendLoading = false;
      }
    },

    // 获取scUSD余额
    async getSCUSDBalance() {
      const [scUSDItem] = token.tokens.filter(item => item.name === 'SuperCash scUSD' && item.chainId === this.ethChainID);
      const contractAddress = scUSDItem.address;
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

  },
};

