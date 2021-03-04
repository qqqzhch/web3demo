import { MaxUint256 } from "@ethersproject/constants";
import { TransactionResponse } from "@ethersproject/providers";

import {
  Trade,
  TokenAmount,
  CurrencyAmount,
  ETHER,
  Percent
} from "@webfans/uniswapsdk";

import JSBI from "jsbi/dist/jsbi.mjs";

import { useTokenAllowance } from "./Allowances";

// import { Field } from '../state/swap/actions'

import { calculateGasMargin } from "./utils";
import { useTokenContract } from "./useContract";

export const Field = {
  INPUT: "INPUT",
  OUTPUT: "OUTPUT"
};

import { ROUTER_ADDRESS}  from '@/constants/index.js';

// computes the minimum amount out and maximum amount in for a trade given a user specified allowed slippage in bips



// converts a basis points value to a sdk percent
export function basisPointsToPercent(num) {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000));
}

export function computeSlippageAdjustedAmounts(trade, allowedSlippager) {
  const pct = basisPointsToPercent(allowedSlippager);
  return {
    [Field.INPUT]: trade.maximumAmountIn(pct),
    [Field.OUTPUT]: trade.minimumAmountOut(pct)
  };
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export async function useNeedApproveInput(
  account,
  library,
  amountToApprove,
  spender
) {
  // const  account = ''; //账户地址
  // const  library = ''  //web3 提供对象

  const token =
    amountToApprove instanceof TokenAmount ? amountToApprove.token : undefined;
  const currentAllowance = await useTokenAllowance(
    library,
    account,
    token,
    account ?? undefined,
    spender
  );
  // const pendingApproval = useHasPendingApproval(token.address, spender)

  return currentAllowance.lessThan(amountToApprove) ? true : false;
}

export function useNeedApprove(account, library, trade, allowedSlippage) {
  if (trade == undefined) {
    return;
  }
  const amountToApprove = computeSlippageAdjustedAmounts(
    trade,
    allowedSlippage
  )[Field.INPUT];

  return useNeedApproveInput(account, library, amountToApprove, ROUTER_ADDRESS);
}
