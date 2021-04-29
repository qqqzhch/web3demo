export default {
  defaultChainID: 56,
  scUSDContractAddress: '0xe9d8a936bfb1a4dceccd8d97ed3c973399de303a',
  erc20Abi: require('../constants/abis/erc20.json'),
  netInfo: {
    // '1': {
    //   imgSrc: require('../assets/img/eth48.png'),
    //   name: 'Ethereum',
    //   isBan: true
    // },
    // '3': {
    //   imgSrc: require('../assets/img/eth48.png'),
    //   name: 'Ropsten',
    //   isBan: true
    // },
    // '4': {
    //   imgSrc: require('../assets/img/eth48.png'),
    //   name: 'Rinkeby',
    //   isBan: false
    // },
    // '256': {
    //   imgSrc: require('../assets/img/huobi48.svg'),
    //   name: 'Heco Test',
    //   isBan: true
    // },
    // '128': {
    //   imgSrc: require('../assets/img/huobi48.svg'),
    //   name: 'Heco Main',
    //   isBan: true
    // },
    '56': {
      imgSrc: require('../assets/img/binance48.svg'),
      name: 'BSC Main',
      isBan: false
    },
    '97': {
      imgSrc: require('../assets/img/binance48.svg'),
      name: 'BSC Test',
      isBan: true
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
    },
    '56': {
      chainIDHex: '0x38',
      netName: 'BSC Main NET',
      symbolNet: 'bsc',
      symbol: 'BNB',
      decimals: 18,
      rpcUrl: ['https://bsc-dataseed.binance.org'],
      explorerUrl: ['https://bscscan.com/']
    }
  },
  walletconnectRPC:{
    128: "https://http-mainnet-node.huobichain.com",
    256:'https://http-testnet.hecochain.com',
    4:"https://rinkeby.infura.io/v3/0dd2833fd0b9495885ebc1e44323fb82",
    1:"https://rinkeby.infura.io/v3/0dd2833fd0b9495885ebc1e44323fb82",
    97:'https://data-seed-prebsc-1-s1.binance.org:8545',
    56:'https://bsc-dataseed.binance.org',

  }
};