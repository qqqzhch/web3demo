import AccountArea from './AccountArea/index.vue';
import AssetsArea from './AssetsArea/index.vue';
import ChartArea from './ChartArea/index.vue';
import OrderFormArea from './OrderFormArea/index.vue';
import OrdersTable from './OrdersTable/index.vue';
import ProductsTable from './ProductsTable/index.vue';

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
  }
};
