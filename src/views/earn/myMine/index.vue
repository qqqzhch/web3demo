<template>
  <div class="myPage-wrapper">
    <h2 claas="pageTitle">
      My Page
    </h2>
    <Table class="myPage-table-wrapper" :columns="columns1" :data="data1" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns1: [
        {
          title: 'Name',
          key: 'name',
        },
        {
          title: 'Age',
          key: 'age',
        },
        {
          title: 'Address',
          key: 'address',
        },
      ],
      data1: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03',
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01',
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02',
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          date: '2016-10-04',
        },
      ],
    };
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
  .myPage-table-wrapper{
    margin-top: 8px;
  }
}
</style>