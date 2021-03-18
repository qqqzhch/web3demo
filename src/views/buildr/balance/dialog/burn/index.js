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
      return BigNumber(this.poolData.scUSDNumber).toFixed(6);
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
    maxMintable() {
      const { maxMintable } = this.poolData;
      return `${BigNumber(maxMintable).toFixed(6)} to ${BigNumber(maxMintable).plus(this.netAmount).toFixed(6)} ${this.unit}`;
    },
    // 抵押率
    collRatio() {
      const { collateralisationRatio, pledgeNumber, currencyPrice } = this.poolData;

      const collRatio = BigNumber(collateralisationRatio).isZero() ? 0 : BigNumber(1).div(collateralisationRatio);
      const newDebt = BigNumber(this.newDebt).isZero() ? 0 : this.newDebt;

      return `${BigNumber(collRatio).times(100).toFixed(6)}% 
            to ${newDebt ? BigNumber(pledgeNumber).times(currencyPrice).div(newDebt).times(100).toFixed(6) : 0}%`;
    },
    // 清算价格
    liquidationPrice() {
      const { liquidationRatio, pledgeNumber } = this.poolData;
      const liquRatio = BigNumber(liquidationRatio).isZero() ? 0 : BigNumber(1).div(liquidationRatio);

      const liquPrice = BigNumber(pledgeNumber).isZero() ? 0 : BigNumber(this.existingDebt).times(liquRatio).div(pledgeNumber).toFixed(6);
      const newLiquPrice = BigNumber(pledgeNumber).isZero() ? 0 : BigNumber(this.newDebt).times(liquRatio).div(pledgeNumber).toFixed(6);

      return `1LAMB = ${liquPrice} USD to ${newLiquPrice} USD`;
    },
    // 验证输入值, 输入的最大值是min[现有债务，当前额度]-fee
    checkValue() {
      const debt = BigNumber(this.existingDebt).isLessThan(this.scUSDNumber) ? this.existingDebt : this.scUSDNumber;

      const fee = BigNumber(this.coinAmount).times(this.poolData.feeRate);
      const netDebt = BigNumber(debt).plus(fee);

      if(BigNumber(this.coinAmount).gt(netDebt)) {
        return 'overMaxValue';
      } else if (BigNumber(this.coinAmount).isLessThanOrEqualTo(0)) {
        return 'isZero';
      } else {
        return false;
      }
    }
  },
  methods: {
    // 打开弹窗
    open(poolData) {
      this.poolData = poolData;
      this.isOpen = true;
      this.step = 1;
      this.coinAmount = 0;
    },
    onMintClick() {
      this.isOpen = false;
      this.$parent.openMintDialog(this.poolData);
    },
    onChangeValue(value) {
      // 销毁的scUSD
      this.coinAmount = (BigNumber(value).isZero() || BigNumber(value).isNaN()) ? 0 : value;
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
