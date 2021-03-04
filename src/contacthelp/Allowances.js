import { Token, TokenAmount } from "@webfans/uniswapsdk";

import { useTokenContract } from "./useContract.js";

export async function useTokenAllowance(
  library,
  account,
  token,
  owner,
  spender
) {
  const contract = useTokenContract(library, account, token.address, false);

  
  let allowance;
  try {
    allowance = await contract.allowance(owner, spender);
  } catch (error) {
    console.log(error);
  }


  return new TokenAmount(token, allowance.toString());
}