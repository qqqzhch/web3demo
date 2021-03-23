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
          title: this.$t('swapConfirm.successCom'),
          desc: tx.info.okinfo,
          duration: 10
        });
        event.$emit('txsuccess');
      } else {
        this.$Notice.error({
          title: this.$t('swapConfirm.failCom'),
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
