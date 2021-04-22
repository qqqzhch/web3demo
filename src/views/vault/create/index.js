import { mapState } from 'vuex';
import BigNumber from "bignumber.js";
import event from '@/common/js/event';
import { getTokenImg } from '@/contactLogic/readbalance.js';
import ScInput from '../components/ScInput.vue';
import { getCollateralPools } from '@/contactLogic/buildr/balance';
import i18n from '../../../i18n/index.js';

import { LUSD_MINIMUM_DEBT } from "@liquity/lib-base";
import { openTrove, calcTroveIndicators } from '../../../contactLogic/buildr/liquity';
import { liquityValidate } from '../../../contactLogic/buildr/validate';

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
      borrowAmount: 0,
      errorInfo: null
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
        depositAmount: this.depositAmount,
        borrowAmount: this.borrowAmount
      };
      this.$refs.haveSendtx.open(data, 'ok');
      this.loadData();
    });
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress']),
    ...mapState('buildr', ['liquityState', "isOpen"]),
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
      return calcTroveIndicators(this.liquityState, this.depositAmount, this.borrowAmount);
    },
    accountBalance() {
     return this.liquityState.accountBalance.toString();
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
      const params = {
        state: this.liquityState,
        trove: this.liquityState.trove,
        borrowingRate: this.liquityState.borrowingRate,
        depositAmount: this.depositAmount,
        borrowAmount: this.borrowAmount,
      };
      this.errorInfo = liquityValidate(params);
    },
    onChangeDepositAmount(val) {
      this.depositAmount = val || '';
      if (this.depositAmount) {
        this.borrowAmount = LUSD_MINIMUM_DEBT;
      }
      this.validate();
    },
    onChangeBorrowAmount(val) {
      this.borrowAmount = val || '';
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
      const params = {
        ...this.getParams(),
        depositAmount: this.depositAmount,
        borrowLUSDAmount: this.borrowAmount,
        liquityState: this.liquityState,
      };
      const tx = await openTrove(params);
      this.sendtx(tx);
    },
    sendtx(tx) {
      if(tx && tx.base){
        this.$refs.haveSendtx.open(tx.base, 'created');
        event.$emit('sendtx',[tx.transaction.rawSentTransaction, {
          okinfo: tx.base+ i18n.t('swapConfirm.successCom'),
          failinfo: tx.base+ i18n.t('swapConfirm.failCom')
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
