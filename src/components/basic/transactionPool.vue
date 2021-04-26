<script>
import event from '@/common/js/event';

export default {
  data() {
    return {
      txpoollist: [],
    };
  },
  mounted() {
    console.log('-----!');
    event.$on('sendtx', (txinfo) => {
      console.log('sendtx', txinfo);
      this.txpoollist.push({ tx: txinfo[0], info: txinfo[1], state: 'new' });
    });
  },
  methods: {
    async txstate(tx) {
      console.log('-----');
      try{
        const txlast = await tx.tx.wait([1]);
      console.log('Status after confirmation', txlast);
      if (txlast.status == 1) {
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

      }catch(ex){
        this.$Notice.error({
          title: this.$t('swapConfirm.failCom'),
          desc: ex,
          duration: 30
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
