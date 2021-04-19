import { mapState } from "vuex";
import { readSyntheticHistory } from '@/contactLogic/history.js';

const getStatus = (status) => {
  switch (status) {
    case 1: return 'Executed';
    default: return 'Fail';
  }
};

export default {
  data() {
    return {
      pageNum: 1,
      showNum: 10,
      isMore: true,
      tableData:[
        {
          title: 'Symbol',
          slot: "tokenA",
          minWidth: 150,
        },
        {
          title: 'Action',
          slot: "actions",
          minWidth: 100,
        },
        {
          title: 'Amount',
          slot: "amountA",
          minWidth: 120,
        },
        {
          title: 'Status',
          slot: "status",
          minWidth: 120,
        },
        {
          title: 'Date',
          slot: "date",
          minWidth: 100,
        },
      ],
      list:[]
    };
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress']),
    ...mapState('synth', ['allProducts', 'refresh']),
    isReady() {
      return this.ethersprovider && this.ethChainID && this.ethAddress;
    },
  },
  methods: {
    async loadData() {
      const chainID =  this.ethChainID;
      const account =  this.ethAddress;

      const { count, data } = await readSyntheticHistory(chainID, account, this.pageNum, this.showNum);

      const historyList = data.map((tx) => {
        const amountA = this.web3.utils.fromWei(tx.show.amountA);
        const token = tx.show.tokenA;
        const product = this.allProducts.find((p) => p.token === token);
        const pairCode = product ? product.symbol : token;
        return {
          tokenA: pairCode,
          actions: tx.method_name,
          amountA,
          date: tx.create_time,
          status: getStatus(tx.tx_status)
        };
      });

      this.list = this.list.concat(historyList);

      const pageNum = (count % 10 === 0) ? (count / 10) : (count - (count % 10)) / 10 + 1;
      this.isMore = pageNum !== this.pageNum;
      this.pageNum = pageNum;
    },
    onReachBottom() {
      return new Promise((resolve) => {
        setTimeout(async () => {
          if(this.isMore) {
            await this.loadData();
          }
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
    refresh(value) {
      if (value) {
        this.pageNum = 1;
        this.list = [];
        this.loadData();
      }
    }
  },
  created() {
    if(this.isReady) {
      this.loadData();
    }
  },
};
