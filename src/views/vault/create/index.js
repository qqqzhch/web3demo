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
      borrowAmount: 1800,
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
        this.loadData();
      }
    },
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

    onChangeDepositAmount(val) {
      this.depositAmount = val || '';
      if (this.depositAmount) {
        this.borrowAmount = 2000;
      }
    },
    onChangeBorrowAmount(val) {
      this.borrowAmount = val || '';
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
    loadData() {
      this.getCurrencyNumber();
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
