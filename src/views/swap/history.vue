<template>
  <div class="content-wapper">
    <div v-if="!ethAddress||list.length==0" class="noData-wapper">
      <div class="flex flex-col items-center">
        <img src="../../assets/img/noData.png" alt="noData">
        <p>No Data</p>
      </div>
    </div>
    <div v-else class="exchanges-wapper">
      <Scroll :loading-text="'loading....'" :on-reach-bottom="onreachbottom" :height="550">
        <div class="list-wapper">
          <Table :loading="loading" :columns="getHistory" :data="list">
            <template slot="Pair" slot-scope="{ row }">
              <div class="Pair flex items-center">
                <img width="32" :src="getTokenImg(row.show.tokenB)">
                <p>{{ row.show.tokenB }}/{{ row.show.tokenA }}</p>
              </div>
            </template>
            <template slot="Action" slot-scope="{ row }">
              <div class="price">
                <p class="price">
                  {{ actions[row.method_name] }}
                </p>
              </div>
            </template>
            <template slot="Amount" slot-scope="{ row }">
              <div class="amout">
                <p class="amout">
                  <span v-if="row.show.inamount.constructor === Array">
                    {{ row.show.inamount[0]|format1e18ValueList }} {{ row.show.tokenA }}<br>
                    {{ row.show.inamount[1]|format1e18ValueList }} {{ row.show.tokenB }}
                  </span>
                  <span v-else>
                    {{ row.show.inamount|format1e18ValueList }}
                    <span v-if="row.show.outamount.constructor === Array">
                      LP
                    </span>
                    <span v-else>
                      {{ row.show.tokenA }}
                    </span>
                  </span>
                </p>
              </div>
            </template>
            <template slot="Recived" slot-scope="{ row }">
              <div class="Recived">
                <p class="Recived">
                  <span v-if="row.show.outamount.constructor === Array">
                    {{ row.show.outamount[0]|format1e18ValueList }} {{ row.show.tokenA }}<br>
                    {{ row.show.outamount[1]|format1e18ValueList }} {{ row.show.tokenB }}
                  </span>
                  <span v-else>
                    {{ row.show.outamount|format1e18ValueList }}
                    <span v-if="row.show.inamount.constructor === Array">
                      LP
                    </span>
                    <span v-else>
                      {{ row.show.tokenB }}
                    </span>
                  </span>
                </p>
              </div>
            </template>
            <template slot="Status" slot-scope="{ row }">
              <div class="status">
                <p class="status executed">
                  {{ row.tx_status==1?"Executed":"Fail" }}
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
import { readSwapHistory } from "@/contactLogic/history.js";
import { getTokenImg } from "@/contactLogic/readbalance.js";

export default {
  data() {
    return {
      list: [],
      actions: {
        swapExactTokensForTokens: "swap",
        addLiquidity: "addLiquidity",
        removeLiquidityWithPermit: "removeLiquidity",
        removeLiquidityETHWithPermit: "removeLiquidity",
        addLiquidityETH: "addLiquidity",
        swapExactTokensForETH: "swap",
        removeLiquidityETHWithPermitSupportingFeeOnTransferTokens:
          "removeLiquidity",
      },
      pageIndex: 1,
      pageNum: 1,
      pairloading: false,
      loading: false,
    };
  },
  methods: {
    getTokenImg(tokensymbol) {
      const chainID = this.ethChainID;
      return getTokenImg(tokensymbol, chainID);
    },
    async getreadSwapHistory() {
      this.loading = true;
      const account = this.ethAddress;
      const chainID = this.ethChainID;

      const data = await readSwapHistory(
        chainID,
        account,
        this.$data.pageIndex,
        10
      );
      this.list = this.list.concat(data.data);
      if (data.count % 10 === 0) {
        this.$data.pageNum = data.count / 10;
      } else {
        this.$data.pageNum = (data.count - (data.count % 10)) / 10 + 1;
      }
      this.loading = false;
    },
    onreachbottom() {
      console.log("onreachbottom", this.$data.pageIndex);
      if (this.$data.pageIndex < this.$data.pageNum) this.loading = true;

      const _this = this;

      return new Promise((resolve) => {
        setTimeout(async () => {
          _this.$data.pageIndex += 1;
          await _this.getreadSwapHistory();
          resolve({});
        }, 1);
      });
    },
  },
  mounted() {
    this.$data.pageIndex = 1;
    this.$data.list = [];
    if (this.ethAddress) {
      this.getreadSwapHistory();
    }
  },
  watch: {
    ethAddress: function () {
      if (this.ethAddress) {
        this.getreadSwapHistory();
      }
    },
  },
  computed: {
    getHistory() {
      const columns = [
        {
          title: this.$t("swapHistory.table.Pair"),
          slot: "Pair",
          minWidth: 200,
        },
        {
          title: this.$t("swapHistory.table.Action"),
          slot: "Action",
          minWidth: 100,
        },
        {
          title: this.$t("swapHistory.table.Amount"),
          slot: "Amount",
          minWidth: 120,
        },
        {
          title: this.$t("swapHistory.table.Recived"),
          slot: "Recived",
          minWidth: 120,
        },
        {
          title: this.$t("swapHistory.table.Status"),
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
  // height: 749px;
  // width: 980px;
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  margin-top: 20px;
  padding: 44px;
  .exchanges-wapper {
    .exchanges-title {
      font-size: 20px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #14171c;
      line-height: 24px;
    }
    .list-wapper {
      .price {
        p {
          font-size: 16px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #14171c;
          line-height: 19px;
        }
      }
      .Pair {
        img {
          max-width: 24px;
          margin-right: 8px;
        }
        p {
          font-size: 16px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #14171c;
          line-height: 19px;
        }
      }
      .amout {
        p {
          font-size: 16px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #14171c;
          line-height: 30px;
        }
      }
      .status {
        .status {
          color: #00d075;
        }
        .fail {
          color: #ff3c00;
        }
      }
    }
  }
  .noData-wapper {
    width: 100%;
    min-height: calc(100vh - 500px);
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      max-width: 80px;
    }
    p {
      margin-top: 8px;
      height: 16px;
      font-size: 14px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #8690a8;
      line-height: 16px;
    }
  }
}

.demo-spin-container {
  display: inline-block;
  width: 100%;
  height: 100px;
  position: relative;
}
</style>