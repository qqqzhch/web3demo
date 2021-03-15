import Overview from './overview/index.vue';
import BalanceView from './balance/index.vue';
import ManageView from './manage/index.vue';
import CreateView from './create/index.vue';
import TransactionHistory from './transaction-history/index.vue';

export default {
  name: 'Buildr',
  data() {
    return {
      pageIndex: 2, // 1 创建 2 管理金库，3 历史记录
    };
  },
  components: {
    Overview,
    BalanceView,
    ManageView,
    CreateView,
    TransactionHistory
  },
  methods: {
    onChangeNav(value) {
      this.pageIndex = value;
    }
  }
};
