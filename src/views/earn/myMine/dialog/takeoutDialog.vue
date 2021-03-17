<template>
  <div class="remove-dialog">
    <Modal v-model="openRemoveDialog" class-name="remove-modal" :footer-hide="true" :closable="true">
      <div class="remove-content">
        <p class="title text-center">
          Unstake {{ coinName }}
        </p>
        <div class="remove-wrapper">
          <div class="title-content">
            <span class="card-title">Amount</span>
            <div class="balance-item">
              <span class="mr-2 text-secondary">Staked {{ coinName }}</span>
              <span>{{ stakeVal }}</span>
            </div>
          </div>
          <div class="remove-wrapper flex">
            <input v-model="stakeVal" readonly type="text" class="amount-input">
          </div>
        </div>
        <div class="price-warpper">
          <div class="price-item">
            <span>Unstake scUSD/USDT LP</span>
            <p>{{ stakeVal }} {{ coinName }}</p>
          </div>
        </div>

        <div class="btn-warpper">
          <Buttons v-if="!takeLoading" @click.native="submitData">
            Confirm
          </Buttons>
          <Buttons v-else>
            loading...
          </Buttons>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import getTx from '../../utils/getTx.vue';
import { mapState } from 'vuex';
import { useStakingRewardsContractSigna } from '../../utils/helpUtils/allowances.js';
export default {
  inject: ['reload'],
  mixins: [getTx],
  data() {
    return {
      openRemoveDialog: false,
      data: {},
      coinName: '',
      stakeVal: '',
      takeLoading: false
    };
  },
  methods: {
    open(data) {
      this.data = data;
      this.stakeVal = data && data.data && data.data.balance;
      this.coinName = data && data.name;
      this.openRemoveDialog = true;
    },

    async submitData() {
      this.takeLoading = true;
      const tokenJson = this.data;
      try {
        const stakingRewardsContract = useStakingRewardsContractSigna(this.ethersprovider, this.ethAddress, tokenJson);
        const result = await stakingRewardsContract.exit({ gasLimit: 350000 });
        // console.log('返回结果', result);
        const txInfo = await this.getTransaction(result.hash);
        // console.log(txInfo);
        if (txInfo.status === false) {
          // console.log('status', txInfo);
          this.$Notice.error({
            title: '发送交易失败',
          });
        } else {
          this.$Notice.success({
            title: '发送交易成功',
          });
        }
      } catch (error) {
        console.log(error);
        this.$Notice.error({
          title: '发送交易失败',
        });
      } finally {
        const timer = setTimeout(() => {
          this.takeLoading = false;
          this.reload();
          clearTimeout(timer);
        }, 1000);
      }
    },
  },
  components: {
    Buttons: () => import('@/components/basic/buttons'),
  },
  computed: {
    ...mapState(['ethersprovider', 'ethAddress']),
  },
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