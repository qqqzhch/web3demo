export default {
    tokenInfo: {
      mLAMB: {
        // 是否禁用资产
        isNoUse: false,
        desc: 'Lambda',
        imgUrl: require('../assets/img/mlamb48.svg'),
        // mlamb支持的网络
        supportNet: [
          {
            netId: "lamb",
            netName: "Lambda Network",
            // 是否禁用网络
            isNoUse: false,
            imgUrl: require('../assets/img/lambda48.svg')
          },
          {
            netId: "hb",
            netName: "Heco Network",
            isNoUse: false,
            imgUrl: require('../assets/img/comp.svg')
          },
          {
            netId: "eth",
            netName: "Ethereum Network",
            isNoUse: true,
            imgUrl: require('../assets/img/eth48.png')
          },
          // {
          //   netId: "binance",
          //   netName: "Binance Chain Network",
          //   isNoUse: false,
          // },
        ],
      },
      LAMB: {
        isNoUse: true,
        desc: 'Lambda',
      },
      USDT: {
        isNoUse: true,
        desc: 'USDT',
      },
      ETH: {
        isNoUse: true,
        desc: 'ETH'
      },
    },
    testNet: [3, 256],
    mainNet: [1, 128],
  };
  