import {mapActions, mapState} from "vuex";
import { productTypes, defaultProductType, loopDuration } from '../config';
import { fetchProductsPrices } from '../../../contactLogic/synth/products';

const productsCols = [
  {
    title: 'Symbol',
    slot: "symbol",
    minWidth: 140,
  },
  {
    title: 'Last Price',
    slot: "price",
    minWidth: 100,
    // sortable: true,
  },
  {
    title: 'Change',
    slot: "changeRate",
    minWidth: 80,
    // sortable: true,
  },
];

export default {
  data() {
    return {
      productTypes,
      productsCols,
      productType: defaultProductType,
      products: [],
      isSearch: false,
      searchProducts: [],
      timer: null
    };
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress']),
    ...mapState('synth', ['focusedProduct', 'allProducts']),
    isReady() {
      return this.ethersprovider && this.ethChainID && this.ethAddress;
    },
  },
  methods: {
    ...mapActions('synth', ['getAllProducts', 'setAllProducts', 'getFocusedProduct', 'setFocusedProduct']),
    getProducts() {
      this.products = this.allProducts.filter((item) => item.type === this.productType).map(item => {
        return {
          ...item,
          changeRate: (30 * Math.random()).toFixed(2), // todo
        };
      });
    },
    changeProductType(option) {
      this.productType = option.value;
    },
    onSearchProduct(event) {
      const { value } = event.target;
      this.isSearch = !!value;
      if (this.isSearch) {
        this.searchProducts = this.products.filter((product) => {
         return product.pairCode.toUpperCase().includes((value||'').toUpperCase());
        });
      }
    },
    rowClassName(row) {
      if(row.pairCode.toUpperCase() === this.focusedProduct.pairCode.toUpperCase()) {
        return 'table-row-active';
      }
      return '';
    },
    onRowClick(rowData) {
      this.setFocusedProduct(rowData);
      // 更新path
      this.$router.push(`/synth/${rowData.pairCode.toLowerCase()}`);
    },
    getParams() {
      return {
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account:  this.ethAddress,
        web3: this.web3,
        products: this.allProducts
      };
    },
    async loopPrices() {
      if(this.isReady) {
        const params = this.getParams();

        const allProductsWithPrices = await fetchProductsPrices(params);
        this.products = allProductsWithPrices;
        // 计算所有资产价值会用到价格
        this.setAllProducts(allProductsWithPrices);
        // 更新选中产品的价格数据
       const focusedProduct = allProductsWithPrices.find(product => product.pairCode.toUpperCase() === this.focusedProduct.pairCode.toUpperCase());
       focusedProduct && this.setFocusedProduct(focusedProduct);
      }
    },
  },
  watch: {
    isReady(value) {
      if (value) {
        this.loopPrices();
        clearInterval(this.timer);
        this.timer = setInterval(() => this.loopPrices(), loopDuration);
      }
    },
    allProducts() {
      this.getProducts();
    },
    productType() {
      this.getProducts();
    }
  },
  created() {
    const { productCode } = this.$route.params;
    this.getAllProducts();
    this.getFocusedProduct({
      focusCode: productCode,
    });

    if (this.isReady) {
      this.loopPrices();
      clearInterval(this.timer);
      this.timer = setInterval(() => this.loopPrices(), loopDuration);
    }
  },
  destroyed() {
    clearInterval(this.timer);
    this.timer = null;
  }
};
