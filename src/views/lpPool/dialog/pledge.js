import { mapState } from 'vuex';
import { debounce } from 'debounce';
import { TokenAmount, Token } from '@webfans/uniswapsdk';
import { useNeedApproveInput } from '@/contacthelp/useNeedApprove.js';
import { useApproveCallback } from '@/contacthelp/useApproveCallback.js';
import { useStakingRewardsContractSigna } from '@/contactLogic/earn/lpPool/allowances.js';
import event from '@/common/js/event';
export default {
  components: {
    Buttons: () => import('@/components/basic/buttons'),
  },
  data() {
    return {
      openPledgeDialog: false,
      pledgeAmount: '',
      data: {},
      needApprove: false,
      approveLoading: false,
      previousData: '',
      tokenObj: {},
      amountApproveObj: {},
      sendLoading: false,
      fee: '',
      coinName: ''
    };
  },
  computed: {
    ...mapState(['ethersprovider', 'ethAddress', 'ethChainID', 'web3','chainTokenPrice','LAI','BNB','BABEL']),
  },
  methods: {
    open(data) {
      console.log(data);
      this.data = {};
      this.data = data;
      this.pledgeAmount = '';
      this.coinName = data && data.name;
      this.openPledgeDialog = true;
    },

    percentage(val) {
      console.log('--');
      const balance = this.$BigNumber(this.data.data.LPTokenbalance);
      const percent = this.$BigNumber(val);
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
      const bigBalance = this.$BigNumber(balance);
      const amount = this.$BigNumber(this.pledgeAmount);
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
      if (!this.checkData()) {
        return false;
      }
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
        event.$emit('sendSuccess');
        this.openPledgeDialog = false;
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
