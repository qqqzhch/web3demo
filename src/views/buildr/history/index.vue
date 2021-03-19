<template>
  <div class="content-wapper">
    <div class="earn-wapper">
      <p class="earn-title">
        History
      </p>
      <Scroll :loading-text="'loading....'" :height="400">
        <div class="list-wapper">
          <Table :columns="getHistory" :data="list">
            <template slot="Assets" slot-scope="{ row}">
              <div class=" Assets">
                <div class="imgages-warpper">
                  <img src="../../../assets/img/lambda48.svg" class="images">
                </div>
                <p>
                  {{ row.assets }}
                </p>
              </div>
            </template>
            <template slot="Action" slot-scope="{ row}">
              <div class="Action">
                <p class="action">
                  {{ row.actions }}
                </p>
              </div>
            </template>
            <template slot="Amount" slot-scope="{ row}">
              <div class="Amount">
                <p class="amount">
                  {{ row.amount }}
                </p>
              </div>
            </template>
            <template slot="Date" slot-scope="{ row}">
              <div class="Date">
                <p class="date">
                  {{ row.date }}
                </p>
              </div>
            </template>
            <template slot="Status" slot-scope="{ row}">
              <div class="Status">
                <p class="status success">
                  {{ row.status }}
                </p>
              </div>
            </template>
          </Table>
        </div>
      </Scroll>
    </div>
  </div>
</template>

<script>
  import { readbuildrHistory } from '../../../contactLogic/history';
  import {mapState} from "vuex";
export default {
  data() {
    return {
      list: [
        {
          assets:'LAMB',
          actions:'Collateral',
          amount:'1234',
          date:'2021/03/04 ',
          status:'Success'
        },
        {
          assets:'scUSD',
          actions:'Generate scUSD',
          amount:'1234',
          date:'2021/03/04 ',
          status:'Success'
        },
        {
          assets:'scUSD',
          actions:'Payback scUSD',
          amount:'1234',
          date:'2021/03/04 ',
          status:'Success'
        }
      ],
    };
  },
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
    if(this.isReady) {
    this.loadData();
    }
  }
  // computed: {
  //   getHistory() {
  //     const columns = [
  //       {
  //         title: "Assets",
  //         slot: "Assets",
  //         minWidth: 100,
  //       },
  //       {
  //         title: "Action",
  //         slot: "Action",
  //         minWidth: 200,
  //       },
  //       {
  //         title: "Amount",
  //         slot: "Amount",
  //         minWidth: 100,
  //       },
  //       {
  //         title: "Date",
  //         slot: "Date",
  //         minWidth: 200,
  //       },
  //       {
  //         title: "Status",
  //         slot: "Status",
  //         minWidth: 100,
  //       },
  //     ];
  //     return columns;
  //   },
  // },
};
</script>

<style lang="less" scoped>
.content-wapper {
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  margin: 20px 0 100px 100px;
  padding: 44px;
  .earn-wapper {
    .earn-title {
      font-size: 20px;
      padding: 0 16px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #14171c;
      line-height: 24px;
      margin-bottom: 5px;
    }
    .list-wapper {
      p {
        height: 19px;
        font-size: 16px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #14171c;
        line-height: 19px;
      }
      .Assets {
        display: flex;
        align-items: center;
        .imgages-warpper {
          display: flex;
          margin-right: 6px;
          img{
            width: 24px;
            margin: auto;
          }
        }
      }
      .Status {
        .status {
          color: #00d075;
        }
        .fail {
          color: #ff3c00;
        }
      }
    }
  }
}
</style>
