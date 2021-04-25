<script>
import { mapState, mapActions } from 'vuex';
import { fetchLiquityEntity } from '@/contactLogic/buildr/liquity';
import { AddressZero } from '@ethersproject/constants';
import { EthersLiquity, _connectByChainId } from '@webfans/lib-ethers';
import event from '@/common/js/event';
export default {
  inject: ['reload'],
  data() {
    return {
      liquityReady: false,
      AddressZero,
    };
  },
  computed: {
    ...mapState(['ethersprovider', 'ethChainID', 'ethAddress']),
    isReady() {
      return this.ethersprovider && this.ethChainID ;
    },
  },
  methods: {
    ...mapActions('buildr', ['setLiquityState']),
    ...mapActions('pool', ['setLiquityMethods']),
    getLiquityInstance() {
      const provider = this.ethersprovider;
      const account = this.ethAddress;
      const chainId = this.ethChainID;
      
      const connection = _connectByChainId(provider, account?provider.getSigner(account):undefined, chainId, {
        userAddress: account,
        frontendTag: AddressZero,
        useStore: 'blockPolled',
      });
      const liquity = EthersLiquity._from(connection);
      this.setLiquityMethods(liquity);
    },
    init() {
      const params = {
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account: this.ethAddress,
      };
      const liquity = fetchLiquityEntity(params);
      liquity.store.onLoaded = () => {
        this.setLiquityState(liquity.store.state);
        this.getLiquityInstance();
        console.log(liquity.store.state);
      };

      liquity.store.subscribe(({ newState, oldState }) => {
        this.setLiquityState(newState);
      });

      liquity.store.start();
    },
  },
  watch: {
    isReady(value) {
      if (value) this.init();
    },
  },
  created() {
    if (this.isReady) {
      this.init();
    }
  },
  mounted() {
    event.$on('txsuccess', () => {
      this.reload();
    });
  },
};
</script>