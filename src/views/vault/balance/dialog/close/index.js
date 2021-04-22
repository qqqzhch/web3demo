import { mapState } from "vuex";
import { closeTrove } from '@/contactLogic/buildr/liquity';
import BigNumber from "bignumber.js";

export default {
  inject: ['reload'],
  data() {
    return {
      isOpen: false,
      poolData: {},  // 父组件传过来的数据
      BigNumber,
    };
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress']),
  },
  methods: {
    getTokenImg(token) {
      return this.$parent.getTokenImg(token);
    },
    // 打开弹窗
    open(poolData) {
      this.poolData = poolData;
      this.isOpen = true;
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
