import { mapState } from "vuex";

export default {
  name: 'overview',
  components: {
  },
  computed: {
    ...mapState('buildr', ['poolsData']),
    totalValue() {
      return this.poolsData.reduce((acc, pool) => Number(acc) + Number(pool.pledgeNumber),  0);
    },
    totalDebt() {
      return this.poolsData.reduce((acc, pool) => Number(acc) + Number(pool.currentDebt),  0);
    },
    totalMaxMintable() {
      return this.poolsData.reduce((acc, pool) => Number(acc) + Number(pool.maxMintable),  0);
    },
    totalFee() {
      return this.poolsData.reduce((acc, pool) => Number(acc) + Number(pool.maxMintable) * Number(pool.feeRate),  0);
    }
  },
  methods: {}
};
