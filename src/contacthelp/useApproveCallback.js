import { MaxUint256 } from "@ethersproject/constants";
import {
  TokenAmount,
} from "@webfans/uniswapsdk";
import { calculateGasMargin } from "./utils";
import { useTokenContract } from "./useContract";

export async function useApproveCallback(
  account,
  library,
  amountToApprove,
  spender
) {
  const token =
    amountToApprove instanceof TokenAmount ? amountToApprove.token : undefined;
  const tokenContract = useTokenContract(library, account, token.address);
  if (!token) {
    console.error("no token");
    return;
  }

  if (!tokenContract) {
    console.error("tokenContract is null");
    return;
  }

  if (!amountToApprove) {
    console.error("missing amount to approve");
    return;
  }

  if (!spender) {
    console.error("no spender");
    return;
  }

  let useExact = false;
  const estimatedGas = await tokenContract.estimateGas
    .approve(spender, MaxUint256)
    .catch(() => {
      // general fallback for tokens who restrict approval amounts
      useExact = true;
      return tokenContract.estimateGas.approve(
        spender,
        amountToApprove.raw.toString()
      );
    });

  return new Promise((resolve, reject) => {
    tokenContract
      .approve(spender, useExact ? amountToApprove.raw.toString() : MaxUint256, {
        gasLimit: calculateGasMargin(estimatedGas)
      })
      .then(response => {
        resolve({
          summary: "Approve " + amountToApprove.currency.symbol,
          approval: { tokenAddress: token.address, spender: spender },
          hash: response.hash,
          response: response
        });
      })
      .catch(error => {
        console.debug("Failed to approve token", error);
        reject(error);
      });

  });

}
