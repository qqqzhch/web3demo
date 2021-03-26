import collPools from '@/constants/Collateralpool.json';
import {getCollateralStateToken, getCollateralToken, getProxyToActionsToken, getTokenBySymbol} from "./tokens";
import { getNameHex } from './create';
import {
  useCollateralContractRead,
  useCollateralStateRead,
  useProxyActionsContractRead,
  useProxyActionsContractSigna,
} from "./contractApi";
import {calculateGasMargin} from "../../contacthelp/utils";
import getChainCoinInfo from '../../constants/networkCoinconfig';

/**
 *  合约池列表
 *  state: true 启用，false 未启用
 *  native: true 原生代币，false 非原生
 *  只有erc20standard='false'的token为非标准ERC20合约。
 * */

export const getCollateralPools = (chainID) => {
  const chainCoinInfo = getChainCoinInfo(chainID);
  return collPools.map((pool) => {
    let isERC20 = true;
    if(pool.token === 'LAMB') {
      const token = getTokenBySymbol(chainID, pool.token);
      isERC20 = !(token['erc20standard'] === 'false');
    }
    return {
      ...pool,
      isNative: pool.token === 'LAMB' ? false : chainCoinInfo.coinName === pool.token,
      isERC20
    };
  }).filter(v => v.state);
};


/**
 *  获取抵押资产
 *  1 通过ProxyActions.sol合约获取tokenCollateralAddress
 *  2 根据tokenCollateralAddress 通过Collateral.sol合约获取 tokenCollateralStateAddress
 *  3 根据 tokenCollateralStateAddress 通过CollateralState.sol中accountCollateral方法获取抵押资产：accountCollateral
 * */
export const fetchPledgeNumber = async ({ web3, chainID, account, library, tokenName }) => {

  const token = getProxyToActionsToken(chainID);
  const methodName = 'collateralAddress';
  const currencyKey = getNameHex(web3, tokenName);
  const parameter = [currencyKey];
  const tokenCollateralAddress = await useProxyActionsContractRead(library, account, token, methodName, parameter);

  const collateralToken = getCollateralToken(chainID);
  collateralToken.address = tokenCollateralAddress;

  const methodName2 = 'collateralStateAddress';
  const parameter2 = [];
  const tokenCollateralStateAddress = await useCollateralContractRead(library, account, collateralToken, methodName2, parameter2);

  const collateralStateToken = getCollateralStateToken(chainID);
  collateralStateToken.address = tokenCollateralStateAddress;
  const accountCollateral = await useCollateralStateRead(library, account, collateralStateToken, 'accountCollateral', [account]);

  return {
    pledgeNumber: web3.utils.fromWei(accountCollateral.toString())
  };
};

/**
 * 估算Gas，执行合约
 * */
export async function contractEstimateGas(contract, methodName, parameters) {
  const estimatedGasLimit = await contract.estimateGas[methodName](...parameters, {});
  return await contract[methodName](...parameters, {
    gasLimit: calculateGasMargin(estimatedGasLimit),
  });
}

/**
 * 估算原生资产(ETH,BNB,HT)的Gas，执行合约
 * */
export async function contractEstimateGasNative(contract, methodName, parameters, amount) {
  const estimatedGasLimit = await contract.estimateGas[methodName](...parameters, {
    value: amount
  });
  return await contract[methodName](...parameters, {
    value: amount,
    gasLimit: calculateGasMargin(estimatedGasLimit),
  });
}

/**
 * type:
 * join 抵押资产，例如LAMB --> LAMB
 * exit 释放资产，例如LAMB --> LAMB
 * joinNative 抵押原生资产
 * exitNative 退出原生资产
 *
 * Mint 铸造资产，例如LAMB --> scUSD
 * Burn 释放资产，例如scUSD --> LAMB
 *
 * 标准的ERC20 SCASH
 * 原生代币 ETH
 * 非标准的ERC20 LAMB
 *
 * */

const typeOption = {
  'joinERC20': 'Deposit',
  'join': 'Deposit',
  'joinNative': 'Deposit',
  'exit': 'Withdraw',
  'exitNative': 'Withdraw',
  'mint': 'Generate',
  'burn': 'Payback',
};

export const fetchBalanaceChange = async ({ type, web3, chainID, account, library, tokenName, coinAmount, unit}) => {
  const token = getProxyToActionsToken(chainID);
  const ProxyActionsContract = useProxyActionsContractSigna(library, account, token);
  const currencyKey = getNameHex(web3, tokenName);
  const amount = web3.utils.toWei(coinAmount);

  try {
    let response;
    switch (type) {
      case 'joinERC20':  // 标准ERC20
        response = await contractEstimateGas(ProxyActionsContract, 'join', [currencyKey, amount]);
        break;
      case 'join':  // 非标准ERC20
        response = await contractEstimateGas(ProxyActionsContract, 'join', [currencyKey, amount, false]);
        break;
      case 'joinNative': // 原生代币
        response = await contractEstimateGasNative(ProxyActionsContract, 'joinNative', [currencyKey], amount);
        break;
      case 'exit':
        response = await contractEstimateGas(ProxyActionsContract, 'exit', [currencyKey, amount]);
        break;
      case 'exitNative':
        response = await contractEstimateGas(ProxyActionsContract, 'exitNative', [currencyKey, amount]);
        break;
      case 'mint':
        response = await contractEstimateGas(ProxyActionsContract, 'mint', [currencyKey, amount]);
        break;
      case 'burn':
        response = await contractEstimateGas(ProxyActionsContract, 'burn', [currencyKey, amount]);
        break;
    }
    return {
      base: `${typeOption[type]} ${coinAmount} ${unit}`,
      hash: response.hash,
      response: response,
    };
  } catch (error) {
    console.error(error);
  }
};


