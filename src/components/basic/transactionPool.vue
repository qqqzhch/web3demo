<script>
import event from '@/common/js/event';

export default {
  data() {
    return {
      txpoollist: [],
    };
  },
  mounted() {
    event.$on('sendtx', (txinfo) => {
      console.log('sendtx', txinfo);
      this.txpoollist.push({ tx: txinfo[0], info: txinfo[1], state: 'new' });
    });
  },
  methods: {
    async txstate(tx) {
      const txlast = await tx.tx.wait([1]);
      console.log('Status after confirmation', txlast);
      if (txlast) {
        this.$Notice.success({
          title: 'Success',
          desc: tx.info.okinfo,
          duration: 0
        });
        event.$emit('txsuccess');
      } else {
        this.$Notice.error({
          title: 'The deal failed',
          desc: tx.info.failinfo,
        });
      }
    },
  },
  watch: {
    txpoollist: function () {
      const last = this.txpoollist[this.txpoollist.length - 1];
      this.txstate(last);
    },
  },
};
</script>
