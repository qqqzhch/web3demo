<script>
import { mapState, mapActions } from 'vuex';
import { fetchLiquityEntity } from '@/contactLogic/buildr/liquity';
import { AddressZero } from '@ethersproject/constants';
import { EthersLiquity, _connectByChainId } from '@webfans/lib-ethers';
import event from '@/common/js/event';
import Vue from 'vue';

const debounce = require('debounce');

let isSubscribe = false;
let liquity;

export default {
  inject: ['reload'],
  data() {
    return {
      liquityReady: false,
      AddressZero,
      undefinedAddress: 'undefined'
    };
  },
  computed: {
    ...mapState(['ethersprovider', 'ethChainID', 'ethAddress']),
    isReady() {
      return this.ethersprovider && this.ethChainID && this.undefinedAddress;
    },
    isConnect() {
      return this.ethersprovider && this.ethChainID && this.ethAddress;
    }
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
    init: debounce(function() {
      console.log('init');

          const params = {
            chainID: this.ethChainID,
            library: this.ethersprovider,
            account: this.ethAddress,
          };
          
          
          liquity = fetchLiquityEntity(params);
        
          console.log('init store');
          liquity.store.onLoaded = () => {

            this.setLiquityState(liquity.store.state);

            this.liquityReady = true;

            this.getLiquityInstance();

            console.log(liquity.store.state);
          };
        if(isSubscribe === false && this.ethAddress) {


            liquity.store.subscribe(({ newState, oldState }) => {
              console.log(newState, oldState );
              this.setLiquityState(newState);
            });
            isSubscribe = true;
            
        }else{
          this.liquityReady = true;
        }
        liquity.store.start();

      
    },1000),



  },
  watch: {
    isReady(value) {
      // console.log('isReady');
      if (value) this.init();
    },
    isConnect(value) {
      // console.log('isConnect');
      if (value) this.init();
    }
  },
  created() {
    if (this.isReady) {
      this.init();
    }
  },
  mounted() {
    event.$on('txsuccess', () => {
      if(this.$route.name=='lpPool'){
        this.reload();
      }

    });
  },
};
</script>
