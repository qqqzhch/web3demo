import BigNumber from "bignumber.js";
import { mapState, mapActions } from "vuex";
import event from '@/common/js/event';
import { getTokenImg } from '@/contactLogic/readbalance.js';
import { getCollateralPools } from '@/contactLogic/buildr/balance';
import i18n from '../../../i18n/index.js';
import Overview from './overview/index.vue';


export default {
  name: 'balance',
  data() {
    return {
      collateralPools: [],
      poolsData: [],
      BigNumber,
      allPoolsCreated: false,
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
    ...mapActions('buildr', ['setPoolsData', 'setAllPoolsEnable']),
    getTokenImg(tokensymbol){
      const chainID = this.ethChainID;
      return getTokenImg(tokensymbol,chainID);
    },
    // check金库是否已创建
    // async checkPoolsEnable() {
    //   const loadList = [];
    //   this.collateralPools.forEach((pool) => {
    //     const params = Object.assign({}, this.getParams({}), {tokenName: pool.token});
    //     loadList.push(fetchPledgeNumber(params));
    //   });
    //
    //   const result = await Promise.all(loadList);
    //
    //   const poolsEnable = this.collateralPools.map((pool, index) => {
    //     const { pledgeNumber } = result[index];
    //     return BigNumber(pledgeNumber).gt(0);
    //   });
    //
    //   // 判断是否创建按钮
    //   const isAllCreated = poolsEnable.includes(false);
    //   this.setAllPoolsEnable(!isAllCreated);
    //
    //   return poolsEnable.includes(true);
    // },
    async checkLiquityReady() {
      const { chainID, library, account } = this.getParams({});
      this.collateralPools = getCollateralPools(chainID);
      this.loadData();
      // const isPoolsenable = await this.checkPoolsEnable();
      // const isHaveAllowance = await checkeBulderApprove(this.$router, chainID, library, account);
      // if(isPoolsenable || isHaveAllowance) {
      //   this.loadData();
      // } else {
      //   this.$router.push('/vault/create');
      // }
    },
    getParams(item) {
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
        const params = this.getParams(item);
        // const { unlockedCollateral, targetRatio, collateralisationRatio, currentDebt, maxMintable,
        //   liquidationRatio, feeRate } = await fetchCollateralIndicators(params);
        // const { pledgeNumber } = await fetchPledgeNumber(params);
        // const { currencyPrice } = await fetchCurrencyPrice(params);
        // const currencyNumber = await fetchTokenBalance(params);
        // const { allowanceAmount } = await fetchAllowanceAmount(params);

        // 读钱包中scUSD的余额
        // const scashParams = {
        //   ...params,
        //   tokenName: 'scUSD'
        // };
        // const scUSDNumber = await fetchTokenBalance(scashParams);

        const itemData = {
          index,
          isERC20: item.isERC20,
          isNative: item.isNative,
          tokenName: item.token,
          tokenTitle: item.title,
          currencyNumber: 0,
          unlockedCollateral: 0 ,
          targetRatio: 0,
          targetRX: 0, //BigNumber(targetRatio).isZero() ? 0 : BigNumber(1).div(targetRatio).toNumber(),
          collateralisationRatio: 0,
          currentCollRX: 0,//this.getCurrentCollRX(collateralisationRatio),
          currentDebt : 0,
          maxMintable : 0,
          liquidationRatio: 0,
          liquidationRX: 0, //BigNumber(liquidationRatio).isZero() ? 0 : BigNumber(1).div(liquidationRatio).toNumber(),
          feeRate: 0,
          pledgeNumber: 0,
          currencyPrice: 0,
          scUSDNumber: 0,
          allowanceAmount: 0,
        };
        // if(BigNumber(pledgeNumber).gt(0)) {
        //   this.poolsData = _.chain(this.poolsData.concat(itemData)).sortBy(pool => pool.index).value();
        // }
        this.poolsData = [itemData];
        console.log(this.poolsData, 33366);
      });
      console.log(444);
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
        this.checkLiquityReady();
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
      this.checkLiquityReady();
    }
  }
};
