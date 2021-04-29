import { mapState } from "vuex";
import BigNumber from "bignumber.js";
import { stableName } from '../../../../contactLogic/buildr/liquity';

export default {
  name: 'overview',
  data() {
    return {
      stableName,
      BigNumber
    };
  },
  computed: {
    ...mapState('buildr', ['liquityState']),
    isPC() {
      return window.screen.width > 1200;
    },
    price() {
      return this.liquityState.price.toString();
    },
    totalValue() {
      return this.liquityState.total.collateral.toString();
    },
    totalDebt() {
      return this.liquityState.total.debt.toString();
    },
    borrowingRate() {
      return this.liquityState.borrowingRate.toString();
    },
    totalCollateralRatio() {
      const { total, price } = this.liquityState;
      const totalRatio = total ?  total.collateralRatio(price).toString() : 0;
      return totalRatio;
    },
    redemptionRate() {
      return this.liquityState.redemptionRate.toString();
    },
    totalVaults() {
      return this.liquityState.numberOfTroves.toString();
    },
  },
  methods: {
    // refresh() {
      // this.$parent.loadData();
    // }
  }
};
