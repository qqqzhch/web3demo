import { Token, TokenAmount } from "@webfans/uniswapsdk";

import { useTokenContract } from "./useContract.js";

export async function useTokenApprove(
    library,
    account,
    token,
    spender,
    amount
  ) {
    const contract = useTokenContract(library, account, token.address, true);
  
    
    let result;
    try {
        result = await contract.approve(spender,amount);
    } catch (error) {
      console.log(error);
    }
  
    return result;
  }