import { readbuildrHistory } from '../../../contactLogic/history';
import {mapState} from "vuex";

export default {
  name: 'history',
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress']),
    isReady() {
      return this.ethersprovider && this.ethChainID && this.ethAddress;
    },
  },
  methods: {
    async loadData() {
      const chainID = this.ethChainID;
      const library = this.ethersprovider;
      const account =  this.ethAddress;
      const pageNum = 10;
      const showNum = 10;

      const data = await readbuildrHistory(chainID,account,pageNum,showNum);
      console.log(data, 3333);
    }
  },
  watch: {
    isReady(value) {
      if (value) {
        this.loadData();
      }
    },
  },
  created() {
    console.log(this.isReady, 9999222);
    // if(this.isReady) {
      this.loadData();
    // }
  }
};
