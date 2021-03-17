import { mapState } from 'vuex';
import BigNumber from "bignumber.js";
import event from '@/common/js/event';
import ScInput from '../components/ScInput.vue';
import { collateralPools, fetchBalanaceChange } from '@//contactLogic/buildr/balance';
import {
  fetchTokenBalance,
  fetchCollateralIndicators,
  fetchCurrencyPrice,
  fetchApprove,
  fetchAllowanceAmount,
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
      collateralPools: collateralPools,
      defaultPoolToken: collateralPools[0].token,
      BigNumber,
    };
  },
  components: {
    ScInput,
    haveSendDialog: () => import("@/components/basic/haveSendDialog.vue"),
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress']),
    isReady() {
      return this.ethersprovider && this.ethChainID && this.ethAddress;
    },
  },
  methods: {
    getParams() {
      return {
        tokenName: this.defaultPoolToken,
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
      this.stableNumber = BigNumber(val).times(this.currencyPrice).div(this.targetRX);
    },
    async onApproveClick() {
      const params = Object.assign({}, this.getParams(), {
        pledgeNumber: this.pledgeNumber,
      });
      const result = await fetchApprove(params);
      if (result && result.hash) {
        // this.$parent.onChangeNav(2);
        this.getAllowanceAmount();
      }
    },
    async getAllowanceAmount(){
      const params = this.getParams();
      const { allowanceAmount } = await fetchAllowanceAmount(params);
      this.allowanceAmount = allowanceAmount;
    },
    sendtx(tx) {
      this.$refs.haveSendtx.open(tx.base);
      event.$emit('sendtx',[tx.response, {
        okinfo: tx.base+"成功",
        failinfo: tx.base+'失败'
      }]);
      setTimeout(() => this.$router.push(`/buildr/balance`), 3000);
    },
    // Join
    async onJoinClick() {
      const params = this.getParams();
      const joinParams = {
        ...params,
        type: 'join',
        coinAmount: this.pledgeNumber,
        unit: this.defaultPoolToken,
      };
      const tx = await fetchBalanaceChange(joinParams);
      this.sendtx(tx);
    },
    loadData() {
      this.getCurrencyNumber();
      this.getIndicators();
      this.getCurrencyPrice();
      this.getAllowanceAmount();
    },
  },
  watch: {
    defaultPoolToken() {
      this.loadData();
    }
  },
  created() {
    console.log(this.isReady, 8888);
    if(this.isReady) {
      this.loadData();
    }
  }
};
