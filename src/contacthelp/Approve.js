import { Token, TokenAmount } from "@webfans/uniswapsdk";
import { MaxUint256 } from "@ethersproject/constants";
import { useTokenContract } from "./useContract.js";
import {
  calculateGasMargin,

} from "./utils.js";
const BigNumber = require("bignumber.js");

export async function useTokenApprove(
    library,
    account,
    token,
    spender,
    amount
  ) {
    const contract = useTokenContract(library, account, token.address, true);
  
    
    let result,gasEstimate;

    //MaxUint256   
    const bigAmount = new BigNumber(amount);
    const approveAmount = bigAmount.times('1.1').toFixed(0);

    try {
        gasEstimate = await contract.estimateGas.approve(spender,approveAmount);
        result = await contract.approve(spender,approveAmount,{
          gasLimit: calculateGasMargin(gasEstimate)
        });
    } catch (error) {
      console.log(error);
    }
  
    return result;
  }