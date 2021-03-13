<template>
  <div class="singleMine-wrapper">
    <h2 class="title">
      Designated Pool
    </h2>
    <p class="subTitle">
      Designated mining, users can enjoy lower risk mining with a super high yield.
    </p>

    <card :data="data" @openStake="openStake" />
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
    },
  },
  methods: {
    openStake(data) {
      console.log(data);
    }
  },
  components: {
    card: () => import('./earnCard.vue'),
  },
};
</script>


<style lang="less" scoped>
.singleMine-wrapper {
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 32px 44px 44px 44px;
  .title {
    font-size: 20px;
    color: #14171c;
    line-height: 24px;
  }
  .subTitle {
    margin-top: 12px;
    font-size: 16px;
    font-weight: 400;
    color: #14171c;
    line-height: 19px;
  }
}
</style>