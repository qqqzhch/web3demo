<template>
  <div class="troves-wrapper">
    <div class="content">
      <div class="title-warpper">
        <div class="title-content">
          <img src="../../assets/img/import.svg" alt="import">
          <h2>{{ $t('troves.title') }}</h2>
        </div>
        <p>{{ $t('troves.subTitle1') }}</p>
        <p>
          {{ $t('troves.subTitle2') }}
        </p>
      </div>
      <!-- <div class="liquidata">
        <div class="title-content">
          <img src="../../assets/img/paper.svg" alt="liquidata">
          <h2>Liquidate</h2>
        </div>
        <div class="input-warpper flex items-center">
          <p>Up to</p>
          <div class="input-item">
            <input type="number">
          </div> -->

      <!-- <p>Troves</p> -->
      <!-- <img src="../../assets/img/delete.svg" alt="delete"> -->
      <!-- </div>
      </div> -->
    </div>
    <div class="list-wapper">
      <h2>{{ $t('troves.tableTitle') }}</h2>
      <div v-if="showLoading">
        <loading />
      </div>
      <Scroll v-else :loading-text="'loading....'" :on-reach-bottom="onreachbottom" :height="400">
        <Table :columns="getColumns" :data="troveList">
          <template slot="Owner" slot-scope="{ row }">
            <div class="Owner">
              <p>{{ getShortAddress(row.ownerAddress) }}</p>
            </div>
          </template>
          <template slot="Collateral" slot-scope="{ row }">
            <div class="Collateral">
              <p>{{ row.collateral }} BNB</p>
            </div>
          </template>
          <template slot="Debt" slot-scope="{ row }">
            <div class="Debt">
              <p>{{ row.Debt }} LAI</p>
            </div>
          </template>
          <template slot="Coll.Ratio" slot-scope="{ row }">
            <div class="Coll.Ratio">
              <p :class="row.color">
                {{ row.collateralRatio }}
              </p>
            </div>
          </template>
          <template slot="Coll.Liquidate" slot-scope="{ row }">
            <div class="Coll.Ratio">
              <p>
                <img
                  v-if="row.disable == false"
                  src="../../assets/img/backspace.svg"
                  alt="delete"
                  @click="cleartrove(row.ownerAddress, row.disable)"
                >
                <Tooltip v-else :content="row.disable" placement="left">
                  <img src="../../assets//img/delete-b.svg" alt="delete">
                </Tooltip>

                <!-- <img src="../../assets/img/Trash.svg" alt="delete" @click="cleartrove(row.ownerAddress,row.disable)"> -->
              </p>
            </div>
          </template>
        </Table>
      </Scroll>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import event from "@/common/js/event";
import initLiquity from "@/common/mixin/initLiquity";

import {
  MINIMUM_COLLATERAL_RATIO,
  CRITICAL_COLLATERAL_RATIO,
} from "@liquity/lib-base";

