// import gastoken  from  "@/constants/gastoken.json";

import { getNetwork } from '@ethersproject/networks';
import { getDefaultProvider } from '@ethersproject/providers';

import getethProvider from './getethProvider.js';

import {
    ChainId,
    Token,
    Fetcher,
    Route,
    TokenAmount,
    Router,
  } from "@webfans/uniswapsdk";

// export async function  ethusdt(){
//     const USDT = gastoken.tokens[0];
//     const WETH = gastoken.tokens[1];

//     const USDTcoin = new Token(
//         USDT.chainId,
//         USDT.address,
//         USDT.decimals,
//         USDT.symbol
//       );

//     const WETHcoin = new Token(
//         WETH.chainId,
//         WETH.address,
//         WETH.decimals,
//         WETH.symbol
//       );

  
  
//     const pair = await Fetcher.fetchPairData(
//         USDTcoin,
//         WETHcoin,
//         getethProvider(USDTcoin)
//       );
//       console.log(pair);
//       const route = new Route([pair], WETHcoin);

//       const price = route.pairs[0].priceOf(WETHcoin);
//       console.log('eth to usdt',price.toSignificant(6)) ;
//       return price.toSignificant(6);

// }

export async function getGasPrice(provider){
  const data = await provider.getGasPrice();
  

  
  return data.toString();

}