import { getTokenBySymbol, getProxyActionsToken, getCollateralToken } from './tokens';
import {
  useTokenbalance,
  useProxyActionsContractRead,
  useCollateralContractRead,
  useExchangeRatesContractRead
} from './contractApi';

/**
 *  获取当前币种余额
 * */
export const fetchTokenBalance = async ({currency, chainID, library, account}) => {
  const token = getTokenBySymbol(chainID, currency);
  const result = await useTokenbalance(library, account, token);

  return result.toSignificant(6);
};

/**
 * name to Hex
 */
const getNameHex = (web3, tokenName) => {
  let currencyKey = web3.utils.stringToHex(tokenName);
  currencyKey = web3.utils.rightPad(currencyKey, 64);
  return currencyKey;
};

/**
 *  1 首先通过ProxyActions.sol合约中的collateralAddress方法，拿到抵押品合约地址(collateralToken);
 *  2 然后通过抵押品的合约地址获取抵押合约中的状态变量。
 */
export const fetchCollateralIndicators = async ({ web3, chainID, account, library, tokenName }) => {
  const token = getProxyActionsToken(chainID);
  const methodName = 'collateralAddress';
  const currencyKey = getNameHex(web3, tokenName);
  const parameter = [currencyKey];
  const tokenCollateralAddress = await useProxyActionsContractRead(library, account, token, methodName, parameter);

  const collateralToken = getCollateralToken(chainID);
  collateralToken.address = tokenCollateralAddress;

  const loadList = [
    useCollateralContractRead(library, account, collateralToken, 'unlockedCollateral', [account]),
    useCollateralContractRead(library, account, collateralToken, 'collateralisationRatio', [account]),
    useCollateralContractRead(library, account, collateralToken, 'isRewardClaimable', [account]),
    useCollateralContractRead(library, account, collateralToken, 'targetRatio', []),
    useCollateralContractRead(library, account, collateralToken, 'liquidationRatio', []),
    useCollateralContractRead(library, account, collateralToken, 'feeRate', []),
    useCollateralContractRead(library, account, collateralToken, 'debtCap', [])
  ];
  //未质押数量, 铸造稳定币的最大值,是否可以提取奖励,目标抵押率,清算抵押率, 稳定费率,
  const [unlockedCollateral, collateralisationRatio, isRewardClaimable, targetRatio, liquidationRatio, feeRate, debtCap] = await Promise.all(loadList);

  return {
    isRewardClaimable,
    targetRatio: web3.utils.fromWei(targetRatio.toString()),
    unlockedCollateral: web3.utils.fromWei(unlockedCollateral.toString()),
    collateralisationRatio: web3.utils.fromWei(collateralisationRatio[0].toString()),
    liquidationRatio: web3.utils.fromWei(liquidationRatio.toString()),
    feeRate: web3.utils.fromWei(feeRate.toString()),
    debtCap: web3.utils.fromWei(debtCap.toString()),
  };
};


export const fetchCurrencyPrice = async ({ web3, chainID, account, library, tokenName }) => {
  const token = getProxyActionsToken(chainID);
  const methodName = 'rateForCurrency';
  const currencyKey = getNameHex(web3, tokenName);
  const parameter = [currencyKey];
  console.log(library, account, token, methodName, parameter, 992);
  const tokenExchangeRates = await useExchangeRatesContractRead(library, account, token, methodName, parameter);
  return {
    currencyPrice: tokenExchangeRates
  };
};

