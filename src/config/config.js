export default {
  defaultChainID: 97,
  scUSDContractAddress: '0xe9d8a936bfb1a4dceccd8d97ed3c973399de303a',
  erc20Abi: require('../constants/abis/erc20.json'),
  netInfo: {
    '1': {
      imgSrc: require('../assets/img/eth48.png'),
      name: 'Ethereum',
      isBan: true
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
      isBan: true
    },
    '128': {
      imgSrc: require('../assets/img/huobi48.svg'),
      name: 'Heco Main',
      isBan: true
    },
    '56': {
      imgSrc: require('../assets/img/binance48.svg'),
      name: 'BSC Main',
      isBan: false
    },
    '97': {
      imgSrc: require('../assets/img/binance48.svg'),
      name: 'BSC Test',
      isBan: false
    },
  },
  gasLimit: 800000,
  defaultNet: {
    '97': {
      chainIDHex: '0x61',
      netName: 'BSC TEST NET',
      symbolNet: 'bsc',
      symbol: 'BNB',
      decimals: 18,
      rpcUrl: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
      explorerUrl: ['https://testnet.bscscan.com/']
    }
  }
};