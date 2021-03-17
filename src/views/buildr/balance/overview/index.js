import { mapState } from "vuex";
import BigNumber from "bignumber.js";

export default {
  name: 'overview',
  data() {
    return {
      BigNumber
    };
  },
  components: {
  },
  computed: {
    ...mapState('buildr', ['poolsData']),
    totalValue() {
      return this.poolsData.reduce((acc, pool) => BigNumber(acc).plus(pool.pledgeNumber),  0);
    },
    totalDebt() {
      return this.poolsData.reduce((acc, pool) => BigNumber(acc).plus(pool.currentDebt),  0);
    },
    totalMaxMintable() {
      return this.poolsData.reduce((acc, pool) => BigNumber(acc).plus(pool.maxMintable),  0);
    },
    totalFee() {
      return this.poolsData.reduce((acc, pool) => BigNumber(pool.currentDebt).times(pool.feeRate).plus(acc),  0);
    }
  },
  methods: {}
};