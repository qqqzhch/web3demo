import tokens from "@/constants/token.json";
import pairlist from "@/constants/pairlist.json";

import { ChainId, Token, TokenAmount, Fetcher ,
    Route, Percent, Router,TradeType,Trade
} from "@webfans/uniswapsdk";


import getethProvider from '@/contacthelp/getethProvider.js';
import _ from 'underscore';
import { basisPointsToPercent } from "@/contacthelp/utils.js";

import {
    INITIAL_ALLOWED_SLIPPAGE,
    ONE_BIPS,
    BASE_FEE,
    ONE_HUNDRED_PERCENT,
    BLOCKED_PRICE_IMPACT_NON_EXPERT,
  } from "@/constants/index.js";

export async function tradeCalculate(coinATokenAmount,coinBTokenAmount){
     console.log('tradeCalculate');

    

    // const TokenA = new Token(coinA.chainId,coinA.address,coinA.decimals,coinA.symbol);
    // const TokenB = new Token(coinB.chainId,coinB.address,coinB.decimals,coinB.symbol);

    const pair = await Fetcher.fetchPairData(
        coinATokenAmount.token,
        coinBTokenAmount.token,
        getethProvider(coinBTokenAmount.token)
      );

      const route = new Route([pair], coinATokenAmount.token);

      console.log(TradeType);
      
      const trade = new Trade(
        route,
        coinATokenAmount,
        TradeType.EXACT_INPUT
      );

      const coinBoutputAmount = trade.outputAmount.toSignificant(6);

      const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(
        BASE_FEE
      );

      const realizedLPFee = !trade
            ? undefined
            : ONE_HUNDRED_PERCENT.subtract(
                trade.route.pairs.reduce(
                  (currentFee) => currentFee.multiply(INPUT_FRACTION_AFTER_FEE),
                  ONE_HUNDRED_PERCENT
                )
              );

     const priceImpactWithoutFeeFraction =
        trade && realizedLPFee
        ? trade.priceImpact.subtract(realizedLPFee)
        : undefined;    

     const priceImpactWithoutFeePercent = priceImpactWithoutFeeFraction
        ? new Percent(
            priceImpactWithoutFeeFraction.numerator,
            priceImpactWithoutFeeFraction.denominator
          )
        : undefined;


      const PriceImpact = priceImpactWithoutFeePercent
        ? priceImpactWithoutFeePercent.lessThan(ONE_BIPS)
          ? "<0.01%"
          : priceImpactWithoutFeePercent.toFixed(2) + "%"
        : "-";
    let PriceImpactGreater ;
    if (priceImpactWithoutFeePercent.greaterThan(
              BLOCKED_PRICE_IMPACT_NON_EXPERT
            )
          ) {
            PriceImpactGreater = true;
          } else {
            PriceImpactGreater = false;
          }

    const pct = basisPointsToPercent(INITIAL_ALLOWED_SLIPPAGE);
    const Minimumreceived = trade.minimumAmountOut(pct);
    const coinBValue = trade.outputAmount;

    return {
        trade,
        PriceImpact,
        PriceImpactGreater,
        Minimumreceived,
        coinBValue
    };



}