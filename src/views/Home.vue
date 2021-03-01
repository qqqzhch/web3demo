<template>
  <div class="connect-wrapper flex justify-between items-center">
    <div class="left-wrapper">
      <p class="title">
        Transgo Bridge
      </p>
      <p class="subTitle">
        通过 TransGo 跨链协议实现各类资产在以太坊、Heco、BSV、OKExChain等的无摩擦跨链互通
      </p>
      <img
        src="../assets/img/img1.png"
        alt="bitcoin"
      >
    </div>
    <div class="right-wrapper">
      <transfer />
    </div>
  </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {
    transfer: () => import('./transfer/transfer.vue')
  },
};
</script>

<style lang="less" scoped>
.connect-wrapper {
  margin-top: 40px;
  .left-wrapper {
    width: 340px;
    margin-left: 120px;
    margin-right: 120px;
    .title {
      font-size: 40px;
      font-weight: bold;
      color: #14171c;
      line-height: 49px;
    }
    .subTitle {
      margin-top: 16px;
      font-size: 15px;
      font-weight: 400;
      color: #14171c;
      line-height: 22px;
    }
    img {
      margin-top: 20px;
    }
  }
  .right-wrapper {
    width: 500px;
    margin-right: 120px;
    margin-bottom: 113px;
    background: #ffffff;
    box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
    border-radius: 12px;
    padding: 36px 44px;
  }
}
</style>