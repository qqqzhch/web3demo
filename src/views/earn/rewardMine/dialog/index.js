import { mapState } from 'vuex';
const BigNumber = require('bignumber.js');
BigNumber.config({ DECIMAL_PLACES: 6, ROUNDING_MODE: BigNumber.ROUND_DOWN });
import numeral from 'numeral';
import { debounce } from 'debounce';
import { TokenAmount, Token } from '@webfans/uniswapsdk';
import { useNeedApproveInput } from '@/contacthelp/useNeedApprove.js';
import { useApproveCallback } from '@/contacthelp/useApproveCallback.js';
import { useStakingRewardsContractSigna } from '../../utils/helpUtils/allowances';
import getTx from '../../utils/getTx';
export default {
  mixins: [getTx],
  inject: ['reload'],
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
      sendLoading: false
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

    // 质押操作
    async confirmSendTx() {
      if (!this.checkData()) {
        return false;
      }
      this.sendLoading = true;
      const num = this.pledgeAmount.toString();
      const amount = this.web3.utils.toWei(num, 'ether');
      const tokenJson = this.data;
      try {
        const stakingRewardsContract = useStakingRewardsContractSigna(this.ethersprovider, this.ethAddress, tokenJson);
        const result = await stakingRewardsContract.stake(amount, { gasLimit: 350000 });
        console.log('返回结果', result);
        const txInfo = await this.getTransaction(result.hash);
        console.log(txInfo);
        if (txInfo.status === false) {
          // console.log('status', txInfo);
          this.$Notice.error({
            title: this.$t('notice.n32'),
          });
        } else {
          this.reload();
          this.$Notice.success({
            title: this.$t('notice.n33'),
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
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

