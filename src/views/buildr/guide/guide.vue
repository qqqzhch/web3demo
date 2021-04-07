<template>
  <div class="guide-warpper">
    <h2 class="buildr-title">
      {{ $t('build-title-1') }}
    </h2>
    <h2 class="buildr-title">
      {{ $t('build-title-2') }}
    </h2>
    <div class="list-warpper">
      <div class="list-item">
        <div class="img-wapper">
          <img src="../../../assets/img/itemImg.png">
          <p>{{ $t('build-start-mining') }} </p>
        </div>
        <span>{{ $t('build-get-super') }} </span>
      </div>
      <div class="list-item">
        <div class="img-wapper">
          <img src="../../../assets/img/itemImg.png">
          <p>{{ $t('build-synthetize-assets') }} </p>
        </div>
        <span>{{ $t('build-trade-BTC') }}</span>
      </div>
      <div class="list-item">
        <div class="img-wapper">
          <img src="../../../assets/img/itemImg.png">
          <p>{{ $t('build-create-vaults') }} </p>
        </div>
        <span>{{ $t('build-get-huge') }}</span>
      </div>
    </div>
    <div class="button-wapper">
      <p @click="CreateCDP">
        {{ $t('build-create-vaults') }}
      </p>
    </div>
  </div>
</template>

<script src="./index.js"></script>

<style lang="less" scoped>
.guide-warpper {
  padding: 80px;
  min-height: calc(100vh - 250px);
  background-image: url("../../../assets/img/buildr-bg.png");
  background-size: 100% 100%;
  .buildr-title {
    font-size: 40px;
    font-family: Gilroy-Bold, Gilroy;
    font-weight: bold;
    color: #14171c;
    line-height: 49px;
  }
  .list-warpper {
    .list-item {
      margin-top: 16px;
      .img-wapper {
        display: flex;
        align-items: center;
        img {
          max-width: 12px;
          max-height: 12px;
        }
        p {
          height: 24px;
          font-size: 20px;
          font-family: Gilroy-Medium, Gilroy;
          font-weight: 500;
          color: #0058ff;
          line-height: 24px;
          margin-left: 10px;
        }
      }
      span {
        height: 22px;
        font-size: 16px;
        font-family: Gilroy-Regular, Gilroy;
        font-weight: 400;
        color: #14171c;
        line-height: 19px;
        margin-top: 4px;
      }
    }
  }
  .button-wapper {
    cursor: pointer;
    width: 180px;
    height: 48px;
    background-image: url("../../../assets/img/buttonBg.png");
    background-size: 100%;
    margin-top: 70px;
    p {
      width: 100%;
      text-align: center;
      height: 100%;
      font-size: 16px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #ffffff;
      line-height: 48px;
      background: linear-gradient(90deg, #fc466b 0%, #3f5efb 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}
</style>
