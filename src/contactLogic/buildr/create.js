import {
  getTokenBySymbol,
  getProxyToActionsToken,
  getCollateralToken,
  getExchangeRatesToken
} from './tokens';
import {
  useTokenbalance,
  useProxyContractRead,
  useProxyActionsContractRead,
  useCollateralContractRead,
  useExchangeRatesContractRead,
  useNeedApproveInput,
} from './contractApi';
import {
  useTokenApprove,
  useTokenApproveErc20Lambda
} from '../../contacthelp/Approve.js';


/**
 *  获取当前币种余额
 *  isNative = true 获取原生资产余额
 *  isNative = false 获取Erc20资产余额
 * */
export const fetchTokenBalance = async ({web3, tokenName, chainID, library, account, isNative}) => {
  if(isNative && tokenName !== 'scUSD') {
    const result = await library.getBalance(account);
    return web3.utils.fromWei(result.toString());
  } else {
    const token = getTokenBySymbol(chainID, tokenName);
    const result = await useTokenbalance(library, account, token);
    return result.toSignificant(18);
  }
};

/**
 * name to Hex
 */
export const getNameHex = (web3, tokenName) => {
  let currencyKey = web3.utils.stringToHex(tokenName);
  currencyKey = web3.utils.rightPad(currencyKey, 64);
  return currencyKey;
};

/**
 *  1 首先通过ProxyActions.sol合约中的collateralAddress方法，拿到抵押品合约地址(collateralToken);
 *  2 然后通过抵押品的合约地址获取抵押合约中的状态变量。
 *
 *  isRewardClaimable：是否可提现
 *  targetRatio： 目标抵押率
 *  unlockedCollateral：可释放的LAMB
 *  collateralisationRatio：当前抵押率(倒数)
 *  mintScUSD：已铸造的scUSD
 *  currentDebt：当前债务
 *  liquidationRatio：清算抵押率
 *  feeRate：稳定费率
 *  debtCap： 全球scUSD债务上限
 *  maxMintable: 还有多少能铸造
 *  existingDebt：当前已铸造多少
 *  totalDebt：总负债
 *
 */
export const fetchCollateralIndicators = async ({ web3, chainID, account, library, tokenName }) => {
  const token = getProxyToActionsToken(chainID);
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
    useCollateralContractRead(library, account, collateralToken, 'debtCap', []),
    useCollateralContractRead(library, account, collateralToken, 'remainingDebt', [account])
  ];

  const [unlockedCollateral, collateralisation, isRewardClaimable, targetRatio, liquidationRatio, feeRate, debtCap, remainingDebt] = await Promise.all(loadList);


  return {
    isRewardClaimable,
    targetRatio: web3.utils.fromWei(targetRatio.toString()),
    unlockedCollateral: web3.utils.fromWei(unlockedCollateral.toString()),
    collateralisationRatio: web3.utils.fromWei(collateralisation[0].toString()),
    mintScUSD:  web3.utils.fromWei(collateralisation[1].toString()),
    currentDebt:  web3.utils.fromWei(collateralisation[2].toString()),
    liquidationRatio: web3.utils.fromWei(liquidationRatio.toString()),
    feeRate: web3.utils.fromWei(feeRate.toString()),
    debtCap: web3.utils.fromWei(debtCap.toString()),

    maxMintable: web3.utils.fromWei(remainingDebt[0].toString()),
    existingDebt:  web3.utils.fromWei(remainingDebt[1].toString()),
    totalDebt:  web3.utils.fromWei(remainingDebt[2].toString()),
  };
};


/**
 *  1 首先通过ProxyActions.sol合约中的collateralAddress方法，拿到抵押品合约地址(collateralToken);
 *  2 然后通过抵押品的合约地址获取抵押合约中的状态变量。
 *
 *  isRewardClaimable：是否可提现
 *  targetRatio： 目标抵押率
 *  unlockedCollateral：可释放的LAMB
 *  collateralisationRatio：当前抵押率(倒数)
 *  mintScUSD：已铸造的scUSD
 *  currentDebt：当前债务
 *  liquidationRatio：清算抵押率
 *  feeRate：稳定费率
 *  debtCap： 全球scUSD债务上限
 *  maxMintable: 还有多少能铸造
 *  existingDebt：当前已铸造多少
 *  totalDebt：总负债
 *
 */
