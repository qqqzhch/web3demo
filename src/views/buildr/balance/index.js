import { mapState, mapActions } from "vuex";
import event from '@/common/js/event';
import { collateralPools } from '@//contactLogic/buildr/balance';
import { fetchCollateralIndicators } from '@/contactLogic/buildr/create';
import { fetchPledgeNumber } from '@/contactLogic/buildr/balance';


export default {
  name: 'balance',
  data() {
    return {
      // currency: 'LAMB',
      // targetRatio: 0,  // targetRatio
      // collateralisationRatio: 0, // 当前抵押率
      // unlockedCollateral: 0,  // 可释放LAMB
      // liquidationRatio: 0, // 清算抵押率
      // liquidationPrice: 0, // 清算价格
      // currentDebt: 0, // 当前债务
      // stableNumber: 0, // 授信的稳定币数量scUSD
      // pledgeNumber: 0, // 抵押资产,
      // feeRate: 0,
      collateralPools,
      poolsData: [],
    };
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress']),
    // liquidationPrice() {
    //   return this.pledgeNumber ? this.liquidationRatio * this.maxMintable / this.pledgeNumber : 0;
    // },
    isReady() {
      return this.ethersprovider && this.ethChainID && this.ethAddress;
    }
  },
  mounted() {
    //txsuccess
    event.$on('txsuccess',()=>{
      this.loadData();
    });
  },
  methods: {
    ...mapActions('buildr', ['setPoolsData']),
    getParmas(item) {
      return {
        tokenName: item.token,
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account:  this.ethAddress,
        web3: this.web3,
      };
    },
    // async getPledgeNumber() {
    //   const params = this.getParmas();
    //   const { pledgeNumber } = await fetchPledgeNumber(params);
    //   this.pledgeNumber = pledgeNumber;
    // },
    // async getIndicators() {
    //   const params = this.getParmas();
    //   const { unlockedCollateral, targetRatio, collateralisationRatio,
    //     currentDebt, maxMintable, liquidationRatio, feeRate } = await fetchCollateralIndicators(params);
    //
    //   this.targetRatio = targetRatio ? 1 / targetRatio : 0;
    //   this.collateralisationRatio = Number(collateralisationRatio) ? 1 / Number(collateralisationRatio) : 0;
    //   this.currentDebt = currentDebt;
    //   this.maxMintable = maxMintable;
    //   this.unlockedCollateral = unlockedCollateral;
    //   this.liquidationRatio = liquidationRatio;
    //   this.feeRate = feeRate;
    // },
    loadData() {
      collateralPools.forEach(async (item) => {
        const params = this.getParmas(item);
        const { unlockedCollateral, targetRatio, collateralisationRatio, currentDebt, maxMintable,
          liquidationRatio, feeRate } = await fetchCollateralIndicators(params);
        const { pledgeNumber } = await fetchPledgeNumber(params);

        const itemData = {
          tokenName: item.token,
          tokenTitle: item.title,
          unlockedCollateral,
          targetRatio,
          collateralisationRatio,
          currentDebt,
          maxMintable,
          liquidationRatio,
          feeRate,
          pledgeNumber
        };
        this.poolsData = this.poolsData.concat(itemData);
      });
    },
    openJoinDialog(poolData) {
      this.$refs.tokenJoin.open(poolData);
    },
    openMintDialog(poolData) {
      this.$refs.tokenMint.open(poolData);
    },
    openBurnDialog(poolData) {
      this.$refs.tokenBurn.open(poolData);
    },
    openExitDialog(poolData) {
      this.$refs.tokenExit.open(poolData);
    },
    sendtx(tx) {
      this.$refs.haveSendtx.open(tx.base);
      event.$emit('sendtx',[tx.response, {
        okinfo: tx.base+"成功",
        failinfo: tx.base+'失败'
      }]);
    }
  },
  watch: {
    isReady(value) {
      if (value) {
        this.loadData();
      }
    },
    poolsData(nv) {
      this.poolsData = nv;
      this.setPoolsData(nv);
    }
  },
  components: {
    JoinDialog: () => import('./dialog/join/index.vue'),
    MintDialog: () => import('./dialog/mint/index.vue'),
    BurnDialog: () => import('./dialog/burn/index.vue'),
    ExitDialog: () => import('./dialog/exit/index.vue'),
    haveSendDialog: () => import("@/components/basic/haveSendDialog.vue"),
  },
  created() {
    if(this.isReady) {
      this.loadData();
    }
  }
};
