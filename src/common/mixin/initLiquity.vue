<script>
import { mapState, mapActions } from "vuex";
import { fetchLiquityStore } from "@/contactLogic/buildr/liquity";
export default {
  data() {
    return {
      liquityReady: false,
    };
  },
  computed: {
    ...mapState(['ethersprovider', 'ethChainID', 'ethAddress']),
    isReady() {
      return this.ethersprovider && this.ethChainID && this.ethAddress;
    },
  },
  methods: {
    ...mapActions('buildr',['setLiquityState']),
    init() {
      const params = {
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account:  this.ethAddress,
      };
      const liquity = fetchLiquityStore(params);
      console.log({liquity});
      liquity.store.onLoaded = () => {
        this.liquityReady = true;
        this.setLiquityState(liquity.store.state);
      };
      liquity.store.start();
    },
  },
  watch: {
    isReady(value) {
      if(value) this.init();
    }
  },
  created() {
    if (this.isReady) {
      this.init();
    }
  }
};

</script>