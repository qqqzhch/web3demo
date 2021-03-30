<template>
  <div class="countDown">
    <div class="time-item mr10">
      {{ days | two_digits }}D
    </div>
    <div class="time-item">
      {{ hours | two_digits }}
    </div>
    <span class="ml-2 mr-2">:</span>
    <div class="time-item">
      {{ minutes | two_digits }}
    </div>
    <span class="ml-2 mr-2">:</span>
    <div class="time-item">
      {{ seconds | two_digits }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      now: Math.trunc(new Date().getTime() / 1000),
      timer: null,
    };
  },
  props: {
    date: {
      type: String,
    },
  },
  mounted() {
    this.timer = setInterval(() => {
      this.now = Math.trunc(new Date().getTime() / 1000);
    }, 1000);
  },
  computed: {
    dateInMilliseconds() {
      return Math.trunc(Date.parse(this.date) / 1000);
    },
    seconds() {
      return (this.dateInMilliseconds - this.now) % 60;
    },
    minutes() {
      return Math.trunc((this.dateInMilliseconds - this.now) / 60) % 60;
    },
    hours() {
      return Math.trunc((this.dateInMilliseconds - this.now) / 60 / 60) % 24;
    },
    days() {
      return Math.trunc((this.dateInMilliseconds - this.now) / 60 / 60 / 24);
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style lang="less" scoped>
.countDown {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  .time-item {
    font-family: monospace;
    padding: 4px 8px;
    border-radius: 2px;
    background: #f7f8f9;
    font-size: 1.25rem;
    font-weight: 500;
    color: #14171c;
    line-height: 24px;
  }
  .mr10 {
    margin-right: 10px;
  }
}
</style>