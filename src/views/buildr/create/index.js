import { mapState } from 'vuex';
import BigNumber from "bignumber.js";
import event from '@/common/js/event';
import { getTokenImg } from '@/contactLogic/readbalance.js';
import ScInput from '../components/ScInput.vue';
import { collateralPools, fetchBalanaceChange } from '@//contactLogic/buildr/balance';
import {
  fetchTokenBalance,
  fetchCollateralIndicators,
  fetchCurrencyPrice,
  fetchApprove,
  fetchAllowanceAmount,
} from '@/contactLogic/buildr/create';


export default {
  name: 'create',
  data() {
    return {
      token:'',
      currencyNumber: 0, // 资产数量
      pledgeNumber: 0,   // 质押币数量
      stableNumber: 0,   // 稳定币数量
      targetRX: 0,          // 抵押率（倍数）
      liquidationRatio: 0,  // 清算抵押率
      feeRate: 0,    // 稳定费率
      debtCap: 0,    // 全球scUSD债务上限
      allowanceAmount: 0, //限额
      currencyPrice: 0,
      collateralPools: collateralPools,
      defaultTokenName: collateralPools[0].name,
      defaultToken: collateralPools[0].token,
      BigNumber,
      btnloading: false,
    };
  },
  components: {
    ScInput,
    haveSendDialog: () => import("@/components/basic/haveSendDialog.vue"),
    assetDialog: () => import('@/views/buildr/create/assetDialog.vue'),
    Loading: () => import("@/components/basic/loading.vue"),
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress']),
    isReady() {
      return this.ethersprovider && this.ethChainID && this.ethAddress;
    },
    // 验证输入值
    checkValue() {
      if(BigNumber(this.pledgeNumber).isLessThan(0)) {
        return 'Input value must be less than balance and greater than 0';
      } else if (isNaN(this.pledgeNumber)) {
        return 'Input value needs to be a value';
      } else {
        return 'ok';
      }
    }
  },
  methods: {
    getTokenImg(tokensymbol){
      const chainID = this.ethChainID;
      return getTokenImg(tokensymbol,chainID);
    },
    getParams() {
      return {
        tokenName: this.defaultToken,
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account:  this.ethAddress,
        web3: this.web3,
      };
    },
    async getCurrencyNumber() {
      const params = this.getParams();
      this.currencyNumber = await fetchTokenBalance(params);
    },
    async getIndicators() {
      const params = this.getParams();
      const { targetRatio, liquidationRatio, feeRate, debtCap } = await fetchCollateralIndicators(params);

      this.targetRX = BigNumber(targetRatio).isZero() ? 0 : BigNumber(1).div(targetRatio);
      this.liquidationRatio = BigNumber(liquidationRatio).isZero() ? 0 : BigNumber(1).div(liquidationRatio);
      this.feeRate = feeRate;
      this.debtCap = debtCap;
    },
    async getCurrencyPrice() {
      const params = this.getParams();
      const { currencyPrice } = await fetchCurrencyPrice(params);

      this.currencyPrice = currencyPrice;
    },
    onChangePledgeNumber(val) {
      this.pledgeNumber = val;
      // this.pledgeNumber = (BigNumber(val).isNaN() || BigNumber(val).isZero()) ? 0 : val;
      this.stableNumber = this.pledgeNumber ? BigNumber(this.pledgeNumber).times(this.currencyPrice).div(this.targetRX) : '';
    },
    async onApproveClick() {
      this.btnloading = true;
      const params = Object.assign({}, this.getParams(), {
        pledgeNumber: this.pledgeNumber,
      });
      const transaction = await fetchApprove(params);
      if (transaction && transaction.hash) {
        const waitdata = await transaction.wait([1]);
        this.btnloading = false;
        this.getAllowanceAmount();
      } else {
        this.$Notice.error({
          title: 'Approve cancelled',
        });
        this.btnloading = false;
      }
    },
    async getAllowanceAmount(){
      const params = this.getParams();
      const { allowanceAmount } = await fetchAllowanceAmount(params);
      this.allowanceAmount = allowanceAmount;
    },
    sendtx(tx) {
      if(tx && tx.base){
        this.$refs.haveSendtx.open(tx.base);
        event.$emit('sendtx',[tx.response, {
          okinfo: tx.base+' SUCCESS',
          failinfo: tx.base+' FAIL'
        }]);
      } else {
        this.$Notice.error({
          title: 'Send transaction fail!',
        });
      }
    },
    // Join
    async onJoinClick() {
      const params = this.getParams();
      const joinParams = {
        ...params,
        type: 'join',
        coinAmount: this.pledgeNumber,
        unit: this.defaultToken,
      };
      const tx = await fetchBalanaceChange(joinParams);
      this.sendtx(tx);
    },
    loadData() {
      this.getCurrencyNumber();
      this.getIndicators();
      this.getCurrencyPrice();
      this.getAllowanceAmount();
    },
    openAsset(){
      this.$refs.asset.open({
        defaultTokenName: this.defaultTokenName,
        data: this.collateralPools
      });
    },
    setAsset(tokenName) {
      this.defaultTokenName = tokenName;
      const pool = collateralPools.find(pool => pool.name === this.defaultTokenName);
      this.defaultToken = pool.token;
    }
  },
  watch: {
    isReady(value) {
      if (value) {
        this.loadData();
      }
    },
  },
  created() {
    if(this.isReady) {
      this.loadData();
    }
  }
};
