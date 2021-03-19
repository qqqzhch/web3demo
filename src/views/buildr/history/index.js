import { mapState } from "vuex";
import { readbuildrHistory } from '../../../contactLogic/history';
import { getTokenImg } from '@/contactLogic/readbalance.js';

const getStatus = (status) => {
  switch (status) {
    case 1: return 'Success';
    default: return 'Fail';
  }
};

export default {
  data() {
    return {
      list: [],
      pageNum: 1,
      showNum: 10,
    };
  },
  computed: {
    ...mapState(['web3','ethChainID', 'ethAddress']),
    isReady() {
      return this.ethChainID && this.ethAddress;
    },
    getHistory() {
      const columns = [
        {
          title: "Assets",
          slot: "Assets",
          minWidth: 100,
        },
        {
          title: "Action",
          slot: "Action",
          minWidth: 200,
        },
        {
          title: "Amount",
          slot: "Amount",
          minWidth: 100,
        },
        {
          title: "Date",
          slot: "Date",
          minWidth: 200,
        },
        {
          title: "Status",
          slot: "Status",
          minWidth: 100,
        },
      ];
      return columns;
    },
  },
  methods: {
    getTokenImg(tokensymbol) {
      const chainID = this.ethChainID;
      return getTokenImg(tokensymbol, chainID);
    },
    async loadData() {
      const chainID = this.ethChainID;
      const account =  this.ethAddress;

      const {count, data} = await readbuildrHistory(chainID,account,this.pageNum, this.showNum);

      this.list = data.map((tx) => {
        const amount = this.web3.utils.fromWei(tx.show.amount);
        return {
          assets: tx.show.tokenA,
          actions: tx.method_name,
          amount,
          date: tx.create_time,
          status: getStatus(tx.tx_status)
        };
      });

      this.pageNum = count % this.showNum === 0 ? this.pageNum + 1 : this.pageNum;
    },
    onReachBottom() {
      return new Promise((resolve) => {
        setTimeout(async () => {
          await this.loadData();
          resolve({});
        }, 1);
      });
    },
  },
  watch: {
    isReady(value) {
      if (value) {
        this.loadData();
      }
    },
  },
  created() {
    if(this.isReady) {
      this.loadData();
    }
  },
};
