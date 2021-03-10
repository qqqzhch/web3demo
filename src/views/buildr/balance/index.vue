<template>
  <div class="balance">
    <div class="title">
      我的金库
    </div>
    <div class="content">
      <div class="build-item item-active">
        <ul>
          <li>LAMB</li>
          <li>500%</li>
        </ul>
        <div class="pull-right">
          <div class="build-done">
            已创建
          </div>
        </div>
      </div>
      <div class="build-item">
        <ul>
          <li>HT</li>
          <li>500%</li>
        </ul>
        <div class="pull-right">
          <button class="btn">
            铸造scUSD
          </button>
        </div>
      </div>
      <div class="build-item">
        <ul>
          <li>ETH</li>
          <li>500%</li>
        </ul>
        <div class="pull-right">
          <button class="btn">
            铸造scUSD
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./index.js" ></script>
<style lang="less" scoped>
  .balance {
    margin-top: 24px;
      .title {
          font-size: 20px;
          font-weight: 500;
          color: #14171C;
          line-height: 24px;
      }
      .content {
          position: relative;
          z-index: 100;
          margin-top: 20px;
          .build-item {
            position: relative;
            display: inline-block;
            margin-right: 20px;
            padding: 20px;
            width: 25%;
            cursor: pointer;
            box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.06);
            border-radius: 6px;
          }
          .item-active{
            background-color: #0058FF;
            color: #FFFFFF;
          }
          ul li{
              font-size: 20px;
          }
          .pull-right {
              position: absolute;
              top: 30px;
              right: 20px;
              color: #14171c66;
          }
          .btn{
              line-height: 40px;
              height: 40px;
              padding: 0px 20px;
              background-color: #0058FF;
              color: rgb(255, 255, 255);
          }
          .build-done {
            margin-top: 10px;
            color: #FFFFFF;
          }
      }
  }
</style>
