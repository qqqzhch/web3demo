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
              <span>{{ collateralGain }}  BNB {{ lusdGain }} LAY</span>
            </div>
          </div>
          <!-- <div class="simple-wrapper">
            <input v-model="claimAmount" readonly type="text" class="amount-input">
          </div> -->
        </div>
        <!-- <div class="detail-wrapper">
          <div class="detail-item">
            <span>{{ $t('common.willRecieive') }}</span>
            <p>{{ claimAmount }} {{ rewardToken }}</p>
          </div>
        </div> -->

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
    <haveSendDialog ref="haveSendtx" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import event from '@/common/js/event';

import initLiquity from '@/common/mixin/initLiquity';
const { EthersLiquity,  _connectByChainId } = require("@webfans/lib-ethers");
import { AddressZero } from "@ethersproject/constants";



export default {
  data() {
    return {
      openClaimDialog: false,
      claimAmount: '',
      data: {},
      extractLoading: false,
      rewardToken: '',
    };
  },
  methods: {
    open(data) {
      this.data = data;
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
      // if (!this.checkData()) {
      //   return false;
      // }
      this.extractLoading = true;
      try {
        const provider = this.ethersprovider;
        const account = this.ethAddress;
        const chainId = this.ethChainID ;
        const connection =  _connectByChainId(provider, provider.getSigner(account), chainId, {
          userAddress: account,
          frontendTag: AddressZero,
          useStore: "blockPolled"
        });
        console.log(connection);
        const liquity = EthersLiquity._from(connection);

        // 合约操作
        const transaction = await  liquity.send.withdrawGainsFromStaking({gasLimit:800000});

        
        event.$emit('sendSuccess');
        this.openClaimDialog = false;
        event.$emit('sendtx', [
          transaction.rawSentTransaction,
          {
            okinfo: `${this.$t('common.claim')} ${this.$t('notice.n42')}`,
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
    haveSendDialog: () => import('@/components/basic/haveSendDialog.vue'),
  },
  computed: {
    ...mapState(['ethersprovider', 'ethAddress', 'ethChainID']),
    ...mapState('buildr', ['liquityState']),
    collateralGain:function(){
      return this.liquityState&&this.liquityState.lqtyStake&&this.liquityState.lqtyStake.collateralGain.shorten();
    },
    lusdGain:function(){
      return this.liquityState&&this.liquityState.lqtyStake&&this.liquityState.lqtyStake.lusdGain.shorten();
    }
  },
};
</script>

<style lang="less" scoped>
@import '../../../common/css/dialog.less';
</style>
