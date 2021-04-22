<template>
  <div class="remove-dialog">
    <Modal v-model="openRemoveDialog" class-name="simple-modal" :footer-hide="true" :closable="true">
      <div class="simple-content">
        <p class="title text-center">
          {{ $t('myPage.dialog.unstake.unstake') }} {{ coinName }}
        </p>
        <div class="simple-wrapper">
          <div class="title-content">
            <span class="card-title">{{ $t('common.amount') }}</span>
            <div class="balance-item">
              <span class="mr-2 text-secondary">{{ $t('myPage.dialog.unstake.staked') }} {{ coinName }}</span>
              <span>{{ stakeVal }}</span>
            </div>
          </div>
          <div class="simple-wrapper flex">
            <input v-model="stakeVal" readonly type="text" class="amount-input">
          </div>
        </div>
        <div class="detail-wrapper">
          <div class="detail-item">
            <span>{{ $t('myPage.dialog.unstake.unstake') }} {{ coinName }}</span>
            <p>{{ stakeVal }} {{ coinName }}</p>
          </div>
        </div>

        <div class="btn-wrapper">
          <Buttons v-if="!takeLoading" height="48px" @click.native="sendTakeout">
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
  inject: ['reload'],
  data() {
    return {
      openRemoveDialog: false,
      data: {},
      coinName: '',
      stakeVal: '',
      takeLoading: false,
    };
  },
  methods: {
    open(data) {
      this.data = data;
      this.stakeVal = data && data.data && data.data.balance;
      this.coinName = data && data.name;
      this.openRemoveDialog = true;
    },
    checkData() {
      if (this.stakeVal <= 0) {
        this.$Notice.warning({
          title: this.$t('notice.n'),
          desc: this.$t('notice.n31'),
        });
        return false;
      }
      return true;
    },
    // 取出LP
    async sendTakeout() {
      if (!this.checkData()) {
        return false;
      }
      this.takeLoading = true;
      const tokenJson = this.data;
      try {
        const stakingRewardsContract = useStakingRewardsContractSigna(this.ethersprovider, this.ethAddress, tokenJson);
        const esGas = await stakingRewardsContract.estimateGas.withdrawAndClaim();
        const result = await stakingRewardsContract.withdrawAndClaim({ gasLimit: esGas });
        event.$emit('sendSuccess');
        this.openRemoveDialog = false;
        event.$emit('sendtx', [
          result,
          {
            okinfo: `${this.$t('common.unstake')} ${this.stakeVal} ${this.coinName} ${this.$t('notice.n42')}`,
            failinfo: `${this.$t('common.unstake')} ${this.stakeVal} ${this.coinName} ${this.$t('notice.n43')}`,
          },
        ]);
      } catch (error) {
        console.log(error);
        this.$Notice.error({
          title: this.$t('notice.n32'),
        });
      } finally {
        this.openRemoveDialog = false;
        this.takeLoading = false;
      }
    },
  },
  components: {
    Buttons: () => import('@/components/basic/buttons'),
  },
  computed: {
    ...mapState(['ethersprovider', 'ethAddress']),
  },
};
</script>

<style lang="less" scoped>
@import '../../../common/css/dialog.less';
</style>
