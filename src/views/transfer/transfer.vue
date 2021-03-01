<template>
  <div class="connect-content">
    <div
      class="asset-item cursor-pointer"
      @click="openAsset"
    >
      <p class="card-title">
        Asset
      </p>
      <div class="connect flex justify-between items-center">
        <div class="icon-wrapper flex justify-start items-center">
          <template>
            <img
              v-if="token === 'ETH'"
              src="../../assets/img/eth.png"
              alt="eth"
              class="mr-2"
            >
            <img
              v-if="token === 'USDT'"
              src="../../assets/img/usdt.png"
              alt="eth"
              class="mr-2"
            >
            <img
              v-if="token === 'LAMB'"
              src="../../assets/img/lamblogo-32.png"
              alt="eth"
              class="mr-2"
            >
            <img
              v-if="token === 'mLAMB'"
              src="../../assets/img/mlamb48.svg"
              alt="eth"
              class="mr-2"
            >
            <img
              v-if="token === 'tLAMB'"
              src="../../assets/img/tlamb48.svg"
              alt="eth"
              class="mr-2"
            >
          </template>
          <span>{{ token }}</span>
        </div>
        <div class="arrow-wrapper">
          <img
            src="../../assets/img/right.svg"
            alt="right-arrow"
          >
        </div>
      </div>
    </div>

    <div class="move-item flex justify-between items-center">
      <div class="from-item card-item">
        <p class="card-title">
          From
        </p>
        <div class="main">
          <img
            src="../../assets/img/eth48.png"
            alt="eth48"
            class="mb-2"
          >

          <div class="net-name-wrapper">
            <span class="name">Ethereum Network</span>
            <div
              v-if="!isShowFromNet"
              class="arrow cursor-pointer"
            >
              <img
                src="../../assets/img/downArrow.svg"
                alt="down-arrow"
                @click="showFromNet"
              >
            </div>
            <div
              v-else
              v-clickoutside="closeSelect"
              class="arrow arrow-top cursor-pointer"
            >
              <img
                src="../../assets/img/arrow-topn-14.png"
                alt="down-arrow"
                @click="showFromNet"
              >

              <div class="networkList">
                <div
                  class="networkList-item"
                  @click="selectFromNet('Ethereum')"
                >
                  <p>Ethereum Network</p>
                  <div class="arrow-warpper">
                    <img
                      :class="selectFromItem == 'Ethereum' ? 'active' : ''"
                      src="../../assets/img/check-blue-24.png"
                    >
                  </div>
                </div>
                <div
                  class="networkList-item"
                  @click="selectFromNet('Lambda')"
                >
                  <p>Lambda Network</p>
                  <div class="arrow-warpper">
                    <img
                      :class="selectFromItem == 'Lambda' ? 'active' : ''"
                      src="../../assets/img/check-blue-24.png"
                    >
                  </div>
                </div>
                <div
                  class="networkList-item"
                  @click="selectFromNet('BSC')"
                >
                  <p>Binance Smart Chain Network</p>
                  <div class="arrow-warpper">
                    <img
                      :class="selectFromItem == 'BSC' ? 'active' : ''"
                      src="../../assets/img/check-blue-24.png"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="arrow-item">
        <img
          src="../../assets/img/bigRight.svg"
          alt="big-right-arrow"
        >
      </div>

      <div class="to-item card-item">
        <p class="card-title">
          To
        </p>
        <div class="main">
          <div class="flex justify-between items-center">
            <img
              src="../../assets/img/binance48.svg"
              alt="binance48"
              class="mb-2"
            >
            <div v-if="Connected">
              <div class="metamask-img">
                <img
                  src="../../assets/img/metamask18.svg"
                  class="float-right"
                >
              </div>
              <div class="btn-item">
                <a>Connected</a>
              </div>
            </div>
          </div>

          <div class="net-name-wrapper">
            <span class="name">Binance Smart Chain Network</span>
            <div
              v-if="!isShowToNet"
              class="arrow cursor-pointer"
            >
              <img
                src="../../assets/img/downArrow.svg"
                alt="down-arrow"
                @click="showToNetwork"
              >
            </div>

            <div
              v-else
              v-clickoutside="closeSelect"
              class="arrow arrow-top cursor-pointer"
            >
              <img
                src="../../assets/img/arrow-topn-14.png"
                alt="down-arrow"
                @click="showToNetwork"
              >

              <div class="networkList">
                <div
                  class="networkList-item"
                  @click="selectToNet('Ethereum')"
                >
                  <p>Ethereum Network</p>
                  <div class="arrow-warpper">
                    <img
                      :class="selectToItem == 'Ethereum' ? 'active' : ''"
                      src="../../assets/img/check-blue-24.png"
                    >
                  </div>
                </div>
                <div
                  class="networkList-item"
                  @click="selectToNet('Lambda')"
                >
                  <p>Lambda Network</p>
                  <div class="arrow-warpper">
                    <img
                      :class="selectToItem == 'Lambda' ? 'active' : ''"
                      src="../../assets/img/check-blue-24.png"
                    >
                  </div>
                </div>
                <div
                  class="networkList-item"
                  @click="selectToNet('BSC')"
                >
                  <p>Binance Smart Chain Network</p>
                  <div class="arrow-warpper">
                    <img
                      :class="selectToItem == 'BSC' ? 'active' : ''"
                      src="../../assets/img/check-blue-24.png"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="waringNotice"
      class="notice-warpper warning-notice"
    >
      <div class="notice-content">
        <img src="../../assets/img/notice-yellow.png">
        <p>please connect Lambda Wallet</p>
      </div>
    </div>
    <div
      v-if="networkNotice"
      class="notice-warpper"
    >
      <div class="notice-content">
        <img src="../../assets/img/notice-red.png">
        <p>The current two networks do not support operations</p>
      </div>
    </div>

    <div class="amount-wrapper">
      <div class="title-content">
        <span class="card-title">Amount</span>
        <div class="balance-item">
          <span class="mr-2 text-secondary">Balance</span>
          <span>0.00 ETH</span>
        </div>
      </div>
      <div class="input-wrapper">
        <input
          v-model="amount"
          type="text"
          class="amount-input"
        >
      </div>
      <div class="result-wrapper">
        <p class="flex justify-start items-center">
          <span class="text-secondary mr-2">You will receive ≈</span>
          <img
            class="mr-1"
            src="../../assets/img/eth14.png"
            alt="eth14"
          >
          <span class="text-primary">0.00 ETH</span>
        </p>
      </div>
    </div>

    <div
      v-if="inputNotice"
      class="notice-warpper"
    >
      <div class="notice-content">
        <img src="../../assets/img/notice-red.png">
        <p>Input quantity cannot be greater than wallet balance</p>
      </div>
    </div>

    <div class="dest-wrapper">
      <p class="card-title">
        Destination
      </p>
      <div class="input-wrapper flex justify-between items-center">
        <img
          src="../../assets/img/metamask18.svg"
          alt="metamask18"
          class="mr-2"
        >
        <input
          v-model="ethAddress"
          readonly
          type="text"
          class="dest-input"
        >
      </div>
    </div>

    <div class="btn-wrapper mt-8">
      <buttons
        v-if="!ethAddress"
        width="100%"
        height="48px"
        @click.native="openConnect"
      >
        Connect Wallet
      </buttons>

      <buttons
        v-else-if="ethAddress && amount !== ''"
        width="100%"
        height="48px"
      >
        Next
      </buttons>

      <buttons
        v-else-if="ethAddress && amount === ''"
        width="100%"
        height="48px"
        class="disableBtn"
      >
        Next
      </buttons>

      <!-- <buttons
        v-else
        width="100%"
        height="48px"
        class="disableBtn"
      >
        Loading
      </buttons> -->
    </div>

    <div class="modal-wrapper">
      <assetDialog ref="asset" />
      <succesDialog ref="succes" />
      <walletdialog ref="wallet" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Web3 from 'web3';
