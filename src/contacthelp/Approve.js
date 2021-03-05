import { Token, TokenAmount } from "@webfans/uniswapsdk";

import { useTokenContract } from "./useContract.js";
import {
  calculateGasMargin,

} from "./utils.js";

export async function useTokenApprove(
    library,
    account,
    token,
    spender,
    amount
  ) {
    const contract = useTokenContract(library, account, token.address, true);
  
    
    let result,gasEstimate;
    try {
        gasEstimate = await contract.estimateGas.approve(spender,amount);
        result = await contract.approve(spender,amount,{
          gasLimit: calculateGasMargin(gasEstimate)
        });
    } catch (error) {
      console.log(error);
    }
  
    return result;
  }