export default {
  mixins: [initLiquity],
  data() {
    return {
      troveList: [],
      shortAdress: "",
      clampedPage: 0,
      showLoading: false,
      shortTableAdress:[]
    };
  },
  methods: {
    async cleartrove(ownerAddress, disable) {
      console.log("ownerAddress");
      if (disable == false) {
        try {
          const data = await this.liquity.send.liquidate(ownerAddress, {
            gasLimit: this.$globalConfig.gasLimit,
          });
          event.$emit("sendSuccess");

          event.$emit("sendtx", [
            data.rawSentTransaction,
            {
              okinfo: `Liquidation ${ownerAddress} success`,
              failinfo: `Liquidation ${ownerAddress} fail`,
            },
          ]);
        } catch (ex) {
          console.log(ex);
        }
        // this.list();
      } else {
        this.$Notice.warning({
          title: this.$t("notice.n"),
          desc: disable,
        });
      }
    },
    onreachbottom() {
      this.$data.clampedPage += 1;
      this.list();
    },
    async list() {
      const pageSize = 20;
      const clampedPage = this.$data.clampedPage;
      const {
        numberOfTroves,
        price,
        total,
        lusdInStabilityPool,
        blockTag,
      } = this.liquityState;
      const recoveryMode = total.collateralRatioIsBelowCritical(price);
      const totalCollateralRatio = total.collateralRatio(price);
      const data = await this.liquity.getTroves(
        {
          first: pageSize,
          sortedBy: "ascendingCollateralRatio",
          startingAt: clampedPage * pageSize,
        },
        { blockTag }
      );
      data.forEach((trove) => {
        if (recoveryMode) {
          trove.disable = this.liquidatableInRecoveryMode(
            trove,
            price,
            totalCollateralRatio,
            lusdInStabilityPool
          );
        } else {
          trove.disable = this.liquidatableInNormalMode(trove, price);
        }

        const collateralRatio = trove.collateralRatio(price);

        trove.color = collateralRatio.gt(CRITICAL_COLLATERAL_RATIO)
          ? "success"
          : collateralRatio.gt(1.2)
          ? "warning"
          : "danger";
        trove.collateral = trove.collateral.prettify();
        trove.Debt = trove.debt.prettify();
        trove.collateralRatio = collateralRatio.mul(100).prettify() + "%";

        // if(collateralRatio.lt(1.1)){

        // }
      });
      this.$data.troveList = this.$data.troveList.concat(data);
      // // this.shortAdress = `${this.troveList.ownerAddress.slice(0, 6)}...${this.ethAddress.slice(-6)}`;
      // this.$data.troveList.forEach(item=>{
      //   this.shortTableAdress.push(`${item.ownerAddress.slice(0, 6)}...${item.ownerAddress.slice(-6)}`);
      // });
      // console.log(this.shortTableAdress,'----------------------------------------------------------------1');
    },
    liquidatableInRecoveryMode(
      trove,
      price,
      totalCollateralRatio,
      lusdInStabilityPool
    ) {
      const collateralRatio = trove.collateralRatio(price);
      if (
        collateralRatio.gte(MINIMUM_COLLATERAL_RATIO) &&
        collateralRatio.lt(totalCollateralRatio)
      ) {
        if (trove.debt.lte(lusdInStabilityPool)) {
          return false;
        } else {
          return "There's not enough LAY in the Stability pool to cover the debt";
        }
      } else {
        return this.liquidatableInNormalMode(trove, price);
      }
    },
    liquidatableInNormalMode(trove, price) {
      if (trove.collateralRatioIsBelowMinimum(price)) {
        return false;
      } else {
        return "Collateral ratio not low enough";
      }
    },
    getShortAddress(adress) {
      return `${adress.slice(0, 6)}...${adress.slice(-6)}`;
    },
  },
  mounted() {
    console.log("---");
    this.$data.showLoading = true;
    const _this = this;
    event.$on("txsuccess", () => {
      setTimeout(() => {
        _this.$data.clampedPage = 0;
        _this.$data.troveList = [];
        _this.list();
      }, 3000);
    });

    var id = setInterval(() => {
      if (
        _this.liquityState &&
        _this.liquityState.price &&
        this.liquity &&
        this.liquity.getTroves
      ) {
        clearInterval(id);
        try {
          _this.list();
        } catch (error) {
          console.log(error);
        }
        this.$data.showLoading = false;
      }
    }, 100);
  },
  computed: {
    ...mapState("pool", ["liquity",'isMobile']),
    ...mapState("buildr", ["liquityState", "liquityReady"]),
    liquityInstance() {
      const val = this.liquity && this.liquity.send;
      return val;
    },
    getColumns() {
      const columns = [
        {
          title: this.$t("troves.owner"),
          slot: "Owner",
          minWidth: 250,
        },
        {
          title: this.$t("troves.collateral"),
          slot: "Collateral",
          minWidth: 200,
        },
        {
          title: this.$t("troves.debt"),
          slot: "Debt",
          minWidth: 200,
        },
        {
          title: this.$t("troves.ratio"),
          slot: "Coll.Ratio",
          minWidth: 200,
        },
        {
          title: this.$t("troves.liquidate"),
          slot: "Coll.Liquidate",
          minWidth: 150,
        },
      ];
      return columns;
    },
  },
  components: {
    loading: () => import("@/components/basic/loading.vue"),
  },
};
</script>

<style lang="less" scoped>
.troves-wrapper {
  font-family: Gilroy-Bold, Gilroy;
  color: #ffffff;
  h2 {
    font-size: 26px;
    font-family: Gilroy-Bold, Gilroy;
    font-weight: 500;
    color: #ffffff;
    line-height: 38px;
  }
  .title-content {
    margin: 8px 0 16px;
    display: flex;
    align-items: center;
    img {
      max-width: 30px;
      margin-right: 10px;
    }
  }
  .content {
    width: 100%;
    background: linear-gradient(270deg, #3f5efb 0%, #fc466b 100%);
    border-radius: 12px;
    padding: 24px;
    position: relative;
    .title-warpper {
      p {
        font-size: 16px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #ffffff;
        line-height: 16px;
        margin: 8px 0 16px;
      }
    }
    .liquidata {
      margin-top: 40px;
      width: 40%;
      .input-warpper {
        margin-top: 16px;
        p {
          font-size: 24px;
        }
        .input-item {
          width: 60%;
          height: 34px;
          margin: 0 10px;
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid #fff;
          input {
            width: 100%;
            height: 100%;
            background: transparent;
            color: #fff;
            font-size: 20px;
            padding: 5px 10px;
          }
        }
        img {
          cursor: pointer;
          max-width: 26px;
          margin-left: 10px;
        }
      }
    }
  }
  .list-wapper {
    margin-top: 30px;
    box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
    padding: 24px;
    border-radius: 12px;
    h2 {
      color: #333;
      margin-bottom: 16px;
    }
    img {
      max-width: 30px;
    }
  }
}
.success {
  color: green;
}
.warning {
  color: #ffd77a;
}
.danger {
  color: red;
}
</style>