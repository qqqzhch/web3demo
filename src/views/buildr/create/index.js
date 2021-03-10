import { mapState } from 'vuex';
import ScInput from '../components/ScInput.vue';
import ScSelect from '../components/ScSelect.vue';
import { fetchTokenBalance, fetchCollateralIndicators, fetchCurrencyPrice } from '@/contactLogic/buildr/create';

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
      feeRate: 0,    //稳定费率
      debtCap: 0,
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
    async getCurrencyNumber() {
      const params = {
        currency: this.currency,
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account:  this.ethAddress,
      };

      this.currencyNumber = await fetchTokenBalance(params);
    },
    async getIndicators() {
      const params = {
        chainID: this.ethChainID,
        account:  this.ethAddress,
        library: this.ethersprovider,
        tokenName: this.currency,
        web3: this.web3
      };
      const { targetRatio, liquidationRatio, feeRate, debtCap } = await fetchCollateralIndicators(params);
      // console.log(debtCap, 9999)
      this.targetRatio = targetRatio ? 1 / targetRatio : 0;
      this.liquidationRatio = liquidationRatio ? 1 / liquidationRatio : 0;
      this.feeRate = feeRate;
      this.debtCap = debtCap;
    },
    async getCurrencyPrice() {
      const params = {
        chainID: this.ethChainID,
        account:  this.ethAddress,
        library: this.ethersprovider,
        tokenName: this.currency,
        web3: this.web3
      };
      const { currencyPrice } = await fetchCurrencyPrice(params);

      console.log(currencyPrice, 3333);

    },
    onChangePledgeNumber(val) {
      this.pledgeNumber = val;
      this.stableNumber = val / this.targetRatio;

      this.getCurrencyPrice();
    }
  },
  created() {
    this.getCurrencyNumber();
    this.getIndicators();
    this.getCurrencyPrice();
  }
};
