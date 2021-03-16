<template>
  <div class="myPage-wrapper">
    <h2 claas="pageTitle">
      My Page
    </h2>
    <Table class="myPage-table-wrapper" :columns="columns" :data="data">
      <template slot="pool" slot-scope="{ row }">
        {{ row.name }}
      </template>

      <template slot="apy" slot-scope="{ row }">
        {{ row.name }}
      </template>
      <template slot="stake" slot-scope="{ row }">
        {{ row.name }}
      </template>

      <template slot="operation" slot-scope="{ row }">
        {{ row.name }}
      </template>
    </Table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        {
          title: 'Pool',
          slot: 'pool'
        },
        {
          title: 'APY',
          slot: 'apy',
        },
        {
          title: 'Staked',
          slot: 'stake',
        },
        {
          title: 'Unclaimed',
          slot: 'earned',
        },
        {
          title: 'Function',
          slot: 'operation',
        },
      ],
      data: [],
    };
  },
  methods: {
    name() {

    }
  },
};
</script>

<style lang="less" scoped>
.myPage-wrapper {
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 44px;
  margin: 20px 0 100px 0;
  .pageTitle {
    font-size: 20px;
    font-weight: 500;
    color: #14171c;
    line-height: 24px;
  }
  .myPage-table-wrapper {
    margin-top: 8px;
  }
}
</style>