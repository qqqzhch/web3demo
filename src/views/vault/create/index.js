import { mapState } from 'vuex';
import BigNumber from "bignumber.js";
import event from '@/common/js/event';
import { getTokenImg } from '@/contactLogic/readbalance.js';
import ScInput from '../components/ScInput.vue';
import { getCollateralPools } from '@/contactLogic/buildr/balance';
import i18n from '../../../i18n/index.js';

// import { LUSD_MINIMUM_DEBT } from "@liquity/lib-base";
import { openTrove, calcTroveIndicators, stableName, LUSD_MINIMUM_DEBT } from '../../../contactLogic/buildr/liquity';
import { liquityValidate } from '../../../contactLogic/buildr/validate';


export default {
  name: 'create',
  data() {
    return {
      stableName,
      currencyNumber: 0, // 资产数量
      collateralPools: [], // 合约池
      defaultPool: {},
      BigNumber,
      depositAmount: 0,
      borrowAmount: 0,
      errorInfo: '',
      btnLoading: false
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
      const data = {
        stableName: this.stableName,
        depositAmount: this.depositAmount,
        borrowAmount: this.borrowLUSDAmount
      };
      if(this.$route.name === 'create') {
        this.$refs.haveSendtx.open(data, 'ok');
      }
    });
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress']),
    ...mapState('buildr', ['liquityState', "isOpen"]),
    isReady() {
      return this.ethersprovider && this.ethChainID && this.ethAddress;
    },
    troveIndicators(){
      return calcTroveIndicators(this.liquityState, this.depositAmount, this.borrowAmount);
    },
    accountBalance() {
     return this.liquityState.accountBalance.toString();
    },
    // 计算借贷净值 = Debt - 清算准备金 - 净值*借贷费率 + 0.000001(精度问题)
    borrowLUSDAmount() {
      const { liquidationReserve, borrowingRate } = this.troveIndicators;
      return this.borrowAmount < 20 ? 0 : BigNumber(this.borrowAmount).minus(liquidationReserve).div(BigNumber(1).plus(borrowingRate)).plus(0.000001).toNumber();
    }
  },
  methods: {
    getTokenImg(tokensymbol){
      const chainID = this.ethChainID;
      return getTokenImg(tokensymbol,chainID);
    },
    // check金库是否已创建
    checkIsOpen() {
      if(this.isOpen) {
        this.$router.push('/vault/balance');
      } else {
        this.getPools();
      }
    },
    getPools() {
        this.collateralPools = getCollateralPools(this.ethChainID);
        this.defaultPool = this.collateralPools[0];
    },
    validate() {
      let errorInfo = '';
      if(BigNumber(this.depositAmount).lt(0)) {
        errorInfo = i18n.t('notice.swapNotice.n2');
      } else if (isNaN(this.depositAmount)) {
        errorInfo = i18n.t('notice.buidrNotice.n1');
      } else {
        const params = {
          state: this.liquityState,
          trove: this.liquityState.trove,
          borrowingRate: this.liquityState.borrowingRate,
          depositAmount: this.depositAmount,
          borrowAmount: this.borrowAmount,
        };
        errorInfo = liquityValidate(params);
      }
      this.errorInfo = errorInfo;
    },
    onChangeDepositAmount(val) {
      this.depositAmount = val || 0;
      if (this.depositAmount && !this.borrowAmount) {
        this.borrowAmount = LUSD_MINIMUM_DEBT;
      }
      this.validate();
    },
    onChangeBorrowAmount(val) {
      this.borrowAmount = val || 0;
      this.validate();
    },
    getParams() {
      const { token } = this.defaultPool;
      return {
        tokenName: token,
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account:  this.ethAddress,
        web3: this.web3,
      };
    },
    async onOpenTroveClick() {
      if(!this.depositAmount || !this.borrowLUSDAmount) {
        this.errorInfo = i18n.t('notice.swapNotice.n2');
        return ;
      }

      const params = {
        ...this.getParams(),
        borrowLUSDAmount: this.borrowLUSDAmount,
        depositAmount: this.depositAmount,
        liquityState: this.liquityState,
      };

      this.btnLoading = true;
      try {
        const tx = await openTrove(params);
        this.sendtx(tx);
      } catch (e) {
        this.btnLoading = false;
      }
    },
    sendtx(tx) {
      if(tx && tx.base){
        this.$refs.haveSendtx.open(tx.base, 'created');
        event.$emit('sendtx',[tx.transaction.rawSentTransaction, {
          okinfo: tx.base+' '+i18n.t('vault-success'),
          failinfo: tx.base+' '+i18n.t('vault-Fail')
        }]);
      } else {
        this.$Notice.error({
          title: i18n.t('notice.buidrNotice.n3'),
        });
      }
    },
  },
  watch: {
    isReady(value) {
      if (value) {
        this.checkIsOpen();
      }
    },
  },
  created() {
    if(this.isReady) {
      this.checkIsOpen();
    }
  }
};
