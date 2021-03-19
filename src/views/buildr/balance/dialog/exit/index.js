import ScInput from '../../../components/ScInput.vue';
import { fetchBalanaceChange } from '@/contactLogic/buildr/balance';
import {mapState} from "vuex";
import BigNumber from "bignumber.js";

export default {
  inject: ['reload'],
  data() {
    return {
      step: 1,
      isOpen: false,
      coinAmount: 0,  // 当前抵押资产的数量
      poolData: {},  // 父组件传过来的数据
      unit: 'scUSD'
    };
  },
  components: {
    ScInput
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress']),
    // 可用额度
    unlockedCollateral() {
      return BigNumber(this.poolData.unlockedCollateral).toFixed(6);
    },
    // 铸造额度
    maxMintable() {
      const { maxMintable, targetRatio } = this.poolData;

      // const targetRX = BigNumber(targetRatio).isZero() ? 0 : BigNumber(1).div(targetRatio);
      let currMaxMintable = BigNumber(maxMintable).minus(BigNumber(this.coinAmount).times(targetRatio));
      currMaxMintable = BigNumber(currMaxMintable).lt(0) ? 0 : currMaxMintable;

      return `${BigNumber(maxMintable).toFixed(6)} to ${BigNumber(currMaxMintable).toFixed(6)} ${this.unit}`;
    },
    // 已有债务
    existingDebt() {
      return BigNumber(this.poolData.currentDebt);
    },
    // 抵押率
    collRatio() {
      const { collateralisationRatio, pledgeNumber, currencyPrice } = this.poolData;

      const collRX = BigNumber(collateralisationRatio).isZero() ? 0 : BigNumber(1).div(collateralisationRatio);
      const existingDebt = BigNumber(this.existingDebt).isZero() ? 0 : this.existingDebt;
      return existingDebt
        ? `${BigNumber(collRX).times(100).toFixed(6)}%` +
          `to ${BigNumber(pledgeNumber).minus(this.coinAmount).times(currencyPrice).div(existingDebt).times(100).toFixed(6)}%`
        : `0% to 0%`;
    },
    // 清算价格
    liquidationPrice() {
      const { liquidationRatio, pledgeNumber } = this.poolData;

      const liquRatio = BigNumber(liquidationRatio).isZero() ? 0 : BigNumber(1).div(liquidationRatio);

      const liquPrice = BigNumber(pledgeNumber).isZero() ? 0 : BigNumber(this.existingDebt).times(liquRatio).div(pledgeNumber).toFixed(6);
      const newLiquPrice = BigNumber(pledgeNumber).isZero() && (!BigNumber(pledgeNumber).minus(this.coinAmount))
        ? 0 : BigNumber(this.existingDebt).times(liquRatio).div(BigNumber(pledgeNumber).minus(this.coinAmount)).toFixed(6);

      return `1LAMB = ${liquPrice} USD to ${newLiquPrice} USD`;
    },
    // 验证输入值
    checkValue() {
      if(BigNumber(this.coinAmount).gt(this.unlockedCollateral)) {
        return 'overMaxValue';
      } else if (BigNumber(this.coinAmount).isLessThanOrEqualTo(0)) {
        return 'isZero';
      } else {
        return false;
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
    },
    //确认弹窗返回按钮
    changeStep(){
      this.step = 1;
    },
    onJoinClick () {
      this.isOpen = false;
      this.$parent.openJoinDialog(this.poolData);
    },
    onChangeValue(value) {
      this.coinAmount = (BigNumber(value).isZero() || BigNumber(value).isNaN()) ? 0 : value;
    },
    onNextClick() {
      this.step = 2;
    },
    async onExitClick() {
      this.isOpen = false;
      const params = {
        type: 'exit',
        tokenName: this.poolData.tokenName,
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account:  this.ethAddress,
        web3: this.web3,
        coinAmount: this.coinAmount,
        unit: this.poolData.tokenName,
      };
      const tx = await fetchBalanaceChange(params);
      this.$parent.sendtx(tx);
    }
  },
};