export const fetchCollateralIndicatorsCurrentDebt = async ({ web3, chainID, account, library, tokenName }) => {
  const token = getProxyToActionsToken(chainID);
  const methodName = 'collateralAddress';
  const currencyKey = getNameHex(web3, tokenName);
  const parameter = [currencyKey];

  const tokenCollateralAddress = await useProxyActionsContractRead(library, account, token, methodName, parameter);



  const collateralToken = getCollateralToken(chainID);
  collateralToken.address = tokenCollateralAddress;

  const loadList = [
    // useCollateralContractRead(library, account, collateralToken, 'unlockedCollateral', [account]),
    useCollateralContractRead(library, account, collateralToken, 'collateralisationRatio', [account]),
    // useCollateralContractRead(library, account, collateralToken, 'isRewardClaimable', [account]),
    // useCollateralContractRead(library, account, collateralToken, 'targetRatio', []),
    // useCollateralContractRead(library, account, collateralToken, 'liquidationRatio', []),
    // useCollateralContractRead(library, account, collateralToken, 'feeRate', []),
    // useCollateralContractRead(library, account, collateralToken, 'debtCap', []),
    // useCollateralContractRead(library, account, collateralToken, 'remainingDebt', [account])
  ];

  const [collateralisation] = await Promise.all(loadList);

   return web3.utils.fromWei(collateralisation[2].toString());
  // return {
  //   // isRewardClaimable,
  //   // targetRatio: web3.utils.fromWei(targetRatio.toString()),
  //   // unlockedCollateral: web3.utils.fromWei(unlockedCollateral.toString()),
  //   // collateralisationRatio: web3.utils.fromWei(collateralisation[0].toString()),
  //   // mintScUSD:  web3.utils.fromWei(collateralisation[1].toString()),
  //   currentDebt:  web3.utils.fromWei(collateralisation[2].toString()),
  //   // liquidationRatio: web3.utils.fromWei(liquidationRatio.toString()),
  //   // feeRate: web3.utils.fromWei(feeRate.toString()),
  //   // debtCap: web3.utils.fromWei(debtCap.toString()),

  //   // maxMintable: web3.utils.fromWei(remainingDebt[0].toString()),
  //   // existingDebt:  web3.utils.fromWei(remainingDebt[1].toString()),
  //   // totalDebt:  web3.utils.fromWei(remainingDebt[2].toString()),
  // };
};



/**
 * 获取货币价格
 * */

export const fetchCurrencyPrice = async ({ web3, chainID, account, library, tokenName }) => {
  const token = getExchangeRatesToken(chainID);
  const methodName = 'rateForCurrency';
  const currencyKey = getNameHex(web3, tokenName);
  const parameter = [currencyKey];
  const tokenExchangeRates = await useExchangeRatesContractRead(library, account, token, methodName, parameter);

  return {
    currencyPrice:  web3.utils.fromWei(tokenExchangeRates.toString())
  };
};

/* *
 *  授权scUSD授信额度
 *
 * */

export const fetchApprove = async ({ web3, chainID, account, library, tokenName, pledgeNumber }) => {
  const proxyActionsToken = getProxyToActionsToken(chainID);
  const methodName  = 'target' ;
  const parameter  = [] ;

  const targetToken = await useProxyContractRead(library, account, proxyActionsToken, methodName, parameter);

  const mytoken = getTokenBySymbol(chainID, tokenName);
  const amount = web3.utils.toWei(pledgeNumber);

  const result = await useTokenApprove(library, account, mytoken, targetToken, amount);
  return result;
};

/**
 *  获取已授信的额度
 *  Allowance 限额
 * */


export const fetchAllowanceAmount = async ({ chainID, account, library, tokenName }) => {
  const mytoken = getTokenBySymbol(chainID, tokenName);

  const proxyActionsToken = getProxyToActionsToken(chainID);
  const methodName  = 'target' ;
  const parameter  = [] ;
  const targetToken = await useProxyContractRead(library, account, proxyActionsToken, methodName, parameter);

  const result = await useNeedApproveInput(library, account, mytoken, targetToken);

  return {
    allowanceAmount: result.toSignificant(18)
  };
};


/* *
 *  授权Lambda授信额度
 *
 * */

export const fetchLambdaApprove = async ({ web3, chainID, account, library, tokenName, pledgeNumber  }) => {
  // 获取授权地址
  const proxyActionsToken = getProxyToActionsToken(chainID);
  const methodName  = 'target' ;
  const parameter  = [] ;
  const targetToken = await useProxyContractRead(library, account, proxyActionsToken, methodName, parameter);

  const mytoken = getTokenBySymbol(chainID, tokenName);

  // 获取开始授权额度，如何没有授权，默认为0;
  const allowanceAmount = await useNeedApproveInput(library, account, mytoken, targetToken);
  const allowance = allowanceAmount.toSignificant(18);

  const fromValue = web3.utils.toWei(allowance);
  const toValue = web3.utils.toWei(pledgeNumber);

  const result = await useTokenApproveErc20Lambda(library, account, mytoken, targetToken, fromValue, toValue);
  return result;
};
