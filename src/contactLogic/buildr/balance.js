import collPools from '@/constants/Collateralpool.json';
import {getCollateralStateToken, getCollateralToken, getProxyActionsToken} from "./tokens";
import { getNameHex } from './create';
import {
  useCollateralContractRead,
  useCollateralStateRead,
  useProxyActionsContractRead,
  useProxyActionsContractSigna,
} from "./contractApi";
import {calculateGasMargin} from "../../contacthelp/utils";

/**
 *  合约池列表
 *  state: true 启用，false 未启用
 * */

export const collateralPools = collPools.filter(v => v.state);


/**
 *  获取抵押资产
 *  1 通过ProxyActions.sol合约获取tokenCollateralAddress
 *  2 根据tokenCollateralAddress 通过Collateral.sol合约获取 tokenCollateralStateAddress
 *  3 根据 tokenCollateralStateAddress 通过CollateralState.sol中accountCollateral方法获取抵押资产：accountCollateral
 * */
export const fetchPledgeNumber = async ({ web3, chainID, account, library, tokenName }) => {

  const token = getProxyActionsToken(chainID);
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
 * 估算Gas执行合约
 * */
export async function contractEstimateGas(contract, methodName, parameters) {
  const estimatedGasLimit = await contract.estimateGas[methodName](...parameters, {});
  return await contract[methodName](...parameters, {
    gasLimit: calculateGasMargin(estimatedGasLimit),
  });
}

/**
 * type:
 * join 抵押资产，例如LAMB --> LAMB
 * exit 释放资产，例如LAMB --> LAMB
 *
 * Mint 铸造资产，例如LAMB --> scUSD
 * Burn 释放资产，例如scUSD --> LAMB
 *
 * */

export const fetchBalanaceChange = async ({ type, web3, chainID, account, library, tokenName, coinAmount}) => {
  const token = getProxyActionsToken(chainID);
  const ProxyActionsContract = useProxyActionsContractSigna(library, account, token);
  const currencyKey = getNameHex(web3, tokenName);
  const amount = web3.utils.toWei(coinAmount);

  // console.log(type, web3, chainID, account, library, tokenName, coinAmount, currencyKey, amount, 9999);

  try {
    let result;
    switch (type) {
      case 'join':
        result = await contractEstimateGas(ProxyActionsContract, 'join', [currencyKey, amount]);
        break;
      case 'exit':
        result = await contractEstimateGas(ProxyActionsContract, 'exit', [currencyKey, amount]);
        break;
      case 'mint':
        result = await contractEstimateGas(ProxyActionsContract, 'mint', [currencyKey, amount]);
        break;
      case 'burn':
        result = await contractEstimateGas(ProxyActionsContract, 'burn', [currencyKey, amount]);
        break;
    }
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};


/**

 * */

