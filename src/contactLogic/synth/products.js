import crypto from '../../constants/synth/crypto.json';
import futures from '../../constants/synth/futures.json';
import indexes from '../../constants/synth/indexes.json';
import stock from '../../constants/synth/stock.json';
import { getTokenPriceinfo, getTokenListPriceinfo } from '@/contactLogic/Oracles';
import { oracleConfig } from '../../constants/oracleConfig';

/**
 * 获取预言机的oracleId
 * */

export const getOracleId = (chainID, type) => {
  return oracleConfig[chainID][type];
};

/**
 * base和quote代表一个币对，比如 BTC/USDT ,base=BTC quote=USDT
 * online：是否启用
 * */

export const allProducts = [
  ...crypto,
  ...stock,
  // ...futures,
  // ...indexes,
].filter(product => product.online).map(product => {
  return {
    ...product,
    symbol: product.pairCode.split('_').join('/'),
  };
}).sort((a, b) => a.sort - b.sort);


/**
 *  从预言机(Oracle)中批量获取产品价格信息
 *  pairCodes = ['lamb_usdt','ht_usdt','eth_usdt']
 *  id: ID，
 *  pairCode: 交易对
 *  price: 价格
 *  timestamp: 时间戳
 * */

export const fetchProductsPrices = async ({web3, chainID, account, library, products}) => {
  const oracleCodes = products.map((product) => {
   return {
     oracleId: getOracleId(chainID, product.type),
     oracleCode: product.oracleCode.toLowerCase()
   };
  });

  const result = await getTokenListPriceinfo(library, account, chainID, oracleCodes);

  const pricesInfo = result.map((priceInfo) => {
    const [oracleCode, price, timestamp, id] = priceInfo;

    return {
      id: id.toString(),
      oracleCode: web3.utils.hexToUtf8(oracleCode),
      price: web3.utils.fromWei(price.toString()),
      timestamp: Number(timestamp.toString()),
    };
  });

  const productsWithPrice = products.map((product) => {
    const productPrice = pricesInfo.find(info => info.oracleCode === product.oracleCode.toLowerCase()) || {};

    return {
      ...product,
      id: productPrice.id,
      price: productPrice.price,
      timestamp: productPrice.timestamp
    };
  });

  return productsWithPrice;
};

/**
 *  从预言机(Oracle)中获取单个产品价格信息
 *  pairCode = 'ht_usdt'
 *  id: ID，
 *  pairCode: 交易对
 *  price: 价格
 *  timestamp: 时间戳
 * */

export const fetchSingleProductPrice = async ({web3, chainID, account, library, product}) => {
  const pairCode = product.pairCode.toLowerCase();

  const priceInfo = await getTokenPriceinfo(library, account, chainID, pairCode);
  const [productCode, price, timestamp, id] = priceInfo;

  const productWithPrice = {
    ...product,
    id: id.toString() || 0,
    pairCode: web3.utils.hexToUtf8(productCode),
    price: web3.utils.fromWei(price.toString()),
    timestamp: Number(timestamp.toString()),
  };

  console.log('价格：', productWithPrice);
  return productWithPrice;
};
