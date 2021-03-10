import Overview from './overview/index.vue';
import BalanceView from './balance/index.vue';
import ManageView from './manage/index.vue';
import CreateView from './create/index.vue';

export default {
  name: 'Buildr',
  data() {
    return {
      isExistBalance: false
    };
  },
  components: {
    Overview,
    BalanceView,
    ManageView,
    CreateView
  },
};
