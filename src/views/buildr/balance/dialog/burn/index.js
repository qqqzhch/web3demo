import { mapState } from "vuex";
import ScInput from '../../../components/ScInput.vue';
import { fetchBalanaceChange } from '@/contactLogic/buildr/balance';
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
    ScInput,
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress']),
    currFee() { // 稳定费
      const { feeRate } = this.poolData;
      return `${ BigNumber(this.coinAmount).times(feeRate)} csUSD`;
    },
    // 当前额度
    scUSDNumber() {
      return this.poolData.scUSDNumber;
    },
    // 扣掉手续费后数量
    netAmount() {
      const { feeRate } = this.poolData;
      return BigNumber(this.coinAmount).times(BigNumber(1).minus(feeRate));
    },
    // 已有债务
    existingDebt() {
      return BigNumber(this.poolData.currentDebt);
    },
    // 减少后的债务
    newDebt() {
      return BigNumber(this.existingDebt).minus(this.netAmount);
    },
    // 铸造额度
    currMaxMintable() {
      const { maxMintable } = this.poolData;
      return BigNumber(maxMintable).plus(this.netAmount);
    },
    // 抵押率
    newCollRX() {
      const { pledgeNumber, currencyPrice } = this.poolData;
      const newDebt = BigNumber(this.newDebt).isZero() ? 0 : this.newDebt;
      return newDebt ? BigNumber(pledgeNumber).times(currencyPrice).div(newDebt): 0;
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
    // 验证输入值, 输入的最大值是min[现有债务，当前额度]-fee
    checkValue() {
      const debt = BigNumber(this.existingDebt).isLessThan(this.scUSDNumber) ? this.existingDebt : this.scUSDNumber;

      const fee = BigNumber(this.coinAmount).times(this.poolData.feeRate);
      const netDebt = BigNumber(debt).plus(fee);

      if(BigNumber(this.coinAmount).gt(netDebt) || BigNumber(this.coinAmount).isLessThan(0)) {
        return 'Input value must be less than balance+fee and greater than 0';
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
      this.isOpen = false;
      const params = {
        type: 'burn',
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
