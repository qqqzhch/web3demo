import { mapState, mapActions } from "vuex";
import event from '@/common/js/event';
import { getTokenImg } from '@/contactLogic/readbalance.js';
import { checklocal } from '../guide/checkeBulderApprove';
import Overview from './overview/index.vue';
import { collateralPools } from '@//contactLogic/buildr/balance';
import { fetchCollateralIndicators, fetchCurrencyPrice, fetchTokenBalance, fetchAllowanceAmount } from '@/contactLogic/buildr/create';
import { fetchPledgeNumber } from '@/contactLogic/buildr/balance';
import BigNumber from "bignumber.js";

export default {
  name: 'balance',
  data() {
    return {
      collateralPools,
      poolsData: [],
      BigNumber,
    };
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress']),
    isReady() {
      return this.ethersprovider && this.ethChainID && this.ethAddress;
    },
  },
  mounted() {
    //txsuccess
    event.$on('txsuccess',()=>{
      this.loadData();
    });
  },
  methods: {
    ...mapActions('buildr', ['setPoolsData']),
    getTokenImg(tokensymbol){
      const chainID = this.ethChainID;
      return getTokenImg(tokensymbol,chainID);
    },
    getParmas(item) {
      return {
        tokenName: item.token,
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account:  this.ethAddress,
        web3: this.web3,
      };
    },
    // 计算当前抵押倍数
    getCurrentCollRX(collateralisationRatio) {
      const currentCollRX = BigNumber(collateralisationRatio).isZero() ? 0 : BigNumber(1).div(collateralisationRatio).toNumber();
      return currentCollRX;
    },
    getLiquidationPrice(poolData){
      const { liquidationRatio, pledgeNumber, currentDebt } = poolData;
      const liquRatio = BigNumber(liquidationRatio).isZero() ? 0 : BigNumber(1).div(liquidationRatio);
      return BigNumber(pledgeNumber).isZero() ? 0 : BigNumber(currentDebt).times(liquRatio).div(pledgeNumber).toFixed(6);
    },
    loadData() {
      this.poolsData = [];
      collateralPools.forEach(async (item) => {
        const params = this.getParmas(item);
        const { unlockedCollateral, targetRatio, collateralisationRatio, currentDebt, maxMintable,
          liquidationRatio, feeRate } = await fetchCollateralIndicators(params);
        const { pledgeNumber } = await fetchPledgeNumber(params);
        const { currencyPrice } = await fetchCurrencyPrice(params);
        const currencyNumber = await fetchTokenBalance(params);
        const { allowanceAmount } = await fetchAllowanceAmount(params);

        // 读钱包中scUSD的余额
        const scashParams = {
          ...params,
          tokenName: 'scUSD'
        };
        const scUSDNumber = await fetchTokenBalance(scashParams);

        const itemData = {
          tokenName: item.token,
          tokenTitle: item.title,
          currencyNumber,
          unlockedCollateral,
          targetRatio,
          targetRX: BigNumber(targetRatio).isZero() ? 0 : BigNumber(1).div(targetRatio).toNumber(),
          collateralisationRatio,
          currentCollRX: this.getCurrentCollRX(collateralisationRatio),
          currentDebt,
          maxMintable,
          liquidationRatio,
          liquidationRX: BigNumber(liquidationRatio).isZero() ? 0 : BigNumber(1).div(liquidationRatio).toNumber(),
          feeRate,
          pledgeNumber,
          currencyPrice,
          scUSDNumber,
          allowanceAmount,
        };
        if(pledgeNumber) {
          this.poolsData = this.poolsData.concat(itemData);
        }
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
      if(tx && tx.base){
        this.$refs.haveSendtx.open(tx.base);
        event.$emit('sendtx',[tx.response, {
          okinfo: tx.base+' SUCCESS',
          failinfo: tx.base+' FAIL'
        }]);
      } else {
        this.$Notice.error({
          title: 'Send transaction fail!',
        });
      }
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
    Overview,
    JoinDialog: () => import('./dialog/join/index.vue'),
    MintDialog: () => import('./dialog/mint/index.vue'),
    BurnDialog: () => import('./dialog/burn/index.vue'),
    ExitDialog: () => import('./dialog/exit/index.vue'),
    haveSendDialog: () => import("@/components/basic/haveSendDialog.vue"),
    Loading: () => import("@/components/basic/loading.vue"),
  },
  created() {
    if(this.isReady) {
      const chainID = this.ethChainID;
      const account = this.ethAddress;
      const isHaveAllowance = checklocal(chainID, account);
      if (isHaveAllowance === 'true') {
        this.loadData();
      } else {
        this.$router.push('/buildr/guide');
      }
    }
  }
};
