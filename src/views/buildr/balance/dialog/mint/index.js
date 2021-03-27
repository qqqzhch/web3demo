import { mapState } from "vuex";
import ScInput from '../../../components/ScInput.vue';
import { fetchBalanaceChange } from '@/contactLogic/buildr/balance';
import BigNumber from "bignumber.js";

export default {
  data() {
    return {
      step: 1,
      isOpen: false,
      coinAmount: 0,  // 当前抵押资产的数量
      poolData: {},  // 父组件传过来的数据
      unit: 'scUSD',
      BigNumber,
    };
  },
  components: {
    ScInput
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress']),
    feeRate() { // 稳定费率
      return `${BigNumber(this.poolData.feeRate).times(100)}%`;
    },
    // 已有债务
    existingDebt() {
      return BigNumber(this.poolData.currentDebt);
    },
    // 增加后的债务
    newDebt() {
      return BigNumber(this.existingDebt).plus(this.coinAmount);
    },
    // 当前额度
    maxMintable() {
      return BigNumber(this.poolData.maxMintable);
    },
    // 铸造额度
    currMaxMintable() {
      const { maxMintable } = this.poolData;
      return BigNumber(maxMintable).minus(this.coinAmount);
    },
    // 抵押率
    newCollRX() {
      const { pledgeNumber, currencyPrice } = this.poolData;
      return BigNumber(pledgeNumber).times(currencyPrice).div(this.newDebt);
    },
    // 初始清算价格
    liquidationPrice() {
      const { liquidationRX, pledgeNumber } = this.poolData;
      const liquPrice = BigNumber(pledgeNumber).isZero() ? 0 : BigNumber(this.existingDebt).times(liquidationRX).div(pledgeNumber).toFixed(6);

      return liquPrice;
    },
    // 变化后的清算价格
    newLiquidationPrice() {
      const { liquidationRX, pledgeNumber } = this.poolData;
      const newLiquPrice = BigNumber(pledgeNumber).isZero() ? 0 : BigNumber(this.newDebt).times(liquidationRX).div(pledgeNumber).toFixed(6);
      return newLiquPrice;
    },
    // 验证输入值
    checkValue() {
      if(BigNumber(this.coinAmount).gt(this.maxMintable) || BigNumber(this.coinAmount).isLessThan(0)) {
        return this.$t('notice.swapNotice.n2');
      } else if (isNaN(this.coinAmount)) {
        return this.$t('buidrNotice.n1');
      } else {
        return 'ok';
      }
    }
  },
  methods: {
    getTokenImg(token) {
      return this.$parent.getTokenImg(token);
    },
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
      this.isOpen = false;
      const params = {
        type: 'mint',
        tokenName: this.poolData.tokenName,
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account:  this.ethAddress,
        web3: this.web3,
        coinAmount: this.coinAmount,
        unit: this.unit,
      };

      const tx = await fetchBalanaceChange(params);
      this.$parent.sendtx(tx);
    }
  },
};
