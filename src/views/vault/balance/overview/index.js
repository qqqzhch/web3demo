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
    price() {
      return this.liquityState.price.toString();
    },
    totalValue() {
      return this.liquityState.trove.collateral.toString();
    },
    totalDebt() {
      return this.liquityState.trove.debt.toString();
    },
    borrowingRate() {
      return this.liquityState.borrowingRate.toString();
    },
    totalCollateralRatio() {
      const { total, price } = this.liquityState;
      const totalRatio = total.collateralRatio(price).toString();
      return totalRatio;
    },
    redemptionRate() {
      return this.liquityState.redemptionRate.toString();
    }
  },
  methods: {
    // refresh() {
      // this.$parent.loadData();
    // }
  }
};
