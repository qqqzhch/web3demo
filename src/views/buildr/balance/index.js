import BigNumber from "bignumber.js";
import _ from 'underscore';
import { mapState, mapActions } from "vuex";
import event from '@/common/js/event';
import { getTokenImg } from '@/contactLogic/readbalance.js';
import { checkeBulderApprove } from '../guide/checkeBulderApprove';
import Overview from './overview/index.vue';
import { getCollateralPools } from '@//contactLogic/buildr/balance';
import { fetchCollateralIndicators, fetchCurrencyPrice, fetchTokenBalance, fetchAllowanceAmount } from '@/contactLogic/buildr/create';
import { fetchPledgeNumber } from '@/contactLogic/buildr/balance';
import i18n from '../../../i18n/index.js';

export default {
  name: 'balance',
  data() {
    return {
      collateralPools: [],
      poolsData: [],
      BigNumber,
    };
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress', 'currPool']),
    ...mapState('buildr', ['currPool']),
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
    async checkApprove() {
      const { chainID, library, account } = this.getParmas({});
      const isHaveAllowance = await checkeBulderApprove(this.$router, chainID, library, account);
      if(isHaveAllowance) {
        this.collateralPools = getCollateralPools(chainID);
        this.loadData();
      } else {
        this.$router.push('/buildr/guide');
      }
    },
    getParmas(item) {
      return {
        isNative: item.isNative,
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
      this.collateralPools.forEach(async (item, index) => {
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
          index,
          isERC20: item.isERC20,
          isNative: item.isNative,
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
          this.poolsData = _.chain(this.poolsData.concat(itemData)).sortBy(pool => pool.index).value();
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
          okinfo: tx.base + i18n.t('swapConfirm.successCom'),
          failinfo: tx.base + i18n.t('swapConfirm.failCom')
        }]);
      } else {
        this.$Notice.error({
          title: i18n.t('notice.buidrNotice.n3'),
        });
      }
    },
    // 首次创建金库，引导用于去铸造, 只出现一次
    gotoGenerate() {
      if(this.currPool.token) {
        const [ poolData ] = this.poolsData.filter(pool => pool.tokenName === this.currPool.token);
        poolData && this.openMintDialog(poolData);
      }
    }
  },
  watch: {
    isReady(value) {
      if (value) {
        this.checkApprove();
      }
    },
    poolsData(nv) {
      this.poolsData = nv;
      this.setPoolsData(nv);
      this.gotoGenerate();
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
      this.checkApprove();
    }
  }
};
