import { Token, TokenAmount } from "@webfans/uniswapsdk";
import { MaxUint256, Zero} from "@ethersproject/constants";
import { useTokenContract, useErc20LambdaContract } from "./useContract.js";
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
    // const bigAmount = new BigNumber(amount);
    // const approveAmount = bigAmount.times('1.1').toFixed(0);
    const approveAmount = MaxUint256;
    console.log(contract, 3333222);

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


export async function useTokenApproveErc20Lambda(
  library,
  account,
  token,
  spender,
  fromValue,
  toValue,
) {
  const contract = useErc20LambdaContract(library, account, token.address, true);

  let result;
  // fromValue = Zero;
  try {
    const gasEstimate = await contract.estimateGas.approve(spender, fromValue, toValue);
    result = await contract.approve(spender, fromValue, toValue, {
      gasLimit: calculateGasMargin(gasEstimate)
    });
  } catch (error) {
    console.log(error);
  }

  return result;
}
