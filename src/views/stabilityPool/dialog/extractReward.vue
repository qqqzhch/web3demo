<template>
  <div class="claim-dialog">
    <Modal v-model="openClaimDialog" class-name="simple-modal" :footer-hide="true" :closable="true">
      <div class="simple-content">
        <p class="title text-center">
          {{ $t('myPage.claim') }}
        </p>
        <div class="simple-wrapper">
          <div class="title-content">
            <span class="card-title">{{ $t('common.amount') }}</span>
            <div class="balance-item">
              <span class="mr-2 text-secondary">{{ $t('myPage.dialog.claim.unclaim') }}</span>
              <span>{{ claimAmount }} {{ rewardToken }}</span>
            </div>
          </div>
          <div class="simple-wrapper">
            <input v-model="claimAmount" readonly type="text" class="amount-input">
          </div>
        </div>
        <div class="detail-wrapper">
          <div class="detail-item">
            <span>{{ $t('common.willRecieive') }}</span>
            <p>{{ claimAmount }} {{ rewardToken }}</p>
          </div>
        </div>

        <div class="btn-wrapper">
          <Buttons v-if="!extractLoading" height="48px" @click.native="sendExtract">
            {{ $t('common.confirm') }}
          </Buttons>
          <Buttons v-else height="48px">
            {{ $t('common.loading') }}...
          </Buttons>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import event from '@/common/js/event';
export default {
  data() {
    return {
      openClaimDialog: false,
      claimAmount: 0,
      data: {},
      extractLoading: false,
      rewardToken: '',
    };
  },
  computed: {
    ...mapState('pool', ['liquity']),
    liquityInstance() {
      const val = this.liquity && this.liquity.send;
      return val;
    },
  },
  methods: {
    open(data) {
      this.data = data;
      this.openClaimDialog = true;
    },
    checkData() {
      // if (this.claimAmount <= 0) {
      //   this.$Notice.warning({
      //     title: this.$t('notice.n'),
      //     desc: this.$t('notice.n31'),
      //   });
      //   return false;
      // }
      return true;
    },
    // 提取收益
    async sendExtract() {
      if (!this.checkData()) {
        return false;
      }
      this.extractLoading = true;
      try {
        const data = await this.liquityInstance.withdrawGainsFromStabilityPool({
          gasLimit: this.$globalConfig.gasLimit,
        });
        event.$emit('sendSuccess');
        this.openClaimDialog = false;
        event.$emit('sendtx', [
          data.rawSentTransaction,
          {
            okinfo: `${this.$t('common.claim')} ${this.claimAmount} ${this.$t('notice.n42')}`,
            failinfo: `${this.$t('common.claim')} ${this.$t('notice.n43')}`,
          },
        ]);
      } catch (error) {
        console.log(error);
        this.$Notice.error({
          title: this.$t('notice.n32'),
        });
      } finally {
        this.openClaimDialog = false;
        this.extractLoading = false;
      }
    },
  },
  components: {
    Buttons: () => import('@/components/basic/buttons'),
  },
};
</script>

<style lang="less" scoped>
@import '../../../common/css/dialog.less';
</style>
