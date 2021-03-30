<template>
  <div class="content-wapper">
    <div v-if="list!=[]" class="earn-wapper">
      <Scroll :loading-text="'loading....'" :on-reach-bottom="onreachbottom" :height="400">
        <div class="list-wapper">
          <Table :loading="showLoading" :columns="getHistory" :data="list">
            <template slot="Pool" slot-scope="{ row }">
              <div class="Pool">
                <p>
                  {{ selectAddress(row.show.poolADDRESS) }}
                </p>
              </div>
            </template>
            <template slot="Action" slot-scope="{ row }">
              <div class="Action">
                <p v-if="row.method_name==='stake'" class="action">
                  {{ $t('earn.actions.stake') }}
                </p>
                <p v-if="row.method_name==='exit'" class="action">
                  {{ $t('earn.actions.exit') }}
                </p>
                <p v-if="row.method_name==='getReward'" class="action">
                  {{ $t('earn.actions.getReward') }}
                </p>
              </div>
            </template>
            <template slot="Amount" slot-scope="{ row }">
              <div v-if="row.method_name === 'exit'" class="Amount">
                <p class="amout">
                  {{ row.show.outamountA | format1e18ValueList }} {{ row.show.tokenA }}
                </p>
                <p class="amout">
                  {{ row.show.outamountB | format1e18ValueList }} {{ row.show.tokenB }}
                </p>
              </div>
              <div v-if="row.method_name === 'getReward'" class="Amount">
                <p class="amout">
                  {{ row.show.outamount | format1e18ValueList }} {{ row.show.tokenA }}
                </p>
              </div>
              <div v-if="row.method_name === 'stake'" class="Amount">
                <p class="amout">
                  {{ row.show.inamount | format1e18ValueList }} {{ row.show.tokenA }}
                </p>
              </div>
            </template>
            <template slot="Status" slot-scope="{ row }">
              <div class="Status">
                <p v-if="row.tx_status === 1" class="status success">
                  {{ $t('history.success') }}
                </p>
                <p v-else class="fail">
                  {{ $t('history.fail') }}
                </p>
              </div>
            </template>
          </Table>
        </div>
      </Scroll>
    </div>
    <div v-else class="noData-wapper">
      <div class="flex flex-col items-center">
        <img src="../../../assets/img/noData.png" alt="noData">
        <p>No Data</p>
      </div>
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
      list1: [],
      pageIndex: 1,
      pageNum: 1,
      pairloading: false,
      addressName: "",
      showLoading: false,
      methodName: [],
    };
  },
  // components: {
  //   loading: () => import('@/components/basic/loading.vue'),
  // },
  methods: {
    getTokenImg(tokensymbol) {
      const chainID = this.ethChainID;
      return getTokenImg(tokensymbol, chainID);
    },
    async getreadPledgeHistory() {
      this.showLoading = true;
      try {
        const account = this.ethAddress;
        const chainID = this.ethChainID;
        const data = await readPledgeHistory(
          chainID,
          account,
          this.pageIndex,
          10
        );
        this.list = this.list.concat(data.data);
        if (data.count % 10 === 0) {
          this.pageNum = data.count / 10;
        } else {
          this.pageNum = (data.count - (data.count % 10)) / 10 + 1;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.showLoading = false;
      }
    },
    selectAddress(val) {
      const [token] = tokenList.filter((item) => {
        return item.address === val;
      });
      return token.name;
    },
    onreachbottom() {
      // console.log('onreachbottom', this.pageIndex);
      const _this = this;

      return new Promise((resolve) => {
        setTimeout(async () => {
          _this.pageIndex += 1;
          await _this.getreadPledgeHistory();
          resolve({});
        }, 1);
      });
    },
  },
  created() {
    this.pageIndex = 1;
    this.list = [];
    if (this.ethAddress) {
      this.showLoading = true;
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
          title: this.$t("history.table.pool"),
          slot: "Pool",
          minWidth: 200,
        },
        {
          title: this.$t("history.table.action"),
          slot: "Action",
          minWidth: 100,
        },
        {
          title: this.$t("history.table.amount"),
          slot: "Amount",
          minWidth: 120,
        },
        {
          title: this.$t("history.table.status"),
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
        margin: 10px 0;
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
</style>