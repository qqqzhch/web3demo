import ScInput from '../../../components/ScInput.vue';
import { fetchBalanaceChange } from '@/contactLogic/buildr/balance';
import {mapState} from "vuex";

export default {
  inject: ['reload'],
  data() {
    return {
      step: 1,
      isOpen: false,
      coinAmount: 0,  // 当前抵押资产的数量
      currMaxMintable: 0,   // 当前获取的授信scUSD额度
      currPledgeRatio: 0,   // 当前抵押率
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
      this.currMaxMintable = 0;
      this.currPledgeRatio = 0;
      this.currLiquidationPrice = 0;
    },
    onJoinClick () {
      this.isOpen = false;
      this.$parent.openJoinDialog(this.poolData);
    },
    onChangeValue(value) {
      const { pledgeNumber, existingDebt, liquidationRatio } = this.poolData;
      // 减少资产
      this.coinAmount = value;
      // 总资产
      const totalPledgeNumber = pledgeNumber - this.coinAmount;
      // 当前抵押率 = 总资产 / 总授信
      this.currPledgeRatio = totalPledgeNumber / existingDebt;
      // 清算价格：
      this.currLiquidationPrice = totalPledgeNumber ? liquidationRatio * existingDebt / totalPledgeNumber : 0;
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
