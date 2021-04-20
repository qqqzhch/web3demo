import { mapState } from 'vuex';
import BigNumber from "bignumber.js";
import event from '@/common/js/event';
import { getTokenImg } from '@/contactLogic/readbalance.js';
import ScInput from '../components/ScInput.vue';
import { getCollateralPools } from '@/contactLogic/buildr/balance';
import { fetchTokenBalance } from '@/contactLogic/buildr/create';
import i18n from '../../../i18n/index.js';

import { openTrove, calcTroveIndicators } from '../../../contactLogic/buildr/liquity';

export default {
  name: 'create',
  data() {
    return {
      currencyNumber: 0, // 资产数量
      collateralPools: [], // 合约池
      defaultPool: {},
      BigNumber,
      btnloading: false,
      depositAmount: 0,
      borrowLUSDAmount: 1800,
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
        depositAmount: this.depositAmount
      };
      this.$refs.haveSendtx.open(currPool, 'ok');
      this.loadData();
    });
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress']),
    ...mapState('buildr', ['liquityState']),
    isReady() {
      return this.ethersprovider && this.ethChainID && this.ethAddress;
    },
    // 验证输入值
    checkValue() {
      if(BigNumber(this.depositAmount).isLessThan(0)) {
        return i18n.t('notice.swapNotice.n2');
      } else if (isNaN(this.depositAmount)) {
        return i18n.t('notice.buidrNotice.n1');
      } else {
        return 'ok';
      }
    },
    troveIndicators(){
      return calcTroveIndicators(this.liquityState, this.depositAmount, this.borrowLUSDAmount);
    },
  },
  methods: {
    getTokenImg(tokensymbol){
      const chainID = this.ethChainID;
      return getTokenImg(tokensymbol,chainID);
    },
    // check金库是否已创建
    // async checkPoolsEnable() {
      // const loadList = [];
      // this.collateralPools.forEach((pool) => {
      //   const params = Object.assign({}, this.getParams(), {tokenName: pool.token});
      //   loadList.push(fetchPledgeNumber(params));
      // });
      // const result = await Promise.all(loadList);

      // const poolsEnable = {};
      // let selected = false;
      // this.collateralPools.forEach((pool, index) => {
        // const { pledgeNumber } = result[index];
        // const isCreated = BigNumber(pledgeNumber).gt(0);
        // poolsEnable[pool.token] = isCreated;
        // if(!isCreated && selected === false) {
        //   this.defaultPool = pool;
          // selected = true;
          // this.loadData();
        // }
      // });
      // this.poolsEnable = poolsEnable;
      // 如果都已传教返回管理页面
      // if(selected === false) {
      //   this.$router.push('/buildr/balance');
      // }
    // },
    getPools() {
        const collateralPools = getCollateralPools(this.ethChainID);
        this.collateralPools = collateralPools;
        this.defaultPool = this.collateralPools[0];
        this.loadData();
        // this.checkPoolsEnable();
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
    // async getIndicators() {
    //   const params = this.getParams();
    //   const { targetRatio, liquidationRatio, feeRate, debtCap } = await fetchCollateralIndicators(params);
    //
    //   this.targetRX = BigNumber(targetRatio).isZero() ? 0 : BigNumber(1).div(targetRatio);
    //   this.liquidationRatio = BigNumber(liquidationRatio).isZero() ? 0 : BigNumber(1).div(liquidationRatio);
    //   this.feeRate = feeRate;
    //   this.debtCap = debtCap;
    // },
    // async getCurrencyPrice() {
    //   const params = this.getParams();
    //   const { currencyPrice } = await fetchCurrencyPrice(params);
    //
    //   this.currencyPrice = currencyPrice;
    // },
    onChangeDepositAmount(val) {
      this.depositAmount = val || '';
      if (this.depositAmount) {
        this.borrowLUSDAmount = 2000;
      }
      // this.pledgeNumber = (BigNumber(val).isNaN() || BigNumber(val).isZero()) ? 0 : val;
      // this.stableNumber = this.pledgeNumber ? BigNumber(this.pledgeNumber).times(this.currencyPrice).div(this.targetRX) : '';
    },
    onChangeLUSDAmount(val) {
      this.borrowLUSDAmount = val || '';
    },
    // async onApproveClick() {
    //   if(!this.pledgeNumber) return;
    //
    //   const params = Object.assign({}, this.getParams(), {
    //     pledgeNumber: this.pledgeNumber,
    //   });
    //
    //   // 标准的ERC20合约授权
    //   // 非标准的ERC20 token 需要单独授权，目前只有LAMB
    //   // 原生代币不需要授权
    //   let transaction;
    //   this.btnloading = true;
    //   if(this.defaultPool.isERC20) {
    //     transaction = await fetchApprove(params);
    //   } else if(this.defaultPool.token === 'LAMB'){
    //     transaction = await fetchLambdaApprove(params);
    //   }
    //
    //   if (transaction && transaction.hash) {
    //     const waitdata = await transaction.wait([1]);
    //     this.btnloading = false;
    //     // 需要更新数据
    //     this.loadData(true);
    //   } else {
    //     this.$Notice.error({
    //       title: i18n.t('notice.buidrNotice.n2'),
    //     });
    //     this.btnloading = false;
    //   }
    // },
    // async getAllowanceAmount(){
    //   const params = this.getParams();
    //   const { allowanceAmount } = await fetchAllowanceAmount(params);
    //   this.allowanceAmount = allowanceAmount;
    // },
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
    // async onJoinClick() {
    //   const params = this.getParams();
    //   const { isNative, isERC20 } = this.defaultPool;
    //   const type = isNative ? 'joinNative' : isERC20 ? 'joinERC20' :'join';
    //   const joinParams = {
    //     ...params,
    //     type,
    //     coinAmount: this.pledgeNumber,
    //     unit: this.defaultPool.token,
    //   };
    //   if(this.pledgeNumber) {
    //     const tx = await fetchBalanaceChange(joinParams);
    //     this.sendtx(tx);
    //   }
    // },
    async onOpenTroveClick() {
      const params = {
        ...this.getParams(),
        depositAmount: this.depositAmount,
        borrowLUSDAmount: this.borrowLUSDAmount,
        liquityState: this.liquityState,
      };
      const tx = await openTrove(params);
      this.sendtx(tx);
    },
    loadData() {
      this.getCurrencyNumber();
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
