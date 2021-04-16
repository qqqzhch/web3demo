import token from '@/constants/token.json';
import config from '@/config/config.js';
import { getTokenImg } from '@/contactLogic/readbalance.js';
import BigNumber from 'bignumber.js';
import {mapActions, mapState} from 'vuex';
import event from '@/common/js/event';
import { fetchAccountNetValue } from '@/contactLogic/synth/assets';

export default {
  data() {
    return {
      BigNumber,
      scUSDBalance: '',
      accountNetValue: 0,
    };
  },
  components: {
    withdrawDialog: () => import('../components/WithdrawDialog.vue'),
    depositDialog: () => import('../components/DepositDialog.vue'),
  },
  computed: {
    ...mapState(['ethChainID', 'ethAddress', 'ethersprovider', 'web3']),
    ...mapState('synth', ['assetTotalValue', 'synthScUSDAmount', "refresh"]),
    isReady() {
      return this.ethChainID && this.ethersprovider && this.ethAddress && this.web3;
    },
    totalScUSD() {
      return BigNumber(this.synthScUSDAmount).plus(this.assetTotalValue).toNumber();
    },
    totalDebt() {
      return BigNumber(this.accountNetValue).minus(this.totalScUSD).toNumber();
    }
  },
  methods: {
    ...mapActions('synth', ['setRefresh']),
    getTokenImg(tokensymbol){
      const chainID = this.ethChainID;
      return getTokenImg(tokensymbol,chainID);
    },
    openDialog() {
      this.$refs.withDialog.open();
    },
    openDepositDialog() {
      this.$refs.DepositDialog.open(this.scUSDBalance);
    },
    // 获取scUSD余额
    async getSCUSDBalance() {
      const [scUSDItem] = token.tokens.filter(item => item.name === 'SuperCash scUSD' && item.chainId === this.ethChainID);
      const contractAddress = scUSDItem.address;
      const abi = config.erc20Abi;
      const contract = new this.web3.eth.Contract(abi, contractAddress);
      try {
        const res = await contract.methods.balanceOf(this.ethAddress).call();
        let result = new BigNumber(res).div("1e18").decimalPlaces(2).toNumber();
        if (isNaN(result)) {
          result = 0;
        }
        this.scUSDBalance = result;
      } catch (error) {
        console.log(error);
      }
    },
    async getNetValue() {
      const params = {
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account:  this.ethAddress,
        web3: this.web3,
        amount: this.totalScUSD,
      };
      const { netValue } = await fetchAccountNetValue(params);
      this.accountNetValue = netValue;
      this.setRefresh(false);
    }
  },
  watch: {
    isReady(val) {
      if (val) {
        this.getSCUSDBalance();
      }
    },
    totalScUSD() {
      this.getNetValue();
    },
    refresh(value) {
      if(value) {
        this.getNetValue();
      }
    }
  },
  created() {
    if (this.isReady) {
      this.getSCUSDBalance();
    }
  },
  mounted() {
    event.$on('txsuccess',()=>{
      this.getSCUSDBalance();
    });
  }
};
