import {
    ChainId,
    Token,
    WETH,
    Fetcher,
    Trade,
    Route,
    TokenAmount,
    TradeType,
    Percent,
    Router,
    ETHER
  } from "@webfans/uniswapsdk";
  import JSBI from "jsbi/dist/jsbi.mjs";

  import {DEFAULT_DEADLINE_FROM_NOW,INITIAL_ALLOWED_SLIPPAGE} from '@/constants/index.js';

  import {getRouterContract} from "./utils.js";
  import getChainCoinInfo from '@/constants/networkCoinconfig.js';
  

export default async function buildSwap(recipient,blockTime,trade,ChainId,provider){
    
      
      const deadline = blockTime + DEFAULT_DEADLINE_FROM_NOW;
      const BIPS_BASE = JSBI.BigInt(10000);

      const account = recipient;
      const swapMethods = [];

      const coinInfo = getChainCoinInfo(ChainId);

      if(trade.inputAmount.currency.symbol==coinInfo.coinName){
        trade.inputAmount.currency=ETHER;
      }
      if(trade.outputAmount.currency.symbol==coinInfo.coinName){
        trade.outputAmount.currency=ETHER;
      }

      swapMethods.push(Router.swapCallParameters(trade, {
        feeOnTransfer: false,
        allowedSlippage: new Percent(JSBI.BigInt(INITIAL_ALLOWED_SLIPPAGE), BIPS_BASE),
        recipient,
        deadline: deadline
      }));
      if (trade.tradeType === TradeType.EXACT_INPUT) {
        swapMethods.push(
          Router.swapCallParameters(trade, {
            feeOnTransfer: true,
            allowedSlippage: new Percent(
              JSBI.BigInt(INITIAL_ALLOWED_SLIPPAGE),
              BIPS_BASE
            ),
            recipient,
            deadline: deadline
          })
        );
      }
      const nowChainId = ChainId;

      const contract = getRouterContract(nowChainId, provider, account);
      if (!contract) {
        return [];
      }

      const m1data = swapMethods.map(parameters => ({ parameters, contract }));
      console.log(m1data);
      return { data: m1data, trade };
}