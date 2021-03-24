<template>
  <div class="pool-warpper">
    <div class="rewards-warpper">
      <h2>Where to get scUSD?</h2>
      <p>
        Earn a transaction fee by providing liquidity to trade pairs, and can be claimed by removing liquidity.
      </p>
      <div class="buttonWarpper flex items-center">
        <div class="button-item marginRight">
          <div class="border-image">
            <p @click="tobuilder">
              SuperCash Builder
            </p>
            <div>
              <span>Get scUSD Credit Line</span>
              <img src="../../assets/img/rightTop.svg" alt="arrow">
            </div>
          </div>
        </div>
        <div class="button-item">
          <div class="border-image">
            <p @click="toexchange">
              SuperCash Exchange
            </p>
            <div>
              <span>Buy scUSD</span>
              <img src="../../assets/img/rightTop.svg" alt="arrow">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="liquidityPool">
      <h2>Input liquidity, get LP</h2>
      <div v-if="pairlistloading" class="demo-spin-container ">
        <loading />
      </div>
      <div v-for="item in dataList" v-else :key="item.pairName" class="poolCon">
        <div class="flex items-center justify-between">
          <div class="img-warpper flex">
            <img :src="getTokenImg(item.pairSymbols[0])" alt="" width="48">
            <img :src="getTokenImg(item.pairSymbols[1])" width="48" class="otherImg">
          </div>
          <div>
            <p>{{ item.pairName }}</p>
            <span>1 {{ item.configSymbols[0] }} = {{ item.price }} {{ item.configSymbols[1] }}</span>
          </div>
        </div>
        <div>
          <span>Total Inputed</span>
          <p>{{ item.totalSupply | formatBalance }}</p>
        </div>
        <div class=" flex items-center">
          <div class="rightdiv">
            <span>Inputed {{ item.pairSymbols[0] }}</span>
            <span>Inputed {{ item.pairSymbols[1] }}</span>
            <span class="colorText">My share of pool</span>
          </div>
          <div class="number">
            <span>{{ item.aTokenbalance }}</span>
            <span>{{ item.bTokenbalance }}</span>
            <span class="colorText">{{ Calculatepercentage(item.balance,item.totalSupply) |formatRate }}</span>
          </div>
        </div>

        <div>
          <div class="input-warpper">
            <button @click="openInput(item)">
              Input
            </button>
          </div>
          <div class="remove-warpper">
            <button @click="openRemove(item)">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-wrapper">
      <inputDialog ref="input" />
      <removeDialog ref="remove" />
    </div>
  </div>
</template>

<script>
import { readpairLiquidity } from "@/contactLogic/readpairpool.js";
import { mapState } from "vuex";
const debounce = require("debounce");

const BigNumber = require("bignumber.js");
import event from "@/common/js/event";

import { getTokenImg } from "@/contactLogic/readbalance.js";

export default {
  data() {
    return {
      dataList: [],
      pairlistloading: false,
    };
  },
  components: {
    inputDialog: () => import('./dialog/inputDialog.vue'),
    removeDialog: () => import('./dialog/removeDialog.vue'),
    loading: () => import('@/components/basic/loading.vue'),
  },
  mounted() {
    //txsuccess
    console.log("- -");
    event.$on("txsuccess", () => {
      this.readList();
    });
    if (this.ethChainID) {
      this.$data.pairlistloading = true;
      this.readList();
    }
  },
  watch: {
    ethChainID: function () {
      if (this.ethChainID) {
        this.$data.pairlistloading = true;
        this.readList();
      }
    },
    ethAddress: function () {
      if (this.ethAddress) {
        this.$data.pairlistloading = true;
        this.readList();
      }
    },
  },
  methods: {
    tobuilder() {
      this.$router.push("/buildr");
    },
    toexchange() {
      this.$router.push("/exchange");
    },
    getTokenImg(tokensymbol) {
      const chainID = this.ethChainID;
      return getTokenImg(tokensymbol, chainID);
    },
    Calculatepercentage(balance, totalSupply) {
      const balance_ = new BigNumber(balance);
      const totalSupply_ = new BigNumber(totalSupply);
      return balance_.div(totalSupply_).toString();
    },
    openInput(pairs) {
      this.$refs.input.open(pairs);
    },
    openRemove(pairs) {
      this.$refs.remove.open(pairs);
    },
    readList: debounce(async function () {
      console.log("readList");
      const chainID = this.ethChainID;
      const library = this.ethersprovider;
      const account = this.ethAddress;
      try {
        const list = await readpairLiquidity(chainID, library, account);
        console.log(list);
        this.$data.dataList = list;
      } catch (error) {
        console.log(error);
      } finally {
        this.$data.pairlistloading = false;
      }
    }, 1000),
  },
  computed: {
    ...mapState(["ethChainID", "ethAddress", "web3", "ethersprovider"]),
  },
};
</script>

