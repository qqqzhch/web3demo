import { mapState } from "vuex";
import ScInput from '../../../components/ScInput.vue';
import { fetchAdjustBalanace } from '@/contactLogic/buildr/liquity';
import BigNumber from "bignumber.js";
import i18n from '../../../../../i18n/index.js';

export default {
  data() {
    return {
      step: 1,
      isOpen: false,
      coinAmount: 0,  // 当前抵押资产的数量
      poolData: {},  // 父组件传过来的数据
      BigNumber,
      loading: false,
      errorInfo: '',
    };
  },
  components: {
    ScInput
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress']),
    // 计算增加的存款额度
    newDeposit() {
      return BigNumber(this.poolData.depositAmount).plus(this.coinAmount).toNumber();
    },
    // 新的抵押率
    newCollateralRatio() {
      const { debtAmount } = this.poolData;
      const { collateralRatio } = this.checkValue ? {collateralRatio: 0} : this.$parent.getTroveIndicators(this.newDeposit, debtAmount);
      return collateralRatio;
    },
    // 验证输入值
    checkValue() {
      if (isNaN(Number(this.coinAmount))) {
        return i18n.t('notice.buidrNotice.n1');
      } else if(BigNumber(this.coinAmount).isLessThan(0)) {
        return i18n.t('notice.swapNotice.n2');
      } else {
        return this.$parent.validate(this.newDeposit, this.poolData.debtAmount);
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
    onExitClick() {
      this.isOpen = false;
      this.coinAmount = 0;
      this.$parent.openExitDialog(this.poolData);
    },
    onChangeValue(value) {
      this.coinAmount = value;
    },
    onNextClick() {
      this.step = 2;
    },
    async onJoinClick() {
      const params = {
        type: 'deposit',
        liquityState: this.poolData.liquityState,
        tokenName: this.poolData.tokenName,
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account:  this.ethAddress,
        web3: this.web3,
        coinAmount: this.coinAmount,
        unit: this.poolData.tokenName,
      };
      const tx = await fetchAdjustBalanace(params);
      this.$parent.sendtx(tx);
      this.isOpen = false;
    }
  },
};
