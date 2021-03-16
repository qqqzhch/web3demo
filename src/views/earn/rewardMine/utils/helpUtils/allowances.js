
import { useStakingRewardsContract } from "./useContract.js";
import { TokenAmount } from "@webfans/uniswapsdk";

export async function useStakingRewardsbalance(library, account, token) {
  let result;
  const contract = useStakingRewardsContract(library, account, token.address, false);
  try {
    result = await contract.balanceOf(account);
  } catch (error) {
    console.log(error);
  }
  return new TokenAmount(token, result.toString());
}



export async function useStakingRewardstotalSupply(library, account, token) {
  let result;
  const contract = useStakingRewardsContract(library, account, token.address, false);
  try {
    result = await contract.totalSupply();
  } catch (error) {
    console.log(error);
  }
  return new TokenAmount(token, result.toString());
}



export async function useStakingRewardsRead(library, account, token, methodName, parameter) {
  let result;
  const contract = useStakingRewardsContract(library, account, token.address, false);
  try {
    result = await contract[methodName](...parameter);
  } catch (error) {
    console.log(error);
  }
  return result;
}

export  function useStakingRewardsContractSigna(
  library,
  account,
  token
) {
  const contract = useStakingRewardsContract(library, account, token.address, true);

  // console.log(contract);
  return contract;
}