export default {
  components: {
    buttons: () => import('@/components/basic/buttons'),
    assetDialog: () => import('@/views/transfer/dialog/assetDialog'),
    succesDialog: () => import('@/views/transfer/dialog/succesDialog'),
    walletdialog: () => import('@/views/transfer/dialog/walletDialog'),
  },
  data() {
    return {
      isShowFromNet: false,
      isShowToNet: false,
      selectFromItem: '',
      selectToItem: '',
      networkNotice: false,
      waringNotice: false,
      inputNotice: false,
      Connected: true,
      amount: '',
      isConnectEth: false,
    };
  },
  methods: {
    closeSelect() {
      this.isShowToNet = false;
      this.isShowFromNet = false;
    },
    openAsset() {
      this.$refs.asset.open();
    },
    openConnect() {
      this.$refs.wallet.open();
    },
    showFromNet() {
      this.isShowFromNet = !this.isShowFromNet;
    },
    showToNetwork() {
      this.isShowToNet = !this.isShowToNet;
    },
    selectFromNet(net) {
      this.selectFromItem = net;
      this.isShowFromNet = false;
    },
    selectToNet(net) {
      this.selectToItem = net;
      this.isShowToNet = false;
    },

    // 检查是否连接
    async isEthConnect() {
      try {
        const res = await window.web3.eth.getCoinbase();
        return res;
      } catch (error) {
        console.log(error);
      }
    },

    // 获取以太坊chainID
    async getEthChainID() {
      try {
        const res = await window.web3.eth.getChainId();
        // if (res !== 256) {
        //   this.$Notice.warning({
        //     title: this.$t('notice.n'),
        //     desc: this.$t('notice.n34'),
        //     duration: 0,
        //   });
        // }
        this.$store.commit('changeEthChainID', res);
      } catch (error) {
        console.log(error);
        // this.$Notice.warning({
        //   title: this.$t('notice.n'),
        //   desc: this.$t('notice.n2'),
        // });
      }
    },

    // 获取当前连接的eth地址
    async getCurrentAccount() {
      try {
        const res = await window.web3.eth.getAccounts();
        if (res.length < 1) {
          // this.$Notice.warning({
          //   title: this.$t('notice.n'),
          //   desc: this.$t('notice.n7'),
          // });
          return false;
        }
        this.$store.commit('changeEthAddress', res[0]);
      } catch (error) {
        console.log(error);
        // this.$Notice.warning({
        //   title: this.$t('notice.n'),
        //   desc: this.$t('notice.n8'),
        // });
      }
    },
    // 将切换后的账户及时更新
    checkAccount(accounts) {
      if (accounts.length === 0) {
        // console.log('Please connect to MetaMask.');
        // console.log("未连接账户");
        // this.$Notice.warning({
        //   title: this.$t('notice.n'),
        //   desc: this.$t('notice.n9'),
        // });
      } else if (accounts[0] !== this.ethAddress) {
        this.$store.commit('changeEthAddress', accounts[0]);
      }
    },

    // 检测eth账号切换
    checkStatus() {
      window.ethereum.on('accountsChanged', (accounts) => {
        this.checkAccount(accounts);
        window.location.reload();
      });
      window.ethereum.on('networkChanged', (network) => {
        this.$store.commit('changeEthChainID', network);
        // this.$Notice.warning({
        //   title: this.$t('notice.n'),
        //   desc: this.$t('notice.n10'),
        // });
        // 切换后刷新页面从而刷新相关的数据
        const timer = setTimeout(() => {
          window.location.reload();
          clearTimeout(timer);
        }, 1000);
      });
    },

    // eth初始化
    async initEth() {
      try {
        let web3Provider;

        if (window.ethereum) {
          web3Provider = window.ethereum;
        } else if (window.web3) {
          // 老版 MetaMask Legacy dapp browsers...
          web3Provider = window.web3.currentProvider;
        } else {
          // this.$Notice.warning({
          //   title: this.$t('notice.n'),
          //   desc: this.$t('notice.n11'),
          // });
          return false;
        }
        window.web3 = new Web3(web3Provider);
        const isConnect = await this.isEthConnect();

        if (!isConnect) {
          // this.$Notice.warning({
          //   title: this.$t('notice.n'),
          //   desc: this.$t('notice.n1'),
          // });
          return false;
        } else {
          // 获取当前chainId
          await this.getEthChainID();

          // 初始化合约
          // await this.initContract();
          // window.ethersprovider = new ethers.providers.Web3Provider(web3Provider);

          // 检测状态切换
          this.checkStatus();

          // 获取当前账号地址
          await this.getCurrentAccount();

          // 获取tlamb余额
          // this.getTlambBalance();
        }
      } catch (error) {
        console.log(error);
        // this.$Notice.warning({
        //   title: this.$t('notice.n12'),
        // });
      }
    },
  },
  computed: {
    ...mapState(['token', 'ethAddress']),
  },
  created() {
    this.initEth();
  },
};
</script>

