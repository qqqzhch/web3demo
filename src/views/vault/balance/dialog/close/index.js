import { mapState } from "vuex";
import { closeTrove } from '@/contactLogic/buildr/liquity';
import BigNumber from "bignumber.js";
import { fetchTokenBalance } from '@/contactLogic/buildr/create';

export default {
  inject: ['reload'],
  data() {
    return {
      isOpen: false,
      poolData: {},  // 父组件传过来的数据
      BigNumber,
      LAIBalance: 0,
      loading: true,
    };
  },
  components: {
    Loading: () => import("@/components/basic/loading.vue"),
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress']),
    shortDebt() {
      const { debtAmount, liquidationReserve } = this.poolData;
     return BigNumber(this.LAIBalance).minus(BigNumber(debtAmount).minus(liquidationReserve));
    }
  },
  methods: {
    getTokenImg(token) {
      return this.$parent.getTokenImg(token);
    },
    // 打开弹窗
    async open(poolData) {
      this.poolData = poolData;
      this.isOpen = true;
      this.getLAIBalance();
    },
    async getLAIBalance() {
      const params = {
        tokenName: 'LAI',
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account:  this.ethAddress,
        web3: this.web3,
      };
      this.LAIBalance = await fetchTokenBalance(params);
      this.loading = false;
    },
    //关闭弹窗
    closeDialog(){
      this.isOpen = false;
    },
    async onCloseTroveClick() {
      this.isOpen = false;
      const params = {
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account:  this.ethAddress,
      };
      const tx = await closeTrove(params);
      this.$parent.sendtx(tx);
    },
  },
};
