import { getTokenHistory } from '@/contactLogic/Oracles';
import { getOracleId } from './products';

/**
 * 获取tickers数据
 *
 * */

export const fetchHistoryTickers = async ({web3, chainID, account, library, product}) => {
  const oracleCode = product.oracleCode.toLowerCase();
  const oracleId = getOracleId(chainID, product.type);
  const nowId = Number(product.id);

  const historyTickers = await getTokenHistory(library, account, chainID, oracleCode, oracleId, nowId);

  const historyData = historyTickers.map((tick) => {
    const [oracleCode, price, timestamp, id] = tick;
    return {
      // id: id.toString(),
      // pairCode: web3.utils.hexToUtf8(pairCode),
      time: Number(timestamp.toString()),
      value: web3.utils.fromWei(price.toString()),
    };
  }).sort((a, b) => a.time - b.time);

  return historyData;
};