<style lang="less" scoped>
.connect-content {
  .asset-item {
    .connect {
      width: 100%;
      height: 44px;
      background: #f7f8f9;
      padding: 0 16px;
      .icon-wrapper {
        img {
          max-width: 24px;
        }
      }
    }
  }

  .move-item {
    margin-top: 32px;
    margin-bottom: 32px;
    .card-item {
      .main {
        width: 174px;
        height: 128px;
        background: #ffffff;
        box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.06);
        border-radius: 6px;
        padding: 16px;
        .net-name-wrapper {
          // overflow: hidden;
          margin-top: 16px;
          .name {
            width: 96px;
            font-size: 14px;
            font-weight: 500;
            color: #14171c;
            line-height: 16px;
            float: left;
          }
          .arrow {
            float: right;
            width: 24px;
            height: 24px;
            background: #f7f8f9;
            border-radius: 4px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            position: relative;
            img {
              width: 22px;
            }
            .networkList {
              background: #ffffff;
              position: absolute;
              left: 0;
              bottom: -120px;
              .networkList-item {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                width: 248px;
                height: 40px;
                box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.06);
                p {
                  width: 195px;
                  height: 16px;
                  font-size: 14px;
                  font-family: Gilroy-Medium, Gilroy;
                  font-weight: 500;
                  color: #14171c;
                  line-height: 16px;
                }
                img {
                  display: none;
                }
                .active {
                  display: inline-block;
                }
              }
              .networkList-item:hover {
                background: #f7f8f9;
              }
            }
          }
          .arrow-top {
            background: #0058ff;
          }
        }
      }
    }
    .to-item {
      .metamask-img::after{
        content: "";
        display: block;
        clear: both;
        zoom: 1;
      }
      .btn-item {
        margin-top: 4px;
        width: 70px;
        text-align: center;
        height: 22px;
        background: rgba(00, 208, 75, 0.2);
        border-radius: 4px;
        line-height: 22px;
        a {
          font-size: 10px;
          font-family: Gilroy-Regular, Gilroy;
          font-weight: 400;
          color: #00d075;
        }
      }
    }
    .arrow-item {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 28px;
      height: 28px;
      background: #f7f8f9;
      border-radius: 4px;
    }
  }

  .amount-wrapper {
    .title-content {
      overflow: hidden;
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
    .input-wrapper {
      width: 100%;
      height: 72px;
      background: #f7f8f9;
      border-radius: 6px;
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
    .result-wrapper {
      margin-top: 8px;
      font-size: 12px;
    }
  }

  .dest-wrapper {
    margin-top: 32px;
    .input-wrapper {
      width: 100%;
      height: 44px;
      background: #f7f8f9;
      border-radius: 6px;
      padding: 12px;
      .dest-input {
        width: 100%;
        height: 100%;
        outline: none;
        border: none;
        color: #14171c;
        background: #f7f8f9;
        font-size: 14px;
        line-height: 16px;
      }
    }
  }

  .notice-warpper {
    display: none;
    .notice-content {
      margin: 20px 0;
      display: flex;
      align-items: center;
      padding: 9px 30px;
      width: 412px;
      height: 32px;
      background: rgba(255, 60, 0, 0.1);
      border-radius: 4px;
      img {
        margin-right: 10px;
      }
      p {
        font-size: 12px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #ff3c00;
        line-height: 14px;
      }
    }
  }
  .warning-notice {
    .notice-content {
      background: rgba(255, 181, 0, 0.1);
      p {
        color: #ffb500;
      }
    }
  }
}
</style>