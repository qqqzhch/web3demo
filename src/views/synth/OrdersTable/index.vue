<template>
  <div class="table-warpper">
    <div v-if="!ethAddress||list.length==0" class="noData-wapper">
      <div class="flex flex-col items-center">
        <img src="../../../assets/img/noData.png" alt="noData">
        <p> {{ $t('build-No-Data') }}</p>
      </div>
    </div>
    <Scroll v-else :loading-text="'loading....'" :on-reach-bottom="onReachBottom" :height="360">
      <Table :columns="tableData" :data="list">
        <template slot="tokenA" slot-scope="{ row }">
          <div class="Symbol flex items-center">
            <img width="32" src="../../../assets/img/eth48.png">
            <p>{{ row.tokenA }}</p>
          </div>
        </template>
        <template slot="actions" slot-scope="{ row }">
          <div class="Action">
            <p class="Action">
              {{ row.actions }}
            </p>
          </div>
        </template>
        <template slot="amountA" slot-scope="{ row }">
          <div class="Amount">
            <p>
              {{ row.amountA | formatNormalValue }}
            </p>
          </div>
        </template>
        <template slot="status" slot-scope="{ row }">
          <div class="Status">
            <p :class="row.status=='Executed'? 'Executed' : 'Fail'">
              {{ row.status }}
            </p>
          </div>
        </template>
        <template slot="date" slot-scope="{ row }">
          <div class="Date">
            <p>
              {{ row.date }}
            </p>
          </div>
        </template>
      </Table>
    </Scroll>
  </div>
</template>

<script src="./index.js"></script>

<style lang="less" scoped>
.table-warpper {
  margin-top: 10px;
  width: 100%;
  height: 360px;
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 30px 44px;
  p {
    font-size: 16px;
    font-family: Gilroy-Medium, Gilroy;
    font-weight: 500;
    color: #14171c;
    line-height: 19px;
  }
  .Symbol {
    img {
      max-width: 24px;
      margin-right: 10px;
    }
  }
  .Executed {
    color: #00d075;
  }
  .Fail {
    color: #ff3c00;
  }
}
.noData-wapper {
  width: 100%;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    max-width: 80px;
  }
  p {
    margin-top: 8px;
    height: 16px;
    font-size: 14px;
    font-family: Gilroy-Medium, Gilroy;
    font-weight: 500;
    color: #8690a8;
    line-height: 16px;
  }
}
</style>
