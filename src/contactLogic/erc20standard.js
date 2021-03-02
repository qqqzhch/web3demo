import { Token, TokenAmount } from "@webfans/uniswapsdk";

import { useTokenContract 
} from "./useContract.js";


export async function useErc20standardToken(
    library,
    account,
    token,
    owner,
    spender
  ) {
    const contract = useTokenContract(library, account, token.address, false);
    return  contract;
  }

export async function useTokenAllowance(
  library,
  account,
  token,
  owner,
  spender
) {
  const contract = useTokenContract(library, account, token.address, false);

  console.log(contract);
  let allowance;
  try {
    allowance = await contract.allowance(owner, spender);
  } catch (error) {
    console.log(error);
  }


  return new TokenAmount(token, allowance.toString());
}