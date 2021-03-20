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
      unit: 'scUSD',
      BigNumber,
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
    currMaxMintable() {
      const { maxMintable, targetRatio } = this.poolData;

      let currMaxMintable = BigNumber(maxMintable).minus(BigNumber(this.coinAmount).times(targetRatio));
      currMaxMintable = BigNumber(currMaxMintable).lt(0) ? 0 : currMaxMintable;

      return currMaxMintable;
    },
    // 已有债务
    existingDebt() {
      return BigNumber(this.poolData.currentDebt);
    },
    // 抵押率
    newCollRX() {
      const { pledgeNumber, currencyPrice } = this.poolData;

      const existingDebt = BigNumber(this.existingDebt).isZero() ? 0 : this.existingDebt;
      return existingDebt ? BigNumber(pledgeNumber).minus(this.coinAmount).times(currencyPrice).div(existingDebt).toNumber() : 0;
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
      const newLiquPrice = BigNumber(pledgeNumber).isZero() && (!BigNumber(pledgeNumber).minus(this.coinAmount))
        ? 0 : BigNumber(this.existingDebt).times(liquidationRX).div(BigNumber(pledgeNumber).minus(this.coinAmount)).toFixed(6);

      return newLiquPrice;
    },
    // 验证输入值
    checkValue() {
      if(BigNumber(this.coinAmount).gt(this.unlockedCollateral) || BigNumber(this.coinAmount).isLessThan(0)) {
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
    },
    onJoinClick () {
      this.isOpen = false;
      this.coinAmount = 0;
      this.$parent.openJoinDialog(this.poolData);
    },
    onChangeValue(value) {
      this.coinAmount = value;
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
