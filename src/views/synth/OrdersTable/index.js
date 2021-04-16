export default {
  data() {
    return {
      tableData:[
        {
          title: 'Symbol',
          slot: "Symbol",
          minWidth: 150,
        },
        {
          title: 'Action',
          slot: "Action",
          minWidth: 100,
        },
        {
          title: 'Amount',
          slot: "Amount",
          minWidth: 120,
        },
        {
          title: 'Status',
          slot: "Status",
          minWidth: 120,
        },
        {
          title: 'Status',
          slot: "Date",
          minWidth: 100,
        },
      ],
      list:[
        {
          Symbol:'AAPL',
          Amount:'19284.24',
          Action:'Buy',
          Status:'Executed',
          Date:'2021/3/24',
        },
        {
          Symbol:'scUSD',
          Amount:'224.24',
          Action:'Withdraw',
          Status:'Fail',
          Date:'2021/3/24',
        },
        {
          Symbol:'scUSD',
          Amount:'8472.39',
          Action:'Transfer',
          Status:'Fail',
          Date:'2021/3/24',
        },

      ]
    };
  }
};
