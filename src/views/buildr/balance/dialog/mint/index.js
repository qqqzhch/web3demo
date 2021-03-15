import { mapState } from "vuex";
import ScInput from '../../../components/ScInput.vue';
import { fetchBalanaceChange } from '@/contactLogic/buildr/balance';

export default {
  data() {
    return {
      step: 1,
      isOpen: false,
      coinAmount: 0,  // 当前抵押资产的数量
      currPledgeRatio: 0,   // 当前抵押率
      currMaxMintable: 0, // 可铸造的scUSD
      currLiquidationPrice: 0, // 当前清算价格
      poolData: {},  // 父组件传过来的数据
    };
  },
  components: {
    ScInput
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress'])
  },
  methods: {
    // 打开弹窗
    open(poolData) {
      this.poolData = poolData;
      this.isOpen = true;
      this.step = 1;
      this.coinAmount = 0;
      this.currPledgeRatio = 0;
      this.currLiquidationPrice = 0;
    },
    onBurnClick() {
      this.isOpen = false;
      this.$parent.openBurnDialog(this.poolData);
    },
    onChangeValue(value) {
      const { pledgeNumber, existingDebt, liquidationRatio } = this.poolData;
      // 要铸造的资产数量
      this.coinAmount = value;
      // 总负债
      const newDebt = existingDebt + value;
      // 当前抵押率 = 总质押 / 总负债
      this.currPledgeRatio = pledgeNumber / newDebt;
      // 清算价格：
      this.currLiquidationPrice = pledgeNumber ? liquidationRatio * newDebt / pledgeNumber : 0;
    },
    onNextClick() {
      this.step = 2;
    },
    async onMintClick() {
      const params = {
        type: 'mint',
        tokenName: this.poolData.tokenName,
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account:  this.ethAddress,
        web3: this.web3,
        coinAmount: this.coinAmount,
      }

      await fetchBalanaceChange(params);
      this.isOpen = false;
    }
  },
};
