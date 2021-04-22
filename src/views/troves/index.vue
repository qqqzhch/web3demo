<template>
  <div class="troves-wrapper">
    <div class="content">
      <div class="title-warpper">
        <div class="title-content">
          <img src="../../assets/img/import.svg" alt="import">
          <h2>Bot functionality</h2>
        </div>
        <p>Liquidation is expected to be carried out by bots.</p>
        <p>
          Early on you may be able to manually liquidate Troves, but as the system matures this will become less
          likely.
        </p>
      </div>
      <div class="liquidata">
        <div class="title-content">
          <img src="../../assets/img/paper.svg" alt="liquidata">
          <h2>Liquidate</h2>
        </div>
        <div class="input-warpper flex items-center">
          <p>Up to</p>
          <div class="input-item">
            <input type="number">
          </div>

          <p>Troves</p>
          <img src="../../assets/img/delete.svg" alt="delete">
        </div>
      </div>
    </div>
    <div class="list-wapper">
      <h2>Risky Troves</h2>
      <Table :columns="columns1" :data="data1">
        <template slot="Owner" slot-scope="{row}">
          <div class=" Owner">
            <p>{{ row.Owner }}</p>
          </div>
        </template>
        <template slot="Collateral" slot-scope="{row}">
          <div class=" Collateral">
            <p>{{ row.Collateral }}</p>
          </div>
        </template>
        <template slot="Debt" slot-scope="{row}">
          <div class=" Debt">
            <p>{{ row.Debt }}</p>
          </div>
        </template>
        <template slot="Coll.Ratio" slot-scope="{row}">
          <div class=" Coll.Ratio">
            <p>{{ row.Coll }}</p>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns1: [
        {
          title: "Owner",
          slot: "Owner",
          minWidth: 100,
        },
        {
          title: "Collateral",
          slot: "Collateral",
          minWidth: 200,
        },
        {
          title: "Debt",
          slot: "Debt",
          minWidth: 100,
        },
        {
          title: "Coll.Ratio",
          slot: "Coll.Ratio",
          minWidth: 200,
        },
      ],
      data1: [
        {
          Owner: "0xEAA0...F50D",
          Collateral: "1.0000",
          address: "New York No. 1 Lake Park",
          Debt: "2,000.00",
          Coll: "124.8%",
        },
        {
          Owner: "0xEAA0...F50D",
          Collateral: "1.0000",
          address: "New York No. 1 Lake Park",
          Debt: "2,000.00",
          Coll: "124.8%",
        },
        {
          Owner: "0xEAA0...F50D",
          Collateral: "1.0000",
          address: "New York No. 1 Lake Park",
          Debt: "2,000.00",
          Coll: "124.8%",
        },
        {
          Owner: "0xEAA0...F50D",
          Collateral: "1.0000",
          address: "New York No. 1 Lake Park",
          Debt: "2,000.00",
          Coll: "124.8%",
        },
      ],
    };
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.troves-wrapper {
  font-family: Gilroy-Bold, Gilroy;
  color: #ffffff;
  h2 {
    height: 40px;
    font-size: 26px;
    font-weight: bold;
    line-height: 40px;
  }
  .title-content {
    margin: 8px 0 16px;
    display: flex;
    align-items: center;
    img {
      max-width: 30px;
      margin-right: 10px;
    }
  }
  .content {
    width: 100%;
    background: linear-gradient(270deg, #3f5efb 0%, #fc466b 100%);
    border-radius: 12px;
    padding: 24px;
    position: relative;
    .title-warpper {
      p {
        height: 20px;
        font-size: 18px;
        line-height: 20px;
        margin: 8px 0 16px;
      }
    }
    .liquidata {
      margin-top: 40px;
      width: 40%;
      .input-warpper {
        margin-top: 16px;
        p {
          font-size: 24px;
        }
        .input-item {
          width: 50%;
          height: 40px;
          margin: 0 10px;
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid #fff;
          input {
            width: 100%;
            height: 100%;
            background: transparent;
            color: #fff;
            font-size: 20px;
            padding: 5px 10px;
          }
        }
        img {
          cursor: pointer;
          max-width: 26px;
          margin-left: 10px;
        }
      }
    }
  }
  .list-wapper{
      margin-top: 30px;
      box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
      padding: 24px;
      h2{
          color: #333;
          margin-bottom: 16px;
      }
  }
}
</style>