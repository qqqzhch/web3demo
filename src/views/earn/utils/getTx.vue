<script>
import { mapState } from 'vuex';
export default {
  methods: {
    getTx(hash) {
      return new Promise((resolve, reject) => {
        this.web3.eth.getTransactionReceipt(hash, (error, data) => {
          if (error) {
            reject(error);
          }
          resolve(data);
        });
      });
    },

    getTransaction(hash) {
      let timeid;
      return new Promise((resolve) => {
        timeid = setInterval(async () => {
          const data = await this.getTx(hash);
          if (data && data.blockNumber !== null) {
            clearInterval(timeid);
            resolve(data);
          }
        }, 1000 * 10);
      });
    },
  },
  computed: {
    ...mapState(['web3']),
  },
};
</script>