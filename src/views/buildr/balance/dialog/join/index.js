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
      BigNumber,
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
    currMaxMintable() {
      const { maxMintable, currentCollRX, targetRatio, targetRX, currencyPrice, pledgeNumber } = this.poolData;

      let currMaxMintable = 0;
      if(BigNumber(currentCollRX).gt(targetRX)) {
        currMaxMintable = BigNumber(this.coinAmount).times(currencyPrice).times(targetRatio).plus(maxMintable);
      } else {
        // 达到目标抵押率需要的数量,如果coinAmount> targetAmount 增加额度，否则增加额度为0;
        const targetAmount = BigNumber(this.existingDebt).times(targetRX).div(currencyPrice).minus(pledgeNumber);

        const netAmount = BigNumber(this.coinAmount).gt(targetAmount) ? BigNumber(this.coinAmount).minus(targetAmount) : 0;
        currMaxMintable = BigNumber(netAmount).times(currencyPrice).times(targetRatio).plus(maxMintable);
      }
      return currMaxMintable;
    },
    // 抵押率
    newCollRX() {
      const { pledgeNumber, currencyPrice } = this.poolData;

      const existingDebt = BigNumber(this.existingDebt).isZero() ? 0 : this.existingDebt;
      return existingDebt ? BigNumber(pledgeNumber).plus(this.coinAmount).times(currencyPrice).div(existingDebt).toNumber() : 0;
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
      const newLiquPrice = BigNumber(pledgeNumber).isZero() && (!BigNumber(pledgeNumber).plus(this.coinAmount))
        ? 0 : BigNumber(this.existingDebt).times(liquidationRX).div(BigNumber(pledgeNumber).plus(this.coinAmount)).toFixed(6);

      return newLiquPrice;
    },
    // 验证输入值
    checkValue() {
      if(BigNumber(this.coinAmount).gt(this.currencyNumber) || BigNumber(this.coinAmount).isLessThan(0)) {
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
