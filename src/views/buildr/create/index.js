import { mapState } from 'vuex';
import ScInput from '../components/ScInput.vue';
import ScSelect from '../components/ScSelect.vue';
import {
  fetchTokenBalance,
  fetchCollateralIndicators,
  fetchCurrencyPrice,
  fetchApprove
} from '@/contactLogic/buildr/create';

export default {
  name: 'create',
  data() {
    return {
      currency: 'LAMB',
      currencyNumber: 0, // 资产数量
      pledgeNumber: 0,   // 质押币数量
      stableNumber: 0,   // 稳定币数量
      targetRatio: 0,          // 抵押率
      liquidationRatio: 0,  // 清算抵押率
      feeRate: 0,    // 稳定费率
      debtCap: 0,    // 全球scUSD债务上限
      currencyPrice: 0,
    };
  },
  components: {
    ScInput,
    ScSelect
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress'])
  },
  methods: {
    getParmas() {
      return {
        tokenName: this.currency,
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account:  this.ethAddress,
        web3: this.web3,
      };
    },
    async getCurrencyNumber() {
      const params = this.getParmas();
      this.currencyNumber = await fetchTokenBalance(params);
    },
    async getIndicators() {
      const params = this.getParmas();
      const { targetRatio, liquidationRatio, feeRate, debtCap } = await fetchCollateralIndicators(params);

      this.targetRatio = targetRatio ? 1 / targetRatio : 0;
      this.liquidationRatio = liquidationRatio ? 1 / liquidationRatio : 0;
      this.feeRate = feeRate;
      this.debtCap = debtCap;
    },
    async getCurrencyPrice() {
      const params = this.getParmas();
      const { currencyPrice } = await fetchCurrencyPrice(params);

      this.currencyPrice = currencyPrice;
    },
    onChangePledgeNumber(val) {
      this.pledgeNumber = val;
      this.stableNumber = val  * this.currencyPrice / this.targetRatio;
    },
    async onApproveClick() {
      const params = Object.assign({}, this.getParmas(), {
        pledgeNumber: this.pledgeNumber,
      });
      const result = await fetchApprove(params);
      if (result && result.hash) {
        this.$parent.onChangeNav(2);
      }
    }
  },
  created() {
    this.getCurrencyNumber();
    this.getIndicators();
    this.getCurrencyPrice();
  }
};
