<template>
  <div class="table-warpper">
    <Table :columns="tableData" :data="list">
      <template slot="Symbol" slot-scope="{ row }">
        <div class="Symbol flex items-center">
          <img width="32" src="../../../assets/img/eth48.png">
          <p>cUSD/USD</p>
        </div>
      </template>
      <template slot="Action" slot-scope="{ row }">
        <div class="Action">
          <p class="Action">
            {{ row.Action }}
          </p>
        </div>
      </template>
      <template slot="Amount" slot-scope="{ row }">
        <div class="Amount">
          <p>
            {{ row.Amount }}
          </p>
        </div>
      </template>
      <template slot="Status" slot-scope="{ row }">
        <div class="Status">
          <p :class="row.Status=='Fail'? 'Fail':'Executed'">
            {{ row.Status }}
          </p>
        </div>
      </template>
      <template slot="Date" slot-scope="{ row }">
        <div class="Date">
          <p>
            {{ row.Date }}
          </p>
        </div>
      </template>
    </Table>
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
</style>
