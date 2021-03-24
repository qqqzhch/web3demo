<template>
  <div class="multiMine-wrapper mt-6">
    <div class="title-wrapper flex justify-between items-center">
      <h2 class="title">
        {{ $t('earn.multi.t1') }}
      </h2>
      <p class="subTitle">
        {{ $t('earn.multi.t2') }}
      </p>
    </div>
    <card :data="data" @openStake="openStake" />
    <pledgeDialog ref="pledge" />
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
      this.$refs.pledge.open(data);
    },
  },
  components: {
    card: () => import('./earnCard.vue'),
    pledgeDialog: () => import('../dialog/pledgeDialog.vue'),
  },
};
</script>

<style lang="less" scoped>
.multiMine-wrapper {
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
    font-size: 16px;
    font-weight: 400;
    color: #8690a8;
    line-height: 19px;
  }
}
</style>