<template>
  <div class="asset-dialog">
    <Modal v-model="openAssetDialog" class-name="asset-modal" :transfer="true" :footer-hide="true" :closable="true">
      <div class="modal-content">
        <p slot="header" class="title text-center">
          Asset
        </p>
        <div class="input-warpper flex items-center">
          <img src="../../../assets/img/search-16.png">
          <input v-model="searchCon" type="text" @keyup="search">
        </div>
        <template v-for="(item, index) in tokenInfo">
          <div v-if="item.isNoUse === true" :key="index" class="asset-content" @click="selectToken(item.token)">
            <div class="flex justify-between items-center">
              <div class="con-wapper flex justify-between items-center">
                <template>
                  <img v-if="item.token === 'LAMB'" src="../../../assets/img/lambda48.svg" alt="lamb">
                  <img v-if="item.token === 'HT'" src="../../../assets/img/lambda48.svg" alt="HT">
                </template>
                <div class="text-warpper">
                  <p>{{ item.name }}</p>
                  <span>{{ item.desc }}</span>
                </div>
              </div>
              <div :class="token === item.token ? 'icon-active' : 'img-warpper'">
                <img src="../../../assets/img/check-blue-24.png">
              </div>
            </div>
          </div>
          <div v-else :key="index" class="asset-content disableAssets-warpper">
            <div class="flex justify-between items-center">
              <div class="con-wapper flex justify-between items-center">
                <template>
                  <img v-if="item.token === 'LAMB'" src="../../../assets/img/lambda48.svg" alt="lamb">
                  <img v-if="item.token === 'HT'" src="../../../assets/img/lambda48.svg" alt="HT">
                </template>
                <div class="text-warpper disableAssets">
                  <p>{{ item.name }}</p>
                  <span>{{ item.desc }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      tokenInfo: [],
      openAssetDialog: false,
      assetData: [],
      backupData: [],
      searchCon: '',
    };
  },
  methods: {
    filterAssetData() {
      if (!this.assetName) {
        this.assetData = this.assetFullData;
      }
      this.assetData = this.assetFullData.filter((item) => item.includes(this.assetName));
    },
    selectToken(token) {
      this.$store.commit('changeToken', token);
      this.openAssetDialog = false;
      this.searchCon = '';
    },
    open(data) {
      this.tokenInfo = data;
      this.assetData = Object.keys(data);
      this.backupData = this.assetData;
      this.openAssetDialog = true;
    },
    search() {
      const val = this.searchCon.toLowerCase();
      const newListData = [];

      if (val) {
        this.backupData.filter((item) => {
          if (item.toLowerCase().indexOf(val) !== -1) {
            newListData.push(item);
          }
        });
        this.assetData = newListData;
      } else {
        this.assetData = this.backupData;
      }
    },
  },
  computed: {
    ...mapState(['token']),
  },
};
</script>

<style lang="less" scoped>
.asset-modal {
  width: 452px;
  padding: 24px;
  .title {
    font-size: 24px;
    font-family: Gilroy-Medium, Gilroy;
    font-weight: 500;
    color: #14171c;
    line-height: 50px;
  }
  .input-warpper {
    padding: 5px 10px;
    width: 100%;
    height: 40px;
    background: #f7f8f9;
    border-radius: 6px;
    input {
      width: 80%;
      height: 100%;
      background: #f7f8f9;
      outline: none;
    }
  }

  .asset-content {
    cursor: pointer;
    margin-top: 20px;
    border-bottom: 1px solid #f7f8f9;
    padding: 12px 16px;
    // box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.06);
    img {
      max-width: 32px;
      margin-right: 16px;
    }
    .text-warpper {
      p {
        font-size: 16px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #14171c;
        line-height: 19px;
      }
      span {
        font-size: 12px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #828489;
        line-height: 14px;
      }
    }

    .img-warpper {
      display: none;
    }
    .icon-active {
      display: block;
    }
  }
  .disableAssets-warpper {
    cursor: not-allowed;
    img {
      opacity: 0.4;
    }
    .disableAssets {
      p {
        color: rgba(20, 23, 28, 0.4);
      }
      span {
        color: rgba(130, 132, 137, 0.4);
      }
    }
  }
}
</style>