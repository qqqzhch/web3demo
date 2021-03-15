import { mapState } from "vuex";
import ScInput from '../../../components/ScInput.vue';
import { fetchBalanaceChange } from '@/contactLogic/buildr/balance';

export default {
  data() {
    return {
      type: 'join',
      step: 1,
      isOpen: false,
      coinAmount: 0,  // 当前抵押资产的数量
      currMaxMintable: 0,   // 当前获取的授信scUSD额度
      totalMaxMintable: 0,
      currPledgeRatio: 0,   // 当前抵押率
      currLiquidationPrice: 0, // 当前清算价格
      totalDebt: 0,
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
      this.currMaxMintable = 0;
      this.totalMaxMintable = 0;
      this.currPledgeRatio = 0;
      this.currLiquidationPrice = 0;
    },
    onExitClick() {
      this.isOpen = false;
      this.$parent.openExitDialog(this.poolData);
    },
    onChangeValue(value) {
      const { targetRatio, pledgeNumber, existingDebt, liquidationRatio, maxMintable } = this.poolData;

      // 获取授信的scUSD
      this.currMaxMintable = value * targetRatio;
      // 总可授信的scUSD
      this.totalMaxMintable = maxMintable + this.currMaxMintable;
      // 新增资产
      this.coinAmount = value;
      // 总资产 = 已有资产 + 新增资产
      const totalPledgeNumber = pledgeNumber + this.currPledgeNumber;
      // 新的抵押率 = 总资产 / 总负债
      this.currPledgeRatio = totalPledgeNumber / existingDebt;
      // 清算价格：
      this.currLiquidationPrice = totalPledgeNumber ? liquidationRatio * existingDebt / totalPledgeNumber : 0;
    },
    onNextClick() {
      this.step = 2;
    },
    async onJoinClick() {
      const params = {
        type: this.type,
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
