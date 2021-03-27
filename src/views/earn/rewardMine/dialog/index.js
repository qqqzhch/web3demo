import { mapState } from 'vuex';
const BigNumber = require('bignumber.js');
BigNumber.config({ DECIMAL_PLACES: 6, ROUNDING_MODE: BigNumber.ROUND_DOWN });
import numeral from 'numeral';
import { debounce } from 'debounce';
import { TokenAmount, Token } from '@webfans/uniswapsdk';
import { useNeedApproveInput } from '@/contacthelp/useNeedApprove.js';
import { useApproveCallback } from '@/contacthelp/useApproveCallback.js';
import { useStakingRewardsContractSigna } from '../../utils/helpUtils/allowances';
import event from '@/common/js/event';
import { getGasPrice } from '@/contacthelp/ethusdt.js';
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
      sendLoading: false,
      fee: ''
    };
  },
  computed: {
    ...mapState(['ethersprovider', 'ethAddress', 'ethChainID', 'web3','chainTokenPrice']),
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
      if (!this.checkData()) {
        return false;
      }
      this.getFee();
      this.isShowPledge = false;
    },
    showPledgeDialog() {
      this.isShowPledge = true;
    },
    open(data) {
      this.data = {};
      this.data = data;
      this.pledgeAmount = '';
      this.isShowPledge = true;
      this.openPledgeDialog = true;
    },
    toExchange() {
      this.$router.push('/exchange');
    },
    percentage(val) {
      const balance = new BigNumber(this.data.data.LPTokenbalance);
      const percent = new BigNumber(val);
      this.pledgeAmount = balance.multipliedBy(percent).decimalPlaces(6).toNumber();
    },

    // 获取手续费
    async getFee() {
      console.log(this.pledgeAmount);
      try {
        const num = this.pledgeAmount.toString();
        const amount = this.web3.utils.toWei(num, 'ether');
        const tokenJson = this.data;
        console.log(tokenJson,num,amount);
        const stakingRewardsContract = useStakingRewardsContractSigna(this.ethersprovider, this.ethAddress, tokenJson);
        const esGas = await stakingRewardsContract.estimateGas.stake(amount);
        const gasPrice = await getGasPrice(this.ethersprovider);
        const bigGasPrice = new BigNumber(gasPrice);
        const bigGas = new BigNumber(esGas.toString());
        const bigchainTokenPrice = new BigNumber(this.chainTokenPrice);
        const fee = bigGas.times(bigchainTokenPrice).times(bigGasPrice).div('1e18');
        console.log({ esGas, gasPrice });
        this.fee = fee.decimalPlaces(6).toNumber();
      } catch (error) {
        console.log(error);
      }

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
        const chainId = this.ethChainID;
        const address = this.data && this.data.data && this.data.data.LPTokenAddress;
        const decimals = this.data && this.data.decimals;
        const symbol = this.data && this.data.symbol;
        const tokenData = new Token(chainId, address, decimals, symbol);

        // 需要将数据转为字符串格式
        const amount = this.pledgeAmount.toString();
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
        // console.log(this.needApprove);
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
        if (result) {
          const wait = await result.response.wait([1]);
          if (wait) {
            this.needApprove = false;
            this.approveLoading = false;
          }
        }
      } catch (error) {
        this.approveLoading = false;
        console.log(error);
      }
    },

    // 检验数据是否合法
    checkData() {
      const balance = this.data && this.data.data.LPTokenbalance;
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
  watch: {
    pledgeAmount() {
      this.checkApprove();
    },
  },
};

