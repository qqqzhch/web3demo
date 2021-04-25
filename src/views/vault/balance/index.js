import BigNumber from "bignumber.js";
import { mapState, mapActions } from "vuex";
import event from '@/common/js/event';
import { getTokenImg } from '@/contactLogic/readbalance.js';
import { getCollateralPools } from '@/contactLogic/buildr/balance';
import i18n from '../../../i18n/index.js';
import Overview from './overview/index.vue';
import { calcTroveIndicators, stableName } from '../../../contactLogic/buildr/liquity';
import { liquityValidate } from "../../../contactLogic/buildr/validate";


export default {
  name: 'balance',
  data() {
    return {
      stableName,
      collateralPools: [],
      poolsData: [],
      BigNumber,
      allPoolsCreated: false,
    };
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress', 'currPool']),
    ...mapState('buildr', ['currPool', 'liquityState', 'isOpen']),
    isReady() {
      return this.ethersprovider && this.ethChainID && this.ethAddress;
    },
  },
  methods: {
    ...mapActions('buildr', ['setPoolsData', 'setAllPoolsEnable']),
    toPage(name) {
      switch (name) {
        case 'balance':
          this.$router.push(`/vault/balance`);
          break;

        case 'create':
          this.$router.push(`/vault/create`);
          break;
      }
    },
    getTokenImg(tokensymbol){
      const chainID = this.ethChainID;
      return getTokenImg(tokensymbol,chainID);
    },
    checkLiquityReady() {
      const chainID = this.ethChainID;
      this.collateralPools = getCollateralPools(chainID);
      this.loadData();
    },
    getLiquidationPrice(poolData){
      const { currencyPrice, liquidationRatio, collateralRatio } = poolData;
      return BigNumber(currencyPrice).times(liquidationRatio).div(collateralRatio).toNumber();
    },
    getTroveIndicators(depositAmount, debtAmount) {
      return calcTroveIndicators(this.liquityState, depositAmount, debtAmount);
    },
    loadData() {
      this.poolsData = [];
      this.collateralPools.forEach((item, index) => {
        const depositAmount = this.liquityState.trove.collateral.toString();  // 已质押BNB数量
        const debtAmount = this.liquityState.trove.debt.toString();           // 当前债务
        const accountBalance = this.liquityState.accountBalance.toString();   // 账户余额BNB数量
        const troveIndicators = this.getTroveIndicators(depositAmount, debtAmount);

        const itemData = {
          index,
          tokenName: item.token,
          tokenTitle: item.title,
          stableName: this.stableName,
          liquityState: this.liquityState,
          collateralRatio: troveIndicators.collateralRatio,
          borrowingRate: troveIndicators.borrowingRate,
          liquidationRatio: troveIndicators.liquidationRatio,
          liquidationReserve: troveIndicators.liquidationReserve,
          accountBalance,
          depositAmount,
          debtAmount,
          currencyPrice: this.liquityState.price.toString(),               // 当前价格
        };

        this.poolsData = [itemData];
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
    openCloseDialog(poolData) {
      this.$refs.tokenClose.open(poolData);
    },
    sendtx(tx) {
      if(tx && tx.base){
        this.$refs.haveSendtx.open(tx.base);
        event.$emit('sendtx',[tx.transaction.rawSentTransaction, {
          okinfo: tx.base +' '+ i18n.t('vault-success'),
          failinfo: tx.base +' '+ i18n.t('vault-fail')
        }]);
      } else {
        this.$Notice.error({
          title: i18n.t('notice.buidrNotice.n3'),
        });
      }
    },
    validate(depositAmount, borrowAmount) {
      const params = {
        state: this.liquityState,
        trove: this.liquityState.trove,
        borrowingRate: this.liquityState.borrowingRate,
        depositAmount,
        borrowAmount,
      };
      return liquityValidate(params);
    },

    // 首次创建金库，引导用于去铸造, 只出现一次
    // gotoGenerate() {
    //   if(this.currPool.token) {
    //     const [ poolData ] = this.poolsData.filter(pool => pool.tokenName === this.currPool.token);
    //     poolData && this.openMintDialog(poolData);
    //   }
    // }
  },
  watch: {
    isReady(value) {
      if (value) {
        this.checkLiquityReady();
      }
    },
    // poolsData(nv) {
    //   this.poolsData = nv;
    //   this.setPoolsData(nv);
    //   this.gotoGenerate();
    // },
    liquityState: {
      deep: true,
      handler() {
        this.loadData();
      }
    }
  },
  components: {
    Overview,
    JoinDialog: () => import('./dialog/join/index.vue'),
    MintDialog: () => import('./dialog/mint/index.vue'),
    BurnDialog: () => import('./dialog/burn/index.vue'),
    ExitDialog: () => import('./dialog/exit/index.vue'),
    CloseDialog: () => import('./dialog/close/index.vue'),
    haveSendDialog: () => import("@/components/basic/haveSendDialog.vue"),
    Loading: () => import("@/components/basic/loading.vue"),
  },
  created() {
    if(this.isReady) {
      this.checkLiquityReady();
    }
  }
};
