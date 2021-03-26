import { mapState } from 'vuex';
import BigNumber from "bignumber.js";
import event from '@/common/js/event';
import { getTokenImg } from '@/contactLogic/readbalance.js';
import ScInput from '../components/ScInput.vue';
import { getCollateralPools, fetchBalanaceChange } from '@//contactLogic/buildr/balance';
import {
  fetchTokenBalance,
  fetchCollateralIndicators,
  fetchCurrencyPrice,
  fetchApprove,
  fetchAllowanceAmount,
  fetchLambdaApprove,
} from '@/contactLogic/buildr/create';


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
    };
  },
  components: {
    ScInput,
    haveSendDialog: () => import("@/components/basic/haveSendDialog.vue"),
    assetDialog: () => import('@/views/buildr/create/assetDialog.vue'),
    Loading: () => import("@/components/basic/loading.vue"),
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress']),
    isReady() {
      return this.ethersprovider && this.ethChainID && this.ethAddress;
    },
    // 验证输入值
    checkValue() {
      if(BigNumber(this.pledgeNumber).isLessThan(0)) {
        return 'Input value must be less than balance and greater than 0';
      } else if (isNaN(this.pledgeNumber)) {
        return 'Input value needs to be a value';
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
    getPools() {
        const collateralPools = getCollateralPools(this.ethChainID);
        this.collateralPools = collateralPools;
        this.defaultPool = collateralPools[0];
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
      this.pledgeNumber = val;
      // this.pledgeNumber = (BigNumber(val).isNaN() || BigNumber(val).isZero()) ? 0 : val;
      this.stableNumber = this.pledgeNumber ? BigNumber(this.pledgeNumber).times(this.currencyPrice).div(this.targetRX) : '';
    },
    async onApproveClick() {
      this.btnloading = true;
      const params = Object.assign({}, this.getParams(), {
        pledgeNumber: this.pledgeNumber,
      });

      // 标准的ERC20合约授权
      // 非标准的ERC20 token 需要单独授权，目前只有LAMB
      // 原生代币不需要授权
      let transaction;
      if(this.defaultPool.isERC20) {
        transaction = await fetchApprove(params);
      } else if(this.defaultPool.token === 'LAMB'){
        transaction = await fetchLambdaApprove(params);
      }

      if (transaction && transaction.hash) {
        const waitdata = await transaction.wait([1]);
        this.btnloading = false;
        // 需要更新数据
        this.loadData();
      } else {
        this.$Notice.error({
          title: 'Approve cancelled',
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
      const tx = await fetchBalanaceChange(joinParams);
      this.sendtx(tx);
    },
    loadData() {
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
        data: this.collateralPools
      });
    },
    setAsset(tokenName) {
      this.defaultPool = this.collateralPools.find(pool => pool.name === tokenName);

      // 更新数据
      this.getCurrencyNumber();
      this.getIndicators();
      this.getCurrencyPrice();
      if(!this.defaultPool.isNative) {
        this.getAllowanceAmount();
      }
    },
    isApprove() {
      return !this.defaultPool.isNative && (BigNumber(this.allowanceAmount).isZero() || BigNumber(this.pledgeNumber).gt(this.allowanceAmount));
    }
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
