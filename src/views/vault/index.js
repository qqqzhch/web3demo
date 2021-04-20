import { mapState, mapActions } from "vuex";
import { fetchLiquityStore } from "../../contactLogic/buildr/liquity";


export default {
  name: 'Vault',
  data() {
    return {
      nav: '',
      liquityReady: false,
      isCreate: false,
    };
  },
  computed: {
    ...mapState(['ethersprovider', 'ethChainID', 'ethAddress']),
    ...mapState('buildr', ['allPoolsEnable', "isOpen"]),
    isReady() {
      return this.ethersprovider && this.ethChainID && this.ethAddress;
    },
  },
  methods: {
    ...mapActions('buildr', ['setLiquityState']),
    init() {
      const params = {
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account:  this.ethAddress,
      };
      const liquity = fetchLiquityStore(params);

      liquity.store.onLoaded = () => {
        // console.log(liquity.store.state.price.toString(), 9999)
        this.liquityReady = true;
        this.setLiquityState(liquity.store.state);
      };

      // liquity.store.subscribe(({ newState, oldState }) => {
      //   console.log(oldState.price.toString(), newState.price.toString(), 888)
      //   // Try to liquidate whenever the price drops
      //   if (newState.price.lt(oldState.price)) {
      //     // tryToLiquidate(liquity);
      //   }
      // });
      liquity.store.start();
    },
    toPage(name) {
      this.nav = name;
      switch (name) {
        case 'balance':
          this.$router.push(`/vault/balance`);
          break;

        case 'create':
          this.$router.push(`/vault/create`);
          break;

        // case 'history':
        //   this.$router.push(`/buildr/history`);
        //   break;

        default:
          this.$router.push(`/vault/balance`);
          break;
      }
    },
  },
  components: {
    Loading: () => import("@/components/basic/loading.vue"),
  },
  watch: {
    isReady(value) {
      if(value) this.init();
    }
  },
  created() {
    this.nav = this.$route.name;
    if (this.isReady) {
      this.init();
    }
  }
};
