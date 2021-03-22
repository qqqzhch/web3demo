<script>
import { readpairpool } from '@/contactLogic/readpairpool.js';
import { mapState } from 'vuex';
export default {
  methods: {
    // 获取scash与scusd价格
    async getScashPrice() {
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
  },
};
</script>