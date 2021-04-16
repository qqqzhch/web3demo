import { mapState } from "vuex";
import { createChart } from 'lightweight-charts';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { fetchHistoryTickers } from '../../../contactLogic/synth/kline';
dayjs.extend(utc);

const getChartOption = (width, height) => ({
  width,
  height,
  rightPriceScale: {
    scaleMargins: {
      top: 0.2,
      bottom: 0.2,
    },
    visible: true,
    borderVisible: false,
  },
  timeScale: {
    borderVisible: false,
    timeVisible: true,
    secondsVisible: false,
  },
  grid: {
    horzLines: {
      color: '#ffffff',
    },
    vertLines: {
      color: '#ffffff',
    },
  },
  crosshair: {
    horzLine: {
      visible: true,
      labelVisible: false
    },
    vertLine: {
      visible: true,
      style: 0,
      width: 2,
      color: 'rgba(32, 38, 46, 0.1)',
      labelVisible: false,
    }
  },
});

const areaOption = {
  topColor: 'rgba(0, 120, 255, 0.2)',
  bottomColor: 'rgba(0, 120, 255, 0.0)',
  lineColor: 'rgba(0, 120, 255, 1)',
  lineWidth: 2,
};

export default {
  data() {
    return {
      chart: null,
      tickers: [],
    };
  },
  computed: {
    ...mapState(['web3', 'ethersprovider', 'ethChainID', 'ethAddress']),
    ...mapState('synth', ['focusedProduct']),
    isReady() {
      return this.ethersprovider && this.ethChainID && this.ethAddress;
    },
  },
  mounted() {
    const container = this.$refs.tradingview;
    const width = this.$refs.chartWarp.clientWidth-40;
    const height = this.$refs.chartWarp.clientHeight-50;
    const chartOption = getChartOption(width, height);
    const chart = createChart(container, chartOption);
    const areaSeries = chart.addAreaSeries(areaOption);
    this.chart = areaSeries;

    const businessDayToString = (value) => {
      return dayjs.utc(`${value}`).format("MM-DD HH:mm:ss");
    };

    const toolTipWidth = 180;
    const toolTipHeight = 180;
    const toolTipMargin = 15;

    const toolTip = document.createElement('div');
    toolTip.className = 'floating-tooltip-2';
    container.appendChild(toolTip);

    // update tooltip
    chart.subscribeCrosshairMove((param) => {
      if (param.point === undefined || !param.time || param.point.x < 0 || param.point.x > container.clientWidth || param.point.y < 0 || param.point.y > container.clientHeight) {
        toolTip.style.display = 'none';
      } else {
        const dateStr = businessDayToString(param.time);
        toolTip.style.display = 'block';
        const price = param.seriesPrices.get(areaSeries);
        toolTip.innerHTML = '<div style="color: #0578ff">'+this.focusedProduct.symbol+'</div>' +
          '<div style="font-size: 24px; margin: 4px 0px; color: #21384d">' + Math.round(100 * price) / 100 + '</div>' +
          '<div style="font-size: 12px; color: #21384d">' + dateStr + '</div>';
        const coordinate = areaSeries.priceToCoordinate(price);
        let shiftedCoordinate = param.point.x - 50;
        if (coordinate === null) return;
        shiftedCoordinate = Math.max(0, Math.min(container.clientWidth - toolTipWidth, shiftedCoordinate));
        const coordinateY = coordinate - toolTipHeight - toolTipMargin > 0 ? coordinate - toolTipHeight - toolTipMargin : Math.max(0, Math.min(container.clientHeight - toolTipHeight - toolTipMargin, coordinate + toolTipMargin));
        toolTip.style.left = shiftedCoordinate + 'px';
        toolTip.style.top = coordinateY + 'px';
      }
    });
  },
  methods: {
    getParams() {
      return {
        chainID: this.ethChainID,
        library: this.ethersprovider,
        account:  this.ethAddress,
        web3: this.web3,
        product: this.focusedProduct
      };
    },
    async getHistoryTickers() {
      const params = this.getParams();
      this.tickers = await fetchHistoryTickers(params);
      this.renderChart();
    },
    renderChart() {
      this.chart.setData(this.tickers);
    },
  },
  watch: {
    isReady(value) {
      if (value) {
        this.getHistoryTickers();
      }
    },
    focusedProduct(nextProduct, product){
      // 切换产品从新获取历史数据，否则只更新最后一个点的数据。
      if(!this.tickers.length || nextProduct.pairCode.toLowerCase() !== product.pairCode.toLowerCase()) {
        this.getHistoryTickers();
      } else {
        this.tickers = this.tickers.filter(tick => tick.time !== nextProduct.timestamp).concat({
          time: nextProduct.timestamp,
          value: nextProduct.price,
        });
        this.renderChart();
      }
    },
  },
  created() {
    if(this.isReady) {
      this.getHistoryTickers();
    }
  }
};
