import { mapState } from 'vuex';
import BigNumber from "bignumber.js";
import event from '@/common/js/event';
import { getTokenImg } from '@/contactLogic/readbalance.js';
import ScInput from '../components/ScInput.vue';
import { getCollateralPools, fetchBalanaceChange, fetchPledgeNumber } from '@//contactLogic/buildr/balance';
import {
  fetchTokenBalance,
  fetchCollateralIndicators,
  fetchCurrencyPrice,
  fetchApprove,
  fetchAllowanceAmount,
  fetchLambdaApprove,
} from '@/contactLogic/buildr/create';
import i18n from '../../../i18n/index.js';


export default {
  name: 'create',
  data() {
    return {
      currencyNumber: 0, // 资产数量
      pledgeNumber: 0,   // 质押币数量
      stableNumber: 0,   // 稳定币数量
      targetRX: 0,          // 抵押率（倍数）
      liquidationRatio: 0,  // 清算抵押率
      feeRate: 0,    // 稳定费率
      debtCap: 0,    // 全球scUSD债务上限
      allowanceAmount: 0, //限额
      currencyPrice: 0,
      collateralPools: [], // 合约池
      defaultPool: {},
      BigNumber,
      btnloading: false,
      poolsEnable: {},
    };
  },
  components: {
    ScInput,
    haveSendDialog: () => import("../components/haveSendDialog.vue"),
    assetDialog: () => import('../components/assetDialog.vue'),
    Loading: () => import("@/components/basic/loading.vue"),
  },
  mounted() {
    //txsuccess
    event.$on('txsuccess',() => {
      const currPool = {
        ...this.defaultPool,
        pledgeNumber: this.pledgeNumber
      };
      this.$refs.haveSendtx.open(currPool, 'ok');
      this.loadData();
    });
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress']),
    isReady() {
      return this.ethersprovider && this.ethChainID && this.ethAddress;
    },
    // 验证输入值
    checkValue() {
      if(BigNumber(this.pledgeNumber).isLessThan(0)) {
        return i18n.t('notice.swapNotice.n2');
      } else if (isNaN(this.pledgeNumber)) {
        return i18n.t('notice.buidrNotice.n1');
      } else {
        return 'ok';
      }
    }
  },
  methods: {
    getTokenImg(tokensymbol){
      const chainID = this.ethChainID;
      return getTokenImg(tokensymbol,chainID);
    },
    // check金库是否已创建
    async checkPoolsEnable() {
      const loadList = [];
      this.collateralPools.forEach((pool) => {
        const params = Object.assign({}, this.getParams(), {tokenName: pool.token});
        loadList.push(fetchPledgeNumber(params));
      });
      const result = await Promise.all(loadList);

      const poolsEnable = {};
      let selected = false;
      this.collateralPools.forEach((pool, index) => {
        const { pledgeNumber } = result[index];
        const isCreated = BigNumber(pledgeNumber).gt(0);
        poolsEnable[pool.token] = isCreated;
        if(!isCreated && selected === false) {
          this.defaultPool = pool;
          selected = true;
        }
      });
      this.poolsEnable = poolsEnable;
      // 如果都已传教返回管理页面
      if(selected === false) {
        this.$router.push('/buildr/balance');
      }
    },
    getPools() {
        const collateralPools = getCollateralPools(this.ethChainID);
        this.collateralPools = collateralPools;
        this.checkPoolsEnable();
    },
    getParams() {
      const { isNative, token } = this.defaultPool;
      return {
        isNative,
        tokenName: token,
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account:  this.ethAddress,
        web3: this.web3,
      };
    },
    async getCurrencyNumber() {
      const params = this.getParams();
      this.currencyNumber = await fetchTokenBalance(params);
    },
    async getIndicators() {
      const params = this.getParams();
      const { targetRatio, liquidationRatio, feeRate, debtCap } = await fetchCollateralIndicators(params);

      this.targetRX = BigNumber(targetRatio).isZero() ? 0 : BigNumber(1).div(targetRatio);
      this.liquidationRatio = BigNumber(liquidationRatio).isZero() ? 0 : BigNumber(1).div(liquidationRatio);
      this.feeRate = feeRate;
      this.debtCap = debtCap;
    },
    async getCurrencyPrice() {
      const params = this.getParams();
      const { currencyPrice } = await fetchCurrencyPrice(params);

      this.currencyPrice = currencyPrice;
    },
    onChangePledgeNumber(val) {
      this.pledgeNumber = val || '';
      // this.pledgeNumber = (BigNumber(val).isNaN() || BigNumber(val).isZero()) ? 0 : val;
      this.stableNumber = this.pledgeNumber ? BigNumber(this.pledgeNumber).times(this.currencyPrice).div(this.targetRX) : '';
    },
    async onApproveClick() {
      if(!this.pledgeNumber) return;

      const params = Object.assign({}, this.getParams(), {
        pledgeNumber: this.pledgeNumber,
      });

      // 标准的ERC20合约授权
      // 非标准的ERC20 token 需要单独授权，目前只有LAMB
      // 原生代币不需要授权
      let transaction;
      this.btnloading = true;
      if(this.defaultPool.isERC20) {
        transaction = await fetchApprove(params);
      } else if(this.defaultPool.token === 'LAMB'){
        transaction = await fetchLambdaApprove(params);
      }

      if (transaction && transaction.hash) {
        const waitdata = await transaction.wait([1]);
        this.btnloading = false;
        // 需要更新数据
        this.loadData(true);
      } else {
        this.$Notice.error({
          title: i18n.t('notice.buidrNotice.n2'),
        });
        this.btnloading = false;
      }
    },
    async getAllowanceAmount(){
      const params = this.getParams();
      const { allowanceAmount } = await fetchAllowanceAmount(params);
      this.allowanceAmount = allowanceAmount;
    },
    sendtx(tx) {
      if(tx && tx.base){
        this.$refs.haveSendtx.open(this.defaultPool, 'created');
        event.$emit('sendtx',[tx.response, {
          okinfo: tx.base+ i18n.t('swapConfirm.successCom'),
          failinfo: tx.base+ i18n.t('swapConfirm.failCom')
        }]);
      } else {
        this.$Notice.error({
          title: i18n.t('notice.buidrNotice.n3'),
        });
      }
    },
    // Join
    async onJoinClick() {
      const params = this.getParams();
      const { isNative, isERC20 } = this.defaultPool;
      const type = isNative ? 'joinNative' : isERC20 ? 'joinERC20' :'join';
      const joinParams = {
        ...params,
        type,
        coinAmount: this.pledgeNumber,
        unit: this.defaultPool.token,
      };
      if(this.pledgeNumber) {
        const tx = await fetchBalanaceChange(joinParams);
        this.sendtx(tx);
      }
    },
    loadData(isClear) {
      this.pledgeNumber = isClear ? this.pledgeNumber: 0;
      this.getCurrencyNumber();
      this.getIndicators();
      this.getCurrencyPrice();
      if(!this.defaultPool.isNative) {
        this.getAllowanceAmount();
      }
    },
    openAsset(){
      this.$refs.asset.open({
        defaultTokenName: this.defaultPool.name,
        data: this.collateralPools,
        poolsEnable: this.poolsEnable,
      });
    },
    setAsset(tokenName) {
      this.defaultPool = this.collateralPools.find(pool => pool.name === tokenName);
      this.loadData();
    },
    isApprove() {
      return !this.defaultPool.isNative && (BigNumber(this.allowanceAmount).isZero() || BigNumber(this.pledgeNumber).gt(this.allowanceAmount));
    },
  },
  watch: {
    isReady(value) {
      if (value) {
        this.getPools();
        this.loadData();
      }
    },
  },
  created() {
    if(this.isReady) {
      this.getPools();
      this.loadData();
    }
  }
};
