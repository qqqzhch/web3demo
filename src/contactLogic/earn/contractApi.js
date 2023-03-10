import { TokenAmount } from "@webfans/uniswapsdk";
import {
  useTokenContract,
  useCollateralContract,
  useproxyActionsContract,
  useExchangeRatesContract,
  useProxyContract,
  useCollateralStateContract,
  useSynthetixRewardContract
} from "../../contacthelp/useContract.js";
import { useTokenAllowance } from "../../contacthelp/Allowances";

/**
 *  获取某个币的数量
 * */
export async function useTokenbalance(library, account, token) {
  const contract = useTokenContract(library, account, token.address, false);
  let result;
  try {
    result = await contract.balanceOf(account);
  } catch (error) {
    console.log(error);
  }
  return new TokenAmount(token, result.toString());
}

/**
 *  获取铸造代理只读数据
 *
 * */

export async function useProxyActionsContractRead(
  library,
  account,
  token,
  methodName,
  parameter
) {
  const contract = useproxyActionsContract(library, account, token.address, false);
  let result;
  try {
    result = await contract[methodName](...parameter);
  } catch (error) {
    console.log(error);
  }
  return result;
}

/**
 *  使用场景：
 *  获取抵押合约中的状态变量：抵押率、稳定费率，清算抵押率，全球scUSD债务上限
 *
 * */

export async function useCollateralContractRead(
  library,
  account,
  token,
  methodName,
  parameter
) {
  const contract = useCollateralContract(library, account, token.address, false);
  let result;
  try {
    result = await contract[methodName](...parameter);
  } catch (error) {
    console.log(error);
  }
  return result;
}

/**
 * 获取货币价格
 *
 * */

export async function useExchangeRatesContractRead(
  library,
  account,
  token,
  methodName,
  parameter
) {
  const contract = useExchangeRatesContract(library, account, token.address, false);
  let result;
  try {
    result = await contract[methodName](...parameter);
  } catch (error) {
    console.log(error);
  }
  return result;
}

export async function useProxyContractRead(
  library,
  account,
  token,
  methodName,
  parameter
) {
  const contract = useProxyContract(library, account, token.address, false);
  let result;
  try {
    result = await contract[methodName](...parameter);
  } catch (error) {
    console.log(error);
  }
  return result;
}

export async function useCollateralStateRead(
  library,
  account,
  token,
  methodName,
  parameter
) {
  const contract = useCollateralStateContract(library, account, token.address, false);
  let result;
  try {
    result = await contract[methodName](...parameter);
  } catch (error) {
    console.log(error);
  }
  return result;
}

export function useProxyActionsContractSigna(
  library,
  account,
  token

) {
  const contract = useproxyActionsContract(library, account, token.address, true);
  console.log(contract);
  return contract;
}

export async function useNeedApproveInput(
  library,
  account,
  token,
  spender
) {
  const currentAllowance = await useTokenAllowance(
    library,
    account,
    token,
    account ?? undefined,  // 当前账户
    spender   // 授权地址
  );
  console.log(currentAllowance);
  return currentAllowance;
}


export async function useSynthetixRewardRead(
  library,
  account,
  token,
  methodName,
  parameter
) {
  const contract = useSynthetixRewardContract(library, account, token.address, false);
  let result;
  try {
    result = await contract[methodName](...parameter);
  } catch (error) {
    console.log(error);
  }
  return result;
}

