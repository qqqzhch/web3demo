<template>
  <div class="airdrop-wrapper mb-6">
    <div class="title-wrapper flex justify-between items-center">
      <div class="left">
        <span class="title">{{ $t('Airdrop.VaultAirdrop') }}</span>
        <span class="next">{{ $t('Airdrop.NextAirdrop') }}</span>
        <span class="time">2021.9.1 18:00(UTC+8)</span>
      </div>
      <div class="right">
        {{ $t('Airdrop.Depositdigital') }}
      </div>
    </div>
    <div class="airdrop-content-wrapper flex justify-between items-center">
      <div class="airdrop-item name">
        <img src="../../../../assets/img/susd48.svg" alt="susd">
        <span>LAMB 金库</span>
      </div>

      <div class="airdrop-item volume">
        <p class="drop-title">
          {{ $t('Airdrop.AirdropVolume') }}
        </p>
        <p class="drop-num">
          1044
          <span>SCASH</span>
        </p>

        <p class="tag">
          <span class="mine font10px">{{ $t('synth.SCashMining') }}</span>
          <span class="reward font10px">{{ $t('synth.FeeRewards') }}</span>
        </p>
      </div>

      <div class="airdrop-item countdown">
        <p class="drop-title">
          {{ $t('Airdrop.Countdown') }}
        </p>
        <!-- <div class="count"> -->
        <countDown class="count" date="2021-03-31 10:15:00" />
        <!-- </div> -->
      </div>

      <div class="airdrop-item create">
        <button class="createBtn" @click="goBuild">
          {{ $t('Airdrop.StartCreating') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    countDown: () => import('@/components/basic/countDown.vue'),
  },
  props: {
    data: {
      type: Array,
    },
  },
  methods: {
    goBuild() {
      this.$router.push('/buildr/create');
    },
  },
};
</script>

<style lang="less" scoped>
.airdrop-wrapper {
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 32px 44px 44px 44px;
  .title-wrapper {
    .left {
      .title {
        font-size: 20px;
        font-weight: 500;
        color: #14171c;
        line-height: 24px;
      }
      .next {
        margin-left: 20px;
        margin-right: 8px;
        font-size: 14px;
        font-weight: 500;
        color: #8690a8;
        line-height: 16px;
      }
      .time {
        font-size: 14px;
        font-weight: 500;
        color: #00d075;
        line-height: 16px;
      }
    }
    .right {
      font-size: 16px;
      font-weight: 400;
      color: #8690a8;
      line-height: 19px;
    }
  }
  .airdrop-content-wrapper {
    width: 100%;
    margin-top: 24px;
    background: #ffffff;
    box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.06);
    border-radius: 12px;
    padding: 32px 24px;
    .name {
      width: 20%;
      display: flex;
      flex-direction: row;
      justify-self: space-between;
      align-items: center;
      span {
        margin-left: 28px;
        font-size: 20px;
        color: #14171c;
        line-height: 24px;
      }
    }
    .volume {
      width: 20%;
      .drop-num {
        margin-top: 8px;
        font-size: 26px;
        color: #14171c;
        line-height: 30px;
        span {
          font-size: 16px;
          color: #14171c;
          line-height: 19px;
        }
      }
      .tag {
        .mine {
          margin-right: 4px;
          padding: 4px;
          background: rgba(0, 208, 117, 0.2);
          border-radius: 2px;
          color: #00d075;
          line-height: 11px;
        }
        .reward {
          padding: 4px;
          background: rgba(135, 87, 236, 0.2);
          border-radius: 2px;
          color: #8757ec;
          line-height: 11px;
        }
      }
    }
    .countdown {
      width: 30%;
      .count {
        margin-top: 14px;
      }
    }
  }
}
.createBtn {
  font-size: 16px;
  color: #ffffff;
  line-height: 19px;
  padding: 8px 16px;
  background: #0058ff;
  border-radius: 18px;
}
.drop-title {
  font-size: 14px;
  color: #8690a8;
  line-height: 16px;
}
</style>