<template>
  <div class="content-wapper">
    <div class="earn-wapper">
      <p class="earn-title">
        History
      </p>
      <Scroll
        :loading-text="'loading....'"
        :on-reach-bottom="onreachbottom"
        :height="400"
      >
        <div class="list-wapper">
          <Table :columns="getHistory" :data="list">
            <template slot="Pool" slot-scope="{ row}">
              <div class="Pool">
                <!-- <div v-if="row.method_name==='exit'" class="imgages-warpper">
                <img :src="getTokenImg(row.show.tokenA)" class="imgLeft">
                <img :src="getTokenImg(row.show.tokenB)" class="imgRight">
              </div>
              <div v-else class="imgages-warpper">
                <img :src="getTokenImg(row.show.tokenA)" class="images">
              </div> -->
                <p>
                  {{ selectAddress(row.show.poolADDRESS) }}
                </p>
              </div>
            </template>
            <template slot="Action" slot-scope="{ row}">
              <div class="Action">
                <p class="action">
                  {{ row.method_name }}
                </p>
              </div>
            </template>
            <template slot="Amount" slot-scope="{ row}">
              <div v-if="row.method_name==='exit'" class="Amount">
                <p class="amout">
                  {{ row.show.outamountA|format1e18ValueList }} {{ row.show.tokenA }}
                </p>
                <p class="amout">
                  {{ row.show.outamountB|format1e18ValueList }} {{ row.show.tokenB }}
                </p>
              </div>
              <div v-if="row.method_name==='getReward'" class="Amount">
                <p class="amout">
                  {{ row.show.outamount|format1e18ValueList }} {{ row.show.tokenA }}
                </p>
              </div>
              <div v-if="row.method_name==='stake'" class="Amount">
                <p class="amout">
                  {{ row.show.inamount|format1e18ValueList }} {{ row.show.tokenA }}
                </p>
              </div>
            </template>
            <template slot="Status" slot-scope="{ row}">
              <div class="Status">
                <p v-if="row.tx_status === 1" class="status success">
                  Success
                </p>
                <p v-else class="fail">
                  Fail
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
import { mapState } from "vuex";
import { readPledgeHistory } from "@/contactLogic/history.js";
import { getTokenImg } from "@/contactLogic/readbalance.js";
import tokenList from "@/constants/earnList.json";

export default {
  data() {
    return {
      list: [],
      pageIndex: 1,
      pageNum: 1,
      pairloading: false,
      addressName: "",
    };
  },
  // components:{
  //   loading: () => import("@/components/basic/loading.vue"),

  // },
  methods: {
    getTokenImg(tokensymbol) {
      const chainID = this.ethChainID;
      return getTokenImg(tokensymbol, chainID);
    },
    async getreadPledgeHistory() {
      const library = this.ethersprovider;
      const account = this.ethAddress;
      const chainID = this.ethChainID;

      const data = await readPledgeHistory(
        chainID,
        account,
        this.$data.pageIndex,
        10
      );

      this.list = this.$data.list.concat(data.data);

      console.log(this.list);

      if (data.count % 10 == 0) {
        this.$data.pageNum = data.count / 10;
      } else {
        this.$data.pageNum = (data.count - (data.count % 10)) / 10 + 1;
      }
      this.$data.pairloading = false;
    },
    selectAddress(val) {
      
      const token = tokenList.filter((item) => {
        return item.address === val;
      });
      return token[0].name;
    },
    onreachbottom(){
      console.log('onreachbottom',this.$data.pageIndex);
      const  _this = this;

      return new Promise( resolve => {
           setTimeout(async () => {
             _this.$data.pageIndex+=1;
             await _this.getreadPledgeHistory();
             resolve({})   ;

           },1);

          });

    }
  },
  mounted() {
    this.$data.pageIndex = 1;
    this.$data.list = [];
    if (this.ethAddress) {
      this.getreadPledgeHistory();
    }
  },
  watch: {
    ethAddress: function () {
      if (this.ethAddress) {
        this.getreadPledgeHistory();
      }
    },
  },
  computed: {
    getHistory() {
      const columns = [
        {
          title: "Pool",
          slot: "Pool",
          minWidth: 200,
        },
        {
          title: "Action",
          slot: "Action",
          minWidth: 100,
        },
        {
          title: "Amount",
          slot: "Amount",
          minWidth: 120,
        },
        {
          title: "Status",
          slot: "Status",
          minWidth: 100,
        },
      ];
      return columns;
    },

    ...mapState(["ethAddress", "ethChainID", "web3", "ethersprovider"]),
  },
};
</script>

<style lang="less" scoped>
.content-wapper {
  height: 549px;
  width: 980px;
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  margin: 20px 0 100px 0;
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
        margin: 10px;
      }
      .Pool {
        display: flex;
        align-items: center;
        .imgages-warpper {
          display: flex;
          margin-right: 12px;
          width: 40px;
          height: 24px;
          position: relative;
          .images {
            width: 24px;
            margin: auto;
          }
          .imgLeft {
            width: 24px;
            position: absolute;
            left: 0;
            top: 0;
          }
          .imgRight {
            width: 24px;
            position: absolute;
            left: 16px;
            top: 0;
            z-index: 5;
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