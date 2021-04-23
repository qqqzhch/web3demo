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
import { useStakingRewardsContractSigna } from '@/contactLogic/earn/lpPool/allowances.js';
import event from '@/common/js/event';
export default {
  data() {
    return {
      openClaimDialog: false,
      claimAmount: '',
      data: {},
      coinName: '',
      extractLoading: false,
      fee: '',
      rewardToken: 'BABEL',
    };
  },
  methods: {
    open(data) {
      this.data = data;
      this.coinName = data && data.name;
      this.claimAmount = data && data.data && data.data.earned;
      this.openClaimDialog = true;
    },
    checkData() {
      if (this.claimAmount <= 0) {
        this.$Notice.warning({
          title: this.$t('notice.n'),
          desc: this.$t('notice.n31'),
        });
        return false;
      }
      return true;
    },
    // 提取收益
    async sendExtract() {
      if (!this.checkData()) {
        return false;
      }
      this.extractLoading = true;
      const tokenJson = this.data;
      try {
        const stakingRewardsContract = useStakingRewardsContractSigna(this.ethersprovider, this.ethAddress, tokenJson);
        const esGas = await stakingRewardsContract.estimateGas.claimReward();
        const result = await stakingRewardsContract.claimReward({ gasLimit: esGas });
        event.$emit('sendSuccess');
        this.openClaimDialog = false;
        event.$emit('sendtx', [
          result,
          {
            okinfo: `${this.$t('common.claim')} ${this.claimAmount} ${this.coinName} ${this.$t('notice.n42')}`,
            failinfo: `${this.$t('common.claim')} ${this.coinName} ${this.$t('notice.n43')}`,
          },
        ]);
      } catch (error) {
        console.log(error);
        this.$Notice.error({
          title: this.$t('notice.n32'),
        });
      } finally {
        const timer = setTimeout(() => {
          (this.openClaimDialog = false), (this.extractLoading = false);
          clearTimeout(timer);
        }, 1000);
      }
    },
  },
  components: {
    Buttons: () => import('@/components/basic/buttons'),
  },
  computed: {
    ...mapState(['ethersprovider', 'ethAddress', 'chainTokenPrice', 'web3', 'scashPrice']),
  },
};
</script>

<style lang="less" scoped>
@import '../../../common/css/dialog.less';
</style>
