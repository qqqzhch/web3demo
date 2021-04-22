import { mapState, mapActions } from "vuex";
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
    };
  },
  components: {
    ScInput
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress']),
    // 计算Fee
    debtFee() {
      const feeRate = this.poolData.borrowingRate ? this.poolData.borrowingRate : 0;
      return BigNumber(this.coinAmount).times(feeRate);
    },
    // 计算增加的存款额度
    newDebt() {
      return BigNumber(this.poolData.debtAmount).plus(this.coinAmount).plus(this.debtFee).toNumber();
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
    ...mapActions('buildr', ['setCurrentPool']),
    getTokenImg(token) {
      return this.$parent.getTokenImg(token);
    },
    open(poolData) {
      this.poolData = poolData;
      this.isOpen = true;
      this.step = 1;
    },
    //关闭弹窗,去掉首次引导
    closeDialog(){
      this.isOpen = false;
      this.coinAmount = 0;
      this.setCurrentPool({});
    },
    //确认弹窗返回按钮
    changeStep(){
      this.step = 1;
      this.coinAmount = 0;
    },
    onBurnClick() {
      this.isOpen = false;
      this.coinAmount = 0;
      this.$parent.openBurnDialog(this.poolData);
    },
    onChangeValue(value) {
      this.coinAmount = value;
    },
    onNextClick() {
      this.step = 2;
    },
    async onMintClick() {
      this.setCurrentPool({});
      const params = {
        type: 'borrow',
        liquityState: this.poolData.liquityState,
        tokenName: this.poolData.tokenName,
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account:  this.ethAddress,
        web3: this.web3,
        coinAmount: this.coinAmount,
        unit:this.poolData.stableName,
      };

      const tx = await fetchAdjustBalanace(params);
      this.$parent.sendtx(tx);
      this.isOpen = false;
    }
  },
};
