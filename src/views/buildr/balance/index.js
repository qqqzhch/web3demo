import { mapState } from "vuex";
import { fetchCollateralIndicators } from '../../../contactLogic/buildr/create';
import { fetchPledgeNumber } from '../../../contactLogic/buildr/balance';


export default {
  name: 'balance',
  data() {
    return {
      currency: 'LAMB',
      targetRatio: 0,  // targetRatio
      collateralisationRatio: 0, // 当前抵押率
      unlockedCollateral: 0,  // 可释放LAMB
      liquidationRatio: 0, // 清算抵押率
      liquidationPrice: 0, // 清算价格
      currentDebt: 0, // 当前债务
      stableNumber: 0, // 授信的稳定币数量scUSD
      pledgeNumber: 0, // 抵押资产,
      feeRate: 0,
    };
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress']),
    liquidationPrice() {
      return this.pledgeNumber ? this.liquidationRatio * this.maxMintable / this.pledgeNumber : 0;
    },
    isReady() {
      return this.ethersprovider && this.ethChainID && this.ethAddress;
    }
  },
  methods: {
    getParmas() {
      return {
        tokenName: this.currency,
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account:  this.ethAddress,
        web3: this.web3,
      };
    },
    async getPledgeNumber() {
      const params = this.getParmas();
      const { pledgeNumber } = await fetchPledgeNumber(params);
      this.pledgeNumber = pledgeNumber;
    },
    async getIndicators() {
      const params = this.getParmas();
      const { unlockedCollateral, targetRatio, collateralisationRatio,
        currentDebt, maxMintable, liquidationRatio, feeRate } = await fetchCollateralIndicators(params);

      this.targetRatio = targetRatio ? 1 / targetRatio : 0;
      this.collateralisationRatio = Number(collateralisationRatio) ? 1 / Number(collateralisationRatio) : 0;
      this.currentDebt = currentDebt;
      this.maxMintable = maxMintable;
      this.unlockedCollateral = unlockedCollateral;
      this.liquidationRatio = liquidationRatio;
      this.feeRate = feeRate;
    },
    openJoinDialog() {
      this.$refs.tokenJoin.open();
    },
    openMintDialog() {
      this.$refs.tokenMint.open();
    },
    openBurnDialog() {
      this.$refs.tokenBurn.open();
    },
    openExitDialog() {
      this.$refs.tokenExit.open();
    }
  },
  watch: {
    isReady(value) {
      if (value) {
        this.getIndicators();
        this.getPledgeNumber();
      }
    }
  },
  components: {
    JoinDialog: () => import('./dialog/join/index.vue'),
    MintDialog: () => import('./dialog/mint/index.vue'),
    BurnDialog: () => import('./dialog/burn/index.vue'),
    ExitDialog: () => import('./dialog/exit/index.vue')
  },
  created() {
    if(this.isReady) {
      this.getIndicators();
      this.getPledgeNumber();
    }
  }
};
