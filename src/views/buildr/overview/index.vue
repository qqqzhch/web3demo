<template>
  <div class="overview-warp">
    <div class="title">
      数据总览
    </div>
    <div class="content">
      <ul>
        <li>总抵押物价值</li>
        <li><span>10000</span> $</li>
      </ul>
      <ul>
        <li>总负债</li>
        <li><span>-100</span> scUSD </li>
      </ul>
      <ul>
        <li>授信的CUSD</li>
        <li><span>-2000</span> scUSD </li>
      </ul>
      <ul>
        <li>稳定费</li>
        <li><span>123</span> scUSD</li>
      </ul>
    </div>
  </div>
</template>

<script src="./index.js"></script>

<style lang="less" scoped>
  .overview-warp {
    margin-left: 100px;
    .title {
      font-size: 20px;
      font-weight: 500;
      color: #14171C;
      line-height: 24px;
    }
    .content {
      margin-top: 24px;
      ul {
        display: inline-block;
        width: 25%;
        li:first-child {
          color: #828489;
          margin-bottom: 10px;
        }
        li > span {
          font-size: 30px;
        }
      }
    }
  }
</style>
