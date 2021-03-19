<script>
import { readpairpool } from '@/contactLogic/readpairpool.js';
import { mapState } from 'vuex';
export default {
  methods: {
    // 获取scash与scusd价格
    async getScashPrice() {
      console.log('a');
      try {
        const data = await readpairpool(this.ethChainID, this.ethersprovider);
        const [item] = data.filter((item) => item.listSymbol === 'SCASH');
        this.$store.commit('changeScashPrice', item && item.price);
      } catch (error) {
        console.log(error);
      }
    },
  },
  computed: {
    ...mapState(['ethersprovider', 'ethChainID', 'ethAddress']),
    // isReady() {
    //   return this.ethChainID && this.ethersprovider;
    // },
  },
  // watch: {
  //   isReady(value) {
  //     if (value) {
  //       this.getScashPrice();
  //     }
  //   },
  //   isConnect(value) {
  //     if (value) {
  //       this.getScashPrice();
  //     }
  //   },
  // },
  // created() {
  //   if (this.isReady) {
  //     this.getScashPrice();
  //   }
  // },
};
</script>