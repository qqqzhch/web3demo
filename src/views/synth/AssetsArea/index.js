import { mapState, mapActions } from "vuex";
import { fetchSynthAssetsList } from '../../../contactLogic/synth/assets';
import BigNumber from "bignumber.js";


export default {
  data() {
    return {
      BigNumber,
      tableData:[
        {
          title: 'Symbol',
          slot: "symbol",
          minWidth: 150,
        },
        {
          title: 'Amount',
          slot: "assetAmount",
          minWidth: 100,
        },
        {
          title: 'Value',
          slot: "assetValue",
          minWidth: 100,
        },
      ],
      synthAssets : [],
    };
  },
  computed: {
    ...mapState(['ethChainID', 'ethAddress', 'ethersprovider', 'web3']),
    ...mapState('synth', ['allProducts', 'assetTotalValue', 'refresh']),
    isReady() {
      return this.ethChainID && this.ethersprovider && this.ethAddress && this.web3;
    },
  },
  methods: {
    ...mapActions('synth', ['setAssetTotalValue', 'setAllAssets']),
    getParams() {
      return {
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account:  this.ethAddress,
        web3: this.web3,
        products: this.allProducts,
      };
    },
    async getSynthAssets() {
      const params = this.getParams();
      const synthAssets = await fetchSynthAssetsList(params);
      this.synthAssets = synthAssets;
      this.setAllAssets(synthAssets);

      this.updateAssets();
    },
    // 价格变了，数量没变
    updateAssets() {
      this.synthAssets = this.synthAssets.map(asset => {
        const { price } = this.allProducts.find((product) => product.pairCode.toUpperCase() === asset.pairCode.toUpperCase()) || asset;
        return {
          ...asset,
          price
        };
      });
      // 计算资产总价值
      const assetTotalValue = this.synthAssets
        .filter(asset => asset.assetAmount)
        .reduce((acc, asset) => {
          return BigNumber(acc).plus(BigNumber(asset.assetAmount).times(asset.price)).toNumber();
        }, 0);
      this.setAssetTotalValue(assetTotalValue);
    }
  },
  watch: {
    isReady(value) {
      if (value) {
        this.getSynthAssets();
      }
    },
    allProducts() {
      this.updateAssets();
    },
    refresh(nv) {
      if(nv) {
        this.getSynthAssets();
      }
    }
  },
  created() {
    if(this.isReady) {
      this.getSynthAssets();
    }
  }
};
