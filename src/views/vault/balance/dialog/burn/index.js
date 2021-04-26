import { mapState } from "vuex";
import ScInput from '../../../components/ScInput.vue';
import { fetchAdjustBalanace } from '@/contactLogic/buildr/liquity';
import BigNumber from "bignumber.js";
import i18n from '../../../../../i18n/index.js';
import { fetchTokenBalance } from '@/contactLogic/buildr/create';

export default {
  inject: ['reload'],
  data() {
    return {
      step: 1,
      isOpen: false,
      coinAmount: 0,  // 当前抵押资产的数量
      poolData: {},  // 父组件传过来的数据
      BigNumber,
      LAIBalance: 0,  // 账户余额
      btnLoading: false,
    };
  },
  components: {
    ScInput,
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress']),
    // 计算增加的存款额度
    newDebt() {
      return BigNumber(this.poolData.debtAmount).minus(this.coinAmount).toNumber();
    },
    // 新的抵押率
    newCollateralRatio() {
      const { depositAmount } = this.poolData;
      const { collateralRatio } = this.checkValue ? {collateralRatio: 0} : this.$parent.getTroveIndicators(depositAmount, this.newDebt);
      return collateralRatio;
    },
    // 验证输入值
    checkValue() {
      if(BigNumber(this.coinAmount).isLessThan(0)) {
        return i18n.t('notice.swapNotice.n2');
      } else if (isNaN(this.coinAmount)) {
        return i18n.t('notice.buidrNotice.n1');
      } else {
        return this.$parent.validate(this.poolData.depositAmount, this.newDebt);
      }
    }
  },
  methods: {
    getTokenImg(token) {
      return this.$parent.getTokenImg(token);
    },
    // 打开弹窗
    open(poolData) {
      this.poolData = poolData;
      this.isOpen = true;
      this.step = 1;
      this.coinAmount = 0;
      this.getLAIBalance();
    },
    async getLAIBalance() {
      const params = {
        tokenName: 'LAI',
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account:  this.ethAddress,
        web3: this.web3,
      };
      this.LAIBalance = await fetchTokenBalance(params);
    },
    //关闭弹窗
    closeDialog(){
      this.isOpen = false;
      this.coinAmount = 0;
    },
    //确认弹窗返回按钮
    changeStep(){
      this.step = 1;
      this.coinAmount = 0;
    },
    onMintClick() {
      this.isOpen = false;
      this.coinAmount = 0;
      this.$parent.openMintDialog(this.poolData);
    },
    onChangeValue(value) {
      // 销毁的scUSD
      this.coinAmount = value;
    },
    onNextClick() {
      this.step = 2;
    },
    async onBurnClick() {
      const params = {
        type: 'repay',
        liquityState: this.poolData.liquityState,
        tokenName: this.poolData.tokenName,
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account:  this.ethAddress,
        web3: this.web3,
        coinAmount: this.coinAmount,
        unit:this.poolData.stableName,
      };

      this.btnLoading = true;
      try {
        const tx = await fetchAdjustBalanace(params);
        this.$parent.sendtx(tx);
        this.isOpen = false;
      } catch (e) {
        this.btnLoading = false;
      }
    }
  },
};
