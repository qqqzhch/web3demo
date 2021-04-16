<template>
  <div class="assetTable-warpper">
    <div class="title-warpper">
      <p>Synth Assets</p>
      <span>≈ ${{ assetTotalValue | formatNormalValue }}</span>
    </div>

    <Table :columns="tableData" :data="synthAssets" height="420">
      <template slot="symbol" slot-scope="{ row }">
        <div class="Symbol flex items-center">
          <img width="32" src="../../../assets/img/eth48.png">
          <p>{{ row.symbol }}</p>
        </div>
      </template>
      <template slot="assetAmount" slot-scope="{ row }">
        <div class="Amount">
          <p class="Amount">
            {{ BigNumber(row.assetAmount).decimalPlaces(6) }}
          </p>
        </div>
      </template>
      <template slot="assetValue" slot-scope="{ row }">
        <div class="Value">
          <p>
            {{ row.price ? BigNumber(row.assetAmount).times(row.price).decimalPlaces(6) : '--' }}
          </p>
        </div>
      </template>
    </Table>
  </div>
</template>

<script src="./index.js"></script>

<style lang="less" scoped>
.assetTable-warpper {
  margin-top: 10px;
  width: 100%;
  height: 526px;
  background: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  .title-warpper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 20px;
    p {
      height: 24px;
      font-size: 20px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #14171c;
      line-height: 24px;
    }
    span {
      height: 19px;
      font-size: 16px;
      font-family: Gilroy-Medium, Gilroy;
      font-weight: 500;
      color: #0058ff;
      line-height: 19px;
    }
  }
  .Symbol {
    img {
      max-width: 24px;
      margin-right: 10px;
    }
  }
}
</style>
