<template>
  <div class="remove-dialog">
    <Modal v-model="openRemoveDialog" class-name="remove-modal" :footer-hide="true" :closable="true">
      <div v-if="isShowRemove" class="remove-content">
        <p class="title text-center">
          Unstake {{ data.name }}
        </p>
        <div class="remove-wrapper">
          <div class="title-content">
            <span class="card-title">Amount</span>
            <div class="balance-item">
              <span class="mr-2 text-secondary">Staked {{ data.name }}</span>
              <span>{{ data.data && data.data.LPTokenbalance }} {{ data.name }}</span>
            </div>
          </div>
          <div class="remove-wrapper flex">
            <input readonly type="text" class="amount-input">
          </div>
        </div>
        <div class="price-warpper">
          <div class="price-item">
            <span>Unstake scUSD/USDT LP</span>
            <p>1234.21 scUSD</p>
          </div>
        </div>

        <div class="btn-warpper" @click="showConfirmDialog">
          <Buttons>Next</Buttons>
        </div>
      </div>

      <div v-else>
        <div class="confirmRemove-content">
          <div class="arrow-warpper" @click="showRemoveDialog">
            <img src="../../../../assets/img/arrow-left.svg" alt="arrow-left">
          </div>
          <p class="title text-center">
            Confirm
          </p>
          <p class="will-remove">
            You will remove
          </p>

          <div class="confirm-content">
            <div class="images-warpper items-center">
              <img src="../../../../assets/img/comp.svg" width="48" alt="comp">
              <img src="../../../../assets/img/comp.svg" width="48" alt="comp" class="img2">
            </div>
            <h2>1029.23</h2>
            <p>scUSD/USDT LP</p>
            <span>
              Output is estimated. You will receive at least 11.123 scUSD/USDT LP, or the transaction will revert.
            </span>
          </div>
          <div class="price-warpper">
            <div>
              <span>Asset</span>
              <div>
                <div class="images-warpper">
                  <img src="../../../../assets/img/comp.svg" width="14" alt="comp">
                  <img src="../../../../assets/img/comp.svg" width="14" alt="comp" class="img2">
                </div>
                <p>scUSD/USDT LP</p>
              </div>
            </div>
            <div>
              <span>Remove amount</span>
              <p>1234.21 USDT</p>
            </div>
            <div>
              <span>Fee</span>
              <p>0.1 ETH</p>
            </div>
          </div>
          <Buttons>Confirm</Buttons>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  components: {
    Buttons: () => import('@/components/basic/buttons'),
  },
  data() {
    return {
      openRemoveDialog: false,
      isShowRemove: true,
      removeAmount: '',
      data: {},
    };
  },
  methods: {
    open(data) {
      const val = {
        name: 'scUSD/USDT LP',
        address: '0x38dd887F143FD584d3Bed130472b4857E56B2Ca8',
        decimals: 18,
        chainId: 256,
        kind: 'multi',
        symbol: ['scUSD', 'USDT'],
        tokens: [
          {
            name: 'SuperCash tUSD',
            address: '0x0824f6b54027Fc44954E8CF2824344d8D54F3290',
            symbol: 'scUSD',
            decimals: 18,
            chainId: 256,
            logoURI: '/tokenlogo/tlamb48.svg',
          },
          {
            name: 'USDT',
            address: '0x094dcb76492024eed9b638457acb0339ff5a9491',
            symbol: 'USDT',
            decimals: 18,
            chainId: 256,
            logoURI: '/tokenlogo/eth48.png',
          },
        ],
        data: {
          balance: '1.824',
          totalSupply: '15.824',
          rewardRate: '0.964506',
          LPTokenAddress: '0xd615665674Ae6e597B9D1758B5d0afB5e0601703',
          earned: '906.986',
          rewardToken: 'LAMB',
          LPTokenbalance: '11.89',
        },
      };
      this.data = val;
      this.openRemoveDialog = true;
    },
    percentage(i) {
      const val = this.balance * i;
      this.removeAmount = val;
    },
    showConfirmDialog() {
      this.isShowRemove = false;
      console.log('1111111111111111111111');
    },
    showRemoveDialog() {
      this.isShowRemove = true;
    },
  },
  computed: {},
};
</script>

<style lang="less" scoped>
.remove-modal {
  width: 500px;
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  .remove-content {
    padding: 14px 28px;
    .title {
      height: 28px;
      font-size: 24px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #14171c;
      line-height: 28px;
      margin-bottom: 24px;
    }
    .remove-wrapper {
      .title-content {
        overflow: hidden;
        margin: 24px 0 8px;
        span {
          float: left;
        }
        .balance-item {
          float: right;
          font-size: 12px;
          font-weight: 500;
          line-height: 14px;
        }
      }
      .remove-wrapper {
        width: 100%;
        height: 72px;
        background: #f7f8f9;
        border-radius: 6px;
        position: relative;
        .amount-input {
          width: 100%;
          height: 100%;
          outline: none;
          border: none;
          background: #f7f8f9;
          font-size: 40px;
          line-height: 47px;
          color: #14171c;
          padding: 16px;
          caret-color: #0058ff;
          &:focus {
            border: 1px solid #0058ff;
            border-radius: 4px;
          }
        }
      }
    }
    .price-warpper {
      margin-top: 30px;
      .price-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      span {
        height: 14px;
        font-size: 12px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #828489;
        line-height: 14px;
      }
      p {
        height: 14px;
        font-size: 12px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #14171c;
        line-height: 14px;
        margin-bottom: 8px;
      }
    }
    .btn-warpper {
      margin-top: 24px;
      .button-wrapper {
        height: 48px;
      }
    }
  }

  .confirmRemove-content {
    padding: 16px 28px;
    position: relative;
    .arrow-warpper {
      cursor: pointer;
      position: absolute;
      left: 24px;
      top: 0;
    }
    .title {
      height: 28px;
      font-size: 24px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #14171c;
      line-height: 28px;
      margin-bottom: 24px;
    }
    .will-remove {
      text-align: center;
      margin: 24px 0 32px;
      height: 19px;
      font-size: 16px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #14171c;
      line-height: 19px;
    }

    .confirm-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      div {
        width: 60px;
        height: 48px;
        position: relative;
        img {
          position: absolute;
          left: -12px;
          top: 0;
        }
        .img2 {
          left: 12px;
          top: 0;
        }
      }
      h2 {
        height: 47px;
        font-size: 40px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #14171c;
        line-height: 47px;
        margin: 8px 0;
      }
      p {
        height: 19px;
        font-size: 16px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #14171c;
        line-height: 19px;
      }
      span {
        height: 32px;
        font-size: 14px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #828489;
        line-height: 16px;
        text-align: center;
        margin-top: 8px;
      }
    }

    .price-warpper {
      margin-top: 32px;
      div {
        display: flex;
        justify-content: space-between;
        .images-warpper {
          width: 22px;
          height: 14px;
          position: relative;
          margin-right: 8px;
          img {
            position: absolute;
            left: 0;
            top: 0;
          }
          .img2 {
            left: 6px;
            top: 0;
            z-index: 3;
          }
        }
      }

      span {
        height: 14px;
        font-size: 14px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #828489;
        line-height: 16px;
      }
      p {
        height: 14px;
        font-size: 14px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #14171c;
        line-height: 16px;
        margin-bottom: 16px;
      }
    }

    .button-wrapper {
      margin-top: 24px;
      height: 48px;
    }
  }
}

.demo-spin-container {
  display: inline-block;
  width: 400px;
  height: 200px;
  position: relative;
}
</style>