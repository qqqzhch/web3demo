import AccountArea from './AccountArea/index.vue';
import AssetsArea from './AssetsArea/index.vue';
import ChartArea from './ChartArea/index.vue';
import OrderFormArea from './OrderFormArea/index.vue';
import OrdersTable from './OrdersTable/index.vue';
import ProductsTable from './ProductsTable/index.vue';
import { fetchSynthScUSDBalance } from "../../contactLogic/synth/assets";
import BigNumber from "bignumber.js";
import { mapActions, mapState } from "vuex";

export default {
  name: 'synth',
  data() {
    return {};
  },
  components: {
    ProductsTable,
    AccountArea,
    AssetsArea,
    ChartArea,
    OrdersTable,
    OrderFormArea
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress']),
    isReady() {
      return this.ethersprovider && this.ethChainID && this.ethAddress;
    },
  },
  methods: {
    ...mapActions('synth', ['setSynthScUSDAmount']),
    getParams() {
      return {
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account:  this.ethAddress,
        web3: this.web3,
      };
    },
    async getSynthScUSDBalance() {
      const params = this.getParams();
      const { scUSDAmount } = await fetchSynthScUSDBalance(params);
      const amount = BigNumber(scUSDAmount).div('1e18').toNumber();
      this.setSynthScUSDAmount(amount);
    }
  },
  watch: {
    isReady(val) {
      val && this.getSynthScUSDBalance();
    }
  },
  created() {
    const { productCode } = this.$route.params;
    if(!productCode) {
      this.$router.push({
        path: '/synth/scbtc_usdt'
      });
    }
    if(this.isReady) {
      this.getSynthScUSDBalance();
    }
  }
};
