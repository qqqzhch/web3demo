<template>
  <div class="create box-shadow">
    <div class="header">
      <div class="title">
        Designated Pool
      </div>
      <div class="info">
        Designated mining, users can enjoy lower risk mining with a super high yield.
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
            Asset
          </div>
          <div class="pull-right">
            <span class="f-gray">Balance：</span>{{ currencyNumber }} LAMB
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
            Build
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
          <div>Collateral：</div>
          <div class="text-right">
            {{ pledgeNumber }} LAMB
          </div>
        </div>
        <div class="build-grid-2 mrg-b-5">
          <div>Received scUSD：</div>
          <div class="text-right">
            {{ stableNumber }} scUSD
          </div>
        </div>
        <div class="build-grid-2 mrg-b-5">
          <div>Coll. Ratio：</div>
          <div class="text-right">
            {{ BigNumber(targetRX).times(100) }}%
          </div>
        </div>
        <div class="line mrg-tb-10" />
        <div class="build-grid-2 mrg-b-5">
          <div>SuperCash {{ defaultPoolToken }} Price：</div>
          <div class="text-right">
            {{ BigNumber(currencyPrice).toFixed(6) }} USD
          </div>
        </div>
        <div class="build-grid-2 mrg-b-5">
          <div>Liquidation Price：</div>
          <div class="text-right">
            {{ pledgeNumber ? BigNumber(liquidationRatio).times(stableNumber).div(pledgeNumber) : 0 }} USD
          </div>
        </div>
        <div class="line mrg-tb-10" />
        <div class="build-grid-2 mrg-b-5">
          <div>Liquidation Ratio：</div>
          <div class="text-right">
            {{ liquidationRatio * 100 }}%
          </div>
        </div>
        <div class="build-grid-2 mrg-b-5">
          <div>Stability Ratio：</div>
          <div class="text-right">
            {{ BigNumber(feeRate).times(100) }} %
          </div>
        </div>
        <div class="build-grid-2 mrg-b-5">
          <div>Global scUSD Debt Ceiling：</div>
          <div class="text-right">
            {{ debtCap }} scUSD
          </div>
        </div>
        <div class="line mrg-tb-10" />
        <div class="mrg-tb-20">
          <button
            v-if="BigNumber(pledgeNumber).gt(allowanceAmount)"
            class="btn"
            @click="onApproveClick"
          >
            Approve
          </button>
          <button
            v-else
            class="btn"
            @click="onJoinClick"
          >
            Create and generate scUSD
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
