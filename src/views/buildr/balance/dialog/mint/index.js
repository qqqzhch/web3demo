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
    // 当前额度
    currMaxMintable() {
      return BigNumber(this.poolData.maxMintable).toFixed(6);
    },
    // 已有债务
    existingDebt() {
      return BigNumber(this.poolData.currentDebt);
    },
    // 增加后的债务
    newDebt() {
      return BigNumber(this.existingDebt).plus(this.coinAmount);
    },
    fmtDebt(){
      return `${BigNumber(this.existingDebt).toFixed(6)} to ${BigNumber(this.newDebt).toFixed(6)} scUSD`;
    },
    // 铸造额度
    maxMintable() {
      const { maxMintable } = this.poolData;
      return `${BigNumber(maxMintable).toFixed(6)} to ${BigNumber(maxMintable).minus(this.coinAmount).toFixed(6)} ${this.unit}`;
    },
    // 抵押率
    collRatio() {
      const { collateralisationRatio, pledgeNumber, currencyPrice } = this.poolData;
      const collRatio = BigNumber(collateralisationRatio).isZero() ? 0 : BigNumber(1).div(collateralisationRatio);
      return `${BigNumber(collRatio).times(100).toFixed(6)}% 
              to ${BigNumber(pledgeNumber).times(currencyPrice).div(this.newDebt).times(100).toFixed(6)}%`;
    },
    // 清算价格
    liquidationPrice() {
      const { liquidationRatio, pledgeNumber } = this.poolData;

      const liquRatio = BigNumber(liquidationRatio).isZero() ? 0 : BigNumber(1).div(liquidationRatio);
      const liquPrice = BigNumber(pledgeNumber).isZero() ? 0 : BigNumber(this.existingDebt).times(liquRatio).div(pledgeNumber).toFixed(6);
      const newLiquPrice = BigNumber(pledgeNumber).isZero() ? 0 : BigNumber(this.newDebt).times(liquRatio).div(pledgeNumber).toFixed(6);

      return `1LAMB = ${liquPrice} USD to ${newLiquPrice} USD`;
    },
    // 验证输入值
    checkValue() {
      if(BigNumber(this.coinAmount).gt(this.currMaxMintable) || BigNumber(this.coinAmount).isLessThan(0)) {
        return 'Input value must be less than balance and greater than 0';
      } else if (isNaN(this.coinAmount)) {
        return 'Input value needs to be a value';
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
