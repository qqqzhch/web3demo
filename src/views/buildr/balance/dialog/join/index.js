import { mapState } from "vuex";
import ScInput from '../../../components/ScInput.vue';
import { fetchBalanaceChange } from '@/contactLogic/buildr/balance';
import BigNumber from "bignumber.js";

export default {
  data() {
    return {
      type: 'join',
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
    // 可用额度
    currencyNumber() {
      return BigNumber(this.poolData.currencyNumber).toFixed(6);
    },
    // 已有债务
    existingDebt() {
      return BigNumber(this.poolData.currentDebt);
    },
    // 铸造额度
    maxMintable() {
      const { maxMintable, collateralisationRatio, targetRatio, currencyPrice, pledgeNumber } = this.poolData;

      const collRX = BigNumber(collateralisationRatio).isZero() ? 0 : BigNumber(1).div(collateralisationRatio);
      const targetRX = BigNumber(targetRatio).isZero() ? 0 : BigNumber(1).div(targetRatio);

      let currMaxMintable = 0;
      if(BigNumber(collRX).gt(targetRX)) {
        currMaxMintable = BigNumber(maxMintable).plus(this.coinAmount).times(targetRatio);
      } else {
        // 达到目标抵押率需要的数量,如果coinAmount> targetAmount 增加额度，否则增加额度为0;
        const targetAmount = BigNumber(this.existingDebt).times(targetRX).div(currencyPrice).minus(pledgeNumber);

        const netAmount = BigNumber(this.coinAmount).gt(targetAmount) ? BigNumber(this.coinAmount).minus(targetAmount) : 0;
        currMaxMintable = BigNumber(netAmount).times(targetRatio).plus(maxMintable);
      }
      return `${BigNumber(maxMintable).toFixed(6)} 至 ${BigNumber(currMaxMintable).toFixed(6)} ${this.unit}`;
    },
    // 抵押率
    collRatio() {
      const { collateralisationRatio, pledgeNumber, currencyPrice } = this.poolData;

      const collRX = BigNumber(collateralisationRatio).isZero() ? 0 : BigNumber(1).div(collateralisationRatio);
      const existingDebt = BigNumber(this.existingDebt).isZero() ? 0 : this.existingDebt;

      return existingDebt
        ? `${BigNumber(collRX).times(100).toFixed(6)}%` +
        `至 ${BigNumber(pledgeNumber).plus(this.coinAmount).times(currencyPrice).div(existingDebt).times(100).toFixed(6)}%`
        : `0% 至 0%`;

    },
    // 清算价格
    liquidationPrice() {
      const { liquidationRatio, pledgeNumber } = this.poolData;

      const liquRatio = BigNumber(liquidationRatio).isZero() ? 0 : BigNumber(1).div(liquidationRatio);

      const liquPrice = BigNumber(pledgeNumber).isZero() ? 0 : BigNumber(this.existingDebt).times(liquRatio).div(pledgeNumber).toFixed(6);
      const newLiquPrice = BigNumber(pledgeNumber).isZero() && (!BigNumber(pledgeNumber).plus(this.coinAmount))
        ? 0 : BigNumber(this.existingDebt).times(liquRatio).div(BigNumber(pledgeNumber).plus(this.coinAmount)).toFixed(6);

      return `1LAMB = ${liquPrice} USD 至 ${newLiquPrice} USD`;
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
    onExitClick() {
      this.isOpen = false;
      this.$parent.openExitDialog(this.poolData);
    },
    onChangeValue(value) {
      this.coinAmount = value;
    },
    onNextClick() {
      this.step = 2;
    },
    async onJoinClick() {
      this.isOpen = false;
      const params = {
        type: this.type,
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