<style lang="less" scoped>
.pool-warpper {
  .rewards-warpper {
    background: #ffffff;
    box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
    border-radius: 12px;
    margin-left: 100px;
    padding: 24px 44px;
    h2 {
      height: 40px;
      font-size: 32px;
      font-family: Gilroy-Bold, Gilroy;
      font-weight: bold;
      line-height: 38px;
      background: linear-gradient(90deg, #fc466b 0%, #3f5efb 30%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      height: 19px;
      font-size: 16px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #14171c;
      line-height: 19px;
      margin: 8px 0 16px;
    }
    .buttonWarpper {
      margin-top: 12px;
      .button-item {
        width: 522px;
        height: 50px;
        border-radius: 25px;
        align-items: center;
        background-image: linear-gradient(
          90deg,
          rgba(251, 70, 107, 1),
          rgba(63, 94, 251, 1)
        );
        position: relative;
        .border-image {
          width: 520px;
          height: 48px;
          border-radius: 24px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: absolute;
          left: 1px;
          top: 1px;
          background: #ffffff;
          p {
            font-size: 16px;
            font-family: Gilroy-Medium, Gilroy;
            font-weight: 500;
            color: #3f5efb;
            line-height: 19px;
            margin: 0px;
            cursor: pointer;
          }
          div {
            span {
              cursor: pointer;
              height: 19px;
              font-size: 16px;
              font-family: Gilroy-Medium, Gilroy;
              font-weight: 500;
              color: #14171c;
              line-height: 19px;
            }
            display: flex;
            img {
              margin-left: 10px;
            }
          }
        }
      }
      .marginRight{
        margin-right: 32px;
      }
    }
  }
  .liquidityPool {
    margin-top: 44px;
    padding: 32px 44px;
    height: 559px;
    background: #ffffff;
    box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
    border-radius: 12px;
    h2 {
      height: 24px;
      font-size: 20px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #14171c;
      line-height: 24px;
      margin-bottom: 24px;
    }
    p {
      height: 19px;
      font-size: 16px;
      font-family: Gilroy-Regular, Gilroy;
      font-weight: 400;
      color: #14171c;
      line-height: 19px;
    }
    .poolCon {
      display: flex;
      margin-top: 24px;
      padding: 22px 24px;
      align-items: center;
      justify-content: space-between;
      background: #ffffff;
      box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
      border-radius: 12px;
      div {
        p {
          height: 24px;
          font-size: 20px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #14171c;
          line-height: 24px;
        }
        span {
          display: block;
          height: 16px;
          font-size: 14px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #828489;
          line-height: 16px;
          margin-bottom: 6px;
        }
        .img-warpper {
          margin-right: 16px;
          width: 72px;
          height: 48px;
          position: relative;
          img {
            position: absolute;
            left: 0;
            bottom: 0;
          }
          .otherImg {
            left: 24px;
          }
        }
        .input-warpper {
          width: 160px;
          height: 36px;
          background: #0058ff;
          border-radius: 18px;
          button {
            width: 100%;
            height: 100%;
            font-size: 16px;
            font-family: Gilroy-Medium, Gilroy;
            font-weight: 500;
            color: #ffffff;
            line-height: 19px;
          }
        }
        .remove-warpper {
          width: 160px;
          height: 36px;
          border-radius: 18px;
          border: 1px solid #0058ff;
          margin-top: 8px;
          button {
            width: 100%;
            height: 100%;
            font-size: 16px;
            font-family: Gilroy-Medium, Gilroy;
            font-weight: 500;
            color: #0058ff;
            line-height: 19px;
          }
        }
        .colorText {
          font-size: 14px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #828489;
          line-height: 16px;
          background: linear-gradient(90deg, #fc466b 0%, #3f5efb 80%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
      .number {
        margin-left: 80px;
        span {
          color: #14171c;
        }
      }
    }
  }
}
.demo-spin-container {
  display: inline-block;
  width: 100%;
  height: 200px;
  position: relative;
  margin-top: 100px;
}
</style>