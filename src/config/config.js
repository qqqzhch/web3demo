export default {
  defaultChainID: 4,
  scUSDContractAddress: '0xe9d8a936bfb1a4dceccd8d97ed3c973399de303a',
  erc20Abi: require('../constants/abis/erc20.json'),
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