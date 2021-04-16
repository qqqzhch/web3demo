import { mapState, mapActions } from "vuex";
import BigNumber from 'bignumber.js';
import debounce from 'debounce';
import event from '@/common/js/event';
import { fetchCurrFeeRate } from '../../../contactLogic/synth/assets';
import i18n from "../../../i18n";

const marks = {
  0: '',
  20: '',
  40: '',
  60: '',
  80: '',
  100: ''
};

export default {
  data() {
    return {
      side: 'buy',
      marks,
      volume: '',   // 交易量
      sliderValue: '',
      currFeeRate: 0,
      BigNumber,
    };
  },
  components: {
    ConfirmDialog: () => import('./confirmDialog.vue'),
    haveSendDialog: () => import("@/components/basic/haveSendDialog.vue"),
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress']),
    ...mapState('synth', ['focusedProduct', 'synthScUSDAmount', 'allAssets']),
    isReady() {
      return this.ethersprovider && this.ethChainID && this.ethAddress;
    },
    amount() {
      const { price } = this.focusedProduct;
      return BigNumber(this.volume).times(price).toNumber();
    },
    assetAmount() {
      const asset = this.allAssets.find(asset => asset.pairCode.toUpperCase() === this.focusedProduct.pairCode.toUpperCase());
      return asset.assetAmount || 0;
    },
    maxVolume() {
      const { price } = this.focusedProduct;
      const max = price ? BigNumber(this.synthScUSDAmount).div(price).toNumber() : 0;
      return this.side === 'buy' ? max : this.assetAmount;
    },
    totalFee() {
      const volume = this.side === 'buy' ? this.amount : this.volume;
      return BigNumber(volume).times(this.currFeeRate).toNumber();
    }
  },
  mounted() {
    //txsuccess
    event.$on('txsuccess',() => {
      this.setRefresh(true);
    });
  },
  methods: {
    ...mapActions('synth', ['setRefresh']),
    onChangeTab(side) {
      this.side = side;
      this.volume = 0;
      this.sliderValue = 0;
      this.getWidth(0);
    },
    getWidth(width){
      const point  = document.getElementsByClassName('ivu-slider-stop');
      point.forEach(item => {
        const str = item.style.left;
        const n = Number(str.substr(0, str.length - 1));
        if(width > n){
          item.style.background = '#0058FF';
        }else{
          item.style.background = '#E0E6EC';
        }
      });
    },
    getNumber(val){
      this.volume = BigNumber(val).div(100).times(this.maxVolume).decimalPlaces(6).toNumber();
      this.getWidth(val);
    },
    sliderTipFormat(percent) {
      return BigNumber(percent).div(100).times(this.maxVolume).decimalPlaces(6).toNumber();
    },
    onChangeInputValue: debounce(async function() {
      this.sliderValue = BigNumber(this.volume).div(this.maxVolume).times(100).toNumber();
      this.getWidth(this.sliderValue);
    }, 100),
    onConfrimSubmit() {
      this.$refs.confirmDialog.open({
        totalFee: this.totalFee,
        side: this.side,
        volume: this.volume,
        product: this.focusedProduct,
      });
    },
    getParams() {
      return {
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account:  this.ethAddress,
        web3: this.web3,
        side: this.side,
        volume: this.side === 'buy' ? this.amount : this.volume,
        product: this.focusedProduct,
      };
    },
    async onOrderSubmit(tx) {
      if(tx && tx.hash){
        const base = `${this.side} ${this.volume} ${this.focusedProduct.baseSymbol}`;
        this.$refs.haveSendtx.open(base);
        event.$emit('sendtx',[tx.response, {
          okinfo: base + i18n.t('swapConfirm.successCom'),
          failinfo: base + i18n.t('swapConfirm.failCom')
        }]);
      } else {
        this.$Notice.error({
          title: i18n.t('交易失败！'),
        });
      }
    },
    async getCurrFeeRate() {
      const params = this.getParams();
      const { currFeeRate } = await fetchCurrFeeRate(params);
      this.currFeeRate = currFeeRate;
    },
  },
  watch: {
    isReady(value) {
      if(value) {
        this.getCurrFeeRate();
      }
    },
  }
};
