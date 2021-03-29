export default {
  defaultChainID: 4,
  netInfo: {
    '1': {
      imgSrc: require('../assets/img/eth48.png'),
      name: 'Ethereum',
      isBan: false
    },
    '3': {
      imgSrc: require('../assets/img/eth48.png'),
      name: 'Ropsten',
      isBan: true
    },
    '4': {
      imgSrc: require('../assets/img/eth48.png'),
      name: 'Rinkeby',
      isBan: false
    },
    '256': {
      imgSrc: require('../assets/img/huobi48.svg'),
      name: 'Heco Test',
      isBan: false
    },
    '128': {
      imgSrc: require('../assets/img/huobi48.svg'),
      name: 'Heco Main',
      isBan: true
    },
    '56': {
      imgSrc: require('../assets/img/binance48.svg'),
      name: 'BSC Main',
      isBan: true
    },
    '97': {
      imgSrc: require('../assets/img/binance48.svg'),
      name: 'BSC Test',
      isBan: true
    },
  }
};