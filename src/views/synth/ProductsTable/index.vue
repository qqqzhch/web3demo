<template>
  <div class="proTable-warpper">
    <div class="button-warpper">
      <button
        v-for="(typeItem, index) in productTypes"
        :key="index"
        :class="{'active': productType === typeItem.value }"
        @click="changeProductType(typeItem)"
      >
        {{ typeItem.label }}
      </button>
    </div>
    <div class="input-warpper">
      <img src="../../../assets/img/serch.svg" alt="serch">
      <input
        type="text"
        placeholder="Search"
        @keyup="onSearchProduct"
      >
    </div>
    <div class="table-warpper">
      <Table
        :row-class-name="rowClassName"
        :columns="productsCols"
        :data="isSearch ? searchProducts : products"
        height="720"
        @on-row-click="onRowClick"
      >
        <template slot="symbol" slot-scope="{ row }">
          <div class="symbol flex items-center">
            <img width="32" src="../../../assets/img/eth48.png">
            <p>{{ row.symbol }}</p>
          </div>
        </template>
        <template slot="price" slot-scope="{ row }">
          <div class="price">
            <p class="price">
              $ {{ row.price }}
            </p>
          </div>
        </template>
        <template slot="changeRate" slot-scope="{ row }">
          <div class="Change">
            <p>
              +{{ row.changeRate }}%
            </p>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script src="./index.js"></script>

<style lang="less">
  .ivu-table .table-row-active td{
    background-color: #f0faff;
  }

  .proTable-warpper {
    width: 100%;
    padding: 20px 0;
    height: 858px;
    background: #ffffff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.06);
    border-radius: 12px;
    .button-warpper {
      width: 100%;
      padding: 0px 20px;
      display: flex;
      // justify-content: space-between;
      button {
        width: 23%;
        height: 39px;
        background: #ffffff;
        border-radius: 20px;
        border: 1px solid rgba(0, 0, 0, 0.06);
        font-size: 16px;
        font-family: Gilroy-Medium, Gilroy;
        font-weight: 500;
        color: #14171c;
        line-height: 39px;
        margin-right: 10px;
      }
      .active {
        border: 1px solid #0058ff;
        color: #0058ff;
      }
    }
    .input-warpper {
      margin: 16px 20px 0px;
      width: 90%;
      height: 40px;
      background: #f7f8f9;
      border-radius: 20px;
      overflow: hidden;
      position: relative;
      input {
        width: 100%;
        height: 100%;
        background: transparent;
        padding-left: 40px;
      }
      img {
        position: absolute;
        left: 16px;
        top: 12px;
      }
    }
    .table-warpper {
      .symbol {
        img {
          max-width: 24px;
          margin-right: 10px;
        }
      }
    }
  }
</style>
