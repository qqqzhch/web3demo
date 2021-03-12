<template>
  <div class="manage">
    <div class="content">
      <ul>
        <li>抵押资产</li>
        <li><span>300000</span> LAMB</li>
      </ul>
      <ul>
        <li>当前债务</li>
        <li><span>-100</span> scUSD </li>
      </ul>
      <ul>
        <li>当前抵押率(最低200%)</li>
        <li><span class="f-green">502%</span></li>
      </ul>
      <ul>
        <li>当前价格</li>
        <li><span>1.5524</span> $</li>
      </ul>
      <ul>
        <li>清算价格</li>
        <li><span>0.32</span> $</li>
      </ul>
    </div>
    <div class="box-shadow mrg-tb-20">
      <div class="info">
        <span class="f-gray">授信额度：</span><span class="f-size-20">23332</span> CUSD
      </div>
      <div class="grid-2">
        <ScInput
          title="偿还"
          unit="CUSD"
        />
        <ScInput
          title="提取"
          unit="CUSD"
        />
      </div>
      <div class="grid-2">
        <div class="grid-2 actions">
          <div class="tips">
            抵押率蒋调整为<span class="f-green">+800%</span>
          </div>
          <div class="pull-right">
            <button class="btn">
              偿还scUSD债务
            </button>
          </div>
        </div>
        <div class="grid-2 actions">
          <div class="tips">
            抵押率蒋调整为 <span class="f-red">+260%</span>
          </div>
          <div>
            <button class="btn">
              提取授信的scUSD
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="box-shadow mrg-tb-20">
      <div class="info">
        <span class="f-gray">可释放：</span><span class="f-size-20">23332</span> LAMB
      </div>
      <div class="grid-2">
        <ScInput
          title="抵押"
          unit="LAMB"
        />
        <ScInput
          title="提取"
          unit="LAMB"
        />
      </div>
      <div class="grid-2">
        <div class="grid-2 actions">
          <div class="tips">
            抵押率蒋调整为<span class="f-green">+650%</span>
          </div>
          <div class="pull-right">
            <button class="btn">
              抵押LAMB
            </button>
          </div>
        </div>
        <div class="grid-2 actions">
          <div class="tips">
            抵押率蒋调整为 <span class="f-red">+370%</span>
          </div>
          <div>
            <button class="btn">
              释放LAMB
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./index.js"></script>

<style lang="less" scoped>
  .manage {
    margin-left: 100px;
    .content {
      margin-top: 24px;
      padding-bottom: 24px;
      /*border-bottom: 1px dashed #f1f1f1;*/
      ul {
        display: inline-block;
        width: 20%;
        li:first-child {
          color: #828489;
          margin-bottom: 10px;
        }
        li > span {
          font-size: 30px;
        }
      }
    }
    .actions {
      margin-top: 20px;
      .tips {
        color: #828489;
      }
      .btn{
        line-height: 40px;
        height: 40px;
        padding-top: 3px;
        background-color: #0058FF;
        color: #ffffff;
        &:hover {
          background-color: #0547ff;
        }
      }
    }
    .info {
      margin: 0px 0px 10px 0px;
      text-align: right;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 45% 45%;
      justify-content: space-between;
    }
  }
</style>
