<template>
  <div class="synth-wrapper mb-6">
    <div class="title-wrapper flex justify-between items-center">
      <div class="left">
        <span class="title">Synth Mining</span>
      </div>
      <div class="right">
        Deposit scUSD, get Synth rewards
      </div>
    </div>
    <div class="airdrop-content-wrapper flex justify-between items-center">
      <div class="airdrop-item name">
        <img src="../../../../assets/img/susd48.svg" alt="susd">
        <span>scUSD</span>
      </div>

      <div class="airdrop-item apy">
        <p class="drop-title">
          APY
        </p>
        <p class="apy-num">
          1044%
        </p>

        <p class="tag">
          <span class="mine font10px">SCash Mining</span>
          <span class="reward font10px">Fee Rewards</span>
        </p>
      </div>

      <div class="airdrop-item balance">
        <div class="balance-item">
          <span class="title">Total Deposited</span>
          <span class="value">1245 scUSD</span>
        </div>
        <div class="balance-item">
          <span class="title">Daily Output</span>
          <span class="value"> 123 SCASH</span>
        </div>
      </div>

      <div class="airdrop-item create">
        <button class="createBtn" @click="openDeposit">
          Deposit scUSD
        </button>
      </div>
    </div>

    <depositDialog ref="deposit" />
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
    },
  },
  components: {
    depositDialog: ()=> import('../dialog/depositDialog.vue')
  },
  methods: {
    openDeposit() {
      this.$refs.deposit.open();
    },
  },
};
</script>

<style lang="less" scoped>
.synth-wrapper {
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 32px 44px 44px 44px;
  .title-wrapper {
    .left {
      .title {
        font-size: 20px;
        font-weight: 500;
        color: #14171c;
        line-height: 24px;
      }
    }
    .right {
      font-size: 16px;
      font-weight: 400;
      color: #8690a8;
      line-height: 19px;
    }
  }
  .airdrop-content-wrapper {
    width: 100%;
    margin-top: 24px;
    background: #ffffff;
    box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
    border-radius: 12px;
    padding: 32px 24px;
    .name {
      width: 20%;
      display: flex;
      flex-direction: row;
      justify-self: space-between;
      align-items: center;
      span {
        margin-left: 28px;
        font-size: 20px;
        color: #14171c;
        line-height: 24px;
      }
    }
    .apy {
      width: 20%;
      .apy-num {
        margin-top: 8px;
        font-size: 26px;
        color: #00D075;
        line-height: 30px;
      }
      .tag {
        .mine {
          margin-right: 4px;
          padding: 4px;
          background: rgba(0, 208, 117, 0.2);
          border-radius: 2px;
          color: #00d075;
          line-height: 11px;
        }
        .reward {
          padding: 4px;
          background: rgba(135, 87, 236, 0.2);
          border-radius: 2px;
          color: #8757ec;
          line-height: 11px;
        }
      }
    }
    .balance {
      width: 30%;
      .balance-item {
        margin-bottom: 16px;
        overflow: hidden;
        .title {
          float: left;
          font-size: 14px;
          color: #8690a8;
          line-height: 16px;
          // margin-right: 50px;
        }
        .value {
          float: right;
          font-size: 14px;
          color: #14171c;
          line-height: 16px;
        }
      }
    }
  }
}
.createBtn {
  font-size: 16px;
  color: #ffffff;
  line-height: 19px;
  padding: 8px 16px;
  background: #0058ff;
  border-radius: 18px;
}
.drop-title {
  font-size: 14px;
  color: #8690a8;
  line-height: 16px;
}
</style>