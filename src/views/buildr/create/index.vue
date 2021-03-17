<template>
  <div class="create box-shadow">
    <div class="header">
      <div class="title">
        抵押数字资产创建金库
      </div>
      <div class="info">
        创建金库可获得scUSD的铸造额度
      </div>
    </div>
    <div class="grid-2 mrg-tb-20">
      <div class="content-left">
        <div class="select-coins">
          <Select
            v-model="defaultPoolToken"
            class="input-inner"
          >
            <Option
              v-for="item in collateralPools"
              :key="item.name"
              :value="item.token"
              :selected="item.name === defaultPoolToken"
            >
              {{ item.name }}
            </Option>
          </Select>
        </div>
        <div class="grid-2 mrg-t-20 mrg-b-5">
          <div>
            抵押
          </div>
          <div class="pull-right">
            <span class="f-gray">余额：</span>{{ currencyNumber }} LAMB
          </div>
        </div>
        <ScInput
          title=""
          unit="LAMB"
          placetext="请输入数量"
          :on-change="onChangePledgeNumber"
        />
        <div class="grid-2 mrg-t-20">
          <div class="title">
            可获得的授信额度
          </div>
          <div class="pull-right" />
        </div>
        <ScInput
          title=""
          unit="scUSD"
          :default-value="stableNumber"
          disabled="true"
        />
      </div>
      <div class="content-right">
        <div class="build-grid-2 mrg-b-5">
          <div>抵押物：</div>
          <div class="text-right">
            {{ pledgeNumber }} LAMB
          </div>
        </div>
        <div class="build-grid-2 mrg-b-5">
          <div>获得铸造scUSD授信额度：</div>
          <div class="text-right">
            {{ stableNumber }} scUSD
          </div>
        </div>
        <!--<div class="build-grid-2 mrg-b-5">-->
        <!--<div>抵押率：</div>-->
        <!--<div class="text-right">-->
        <!--{{ BigNumber(targetRX).times(100) }}%-->
        <!--</div>-->
        <!--</div>-->
        <div class="line mrg-tb-10" />
        <div class="build-grid-2 mrg-b-5">
          <div>SuperCash {{ defaultPoolToken }}价格：</div>
          <div class="text-right">
            {{ BigNumber(currencyPrice).toFixed(6) }} USD
          </div>
        </div>
        <div class="build-grid-2 mrg-b-5">
          <div>清算价格：</div>
          <div class="text-right">
            {{ pledgeNumber ? BigNumber(liquidationRatio).times(stableNumber).div(pledgeNumber) : 0 }} USD
          </div>
        </div>
        <div class="line mrg-tb-10" />
        <div class="build-grid-2 mrg-b-5">
          <div>清算抵押率：</div>
          <div class="text-right">
            {{ liquidationRatio * 100 }}%
          </div>
        </div>
        <div class="build-grid-2 mrg-b-5">
          <div>稳定费率：</div>
          <div class="text-right">
            {{ BigNumber(feeRate).times(100) }} %
          </div>
        </div>
        <div class="build-grid-2 mrg-b-5">
          <div>全球scUSD债务上限：</div>
          <div class="text-right">
            {{ debtCap }} scUSD
          </div>
        </div>
        <div class="line mrg-tb-10" />
        <div class="mrg-tb-20">
          <button
            v-if="allowanceAmount === 0"
            class="btn"
            @click="onApproveClick"
          >
            授权额度
          </button>
          <button
            else
            class="btn"
            @click="onJoinClick"
          >
            铸造 scUSD 额度
          </button>
        </div>
      </div>
    </div>
    <haveSendDialog ref="haveSendtx" />
  </div>
</template>

<script src="./index.js"></script>

<style lang="less" scoped>
  .grid-2 {
    display: grid;
    grid-template-columns: 45% 45%;
    justify-content: space-between;
  }
  .build-grid-2 {
    display: grid;
    grid-template-columns: 70% 30%;
    justify-content: space-between;
  }
  .line {
    border-bottom: 1px dashed #EAEAEA;
  }
  .create {
    margin-left: 100px;
    .title {
      font-size: 20px;
      color: #14171c;
    }
    .info {
      font-size: 14px;
      color: #828489;
    }
    .content-left {
      .title {
        margin: 20px 0px 10px 0px;
        font-size: 16px;
        color: #14171c;
      }
    }
    .pull-right {
      text-align: right;
    }

    .content-right {
      .btn{
        line-height: 60px;
        height: 60px;
        padding-top: 3px;
        background-color: #0058FF;
        color: #ffffff;
        &:hover {
          background-color: #0547ff;
        }
      }
    }

  }

</style>
