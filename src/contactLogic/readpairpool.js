import token from "@/constants/token.json";
import pairlist from "@/constants/pairlist.json";

import { ChainId, Token, TokenAmount, Fetcher ,
    Route, Percent, Router
} from "@webfans/uniswapsdk";

// import { useTokenbalance } from "@/contacthelp/Allowances.js";
import getethProvider from '@/contacthelp/getethProvider.js';
import _ from 'underscore';

import { Contract, Provider } from '@webfans/ethers-multicall';

import { ethers } from 'ethers';


export async function readpairpool(chainID,library, account){
    const list =  _.where(pairlist,{chainId:chainID});
    const tokenList= _.where(token.tokens,{chainId:chainID});
    const callList=[];

    list.forEach(async element =>  {
        
        const coinA = _.find(tokenList,{symbol:element.pair[0]});
        const coinB = _.find(tokenList,{symbol:element.pair[1]});
        const TokenA = new Token(coinA.chainId,coinA.address,coinA.decimals,coinA.symbol);
        const TokenB = new Token(coinB.chainId,coinB.address,coinB.decimals,coinB.symbol);
        const  pairCall =  Fetcher.fetchPairData(TokenA, TokenB,getethProvider(TokenB));
        callList.push(pairCall);
    
    });

    console.log(callList);
    const PairList = await Promise.all(callList);
    console.log(PairList);
    const dataList=[];
    PairList.forEach(async element=>{
        const route = new Route([element], element.tokenAmounts[0].token);
        const price = route.pairs[0].priceOf(element.tokenAmounts[0].token);

        dataList.push({
            Pair:element,
            price:price
        });

    });
    console.log(dataList);
    return dataList;

            //     const ethcallProvider = new Provider(library,chainID);
            //   await ethcallProvider.init(); // Only required when `chainId` is not provided in the `Provider` constructor
            //   const result = await ethcallProvider.all(callList);
            //   console.log(result);
}

/*
route = new Route([pair], coinATokenAmount.token);

            var price = route.pairs[0].priceOf(coinATokenAmount.token);

this.$data.price = price.toSignificant(6);
            this.$data.invertprice = price.invert().toSignificant(6);
*/


/*
async function getPairs(pairList) {
    var userpairList = [] ;
    for (let index = 0; index < pairList.length; index++) {
      const element = pairList[index];
      const TokenA = new Token(element.coinA.chainId,element.coinA.address,element.coinA.decimals,element.coinA.symbol);
      const TokenB = new Token(element.coinB.chainId,element.coinB.address,element.coinB.decimals,element.coinB.symbol);
      try {
        const pair = await Fetcher.fetchPairData(TokenA, TokenB,getethProvider(TokenB));
        console.log(pair)
        userpairList.push(pair)
          
      } catch (error) {
          console.log('not find the pair',TokenA,TokenB)
          
      }
      
    }
    return  userpairList;
    
  }

async function checkPairsUserbalance(pairList,library, account){
    var list = [];
    for (let index = 0; index < pairList.length; index++) {
        const element = pairList[index];
        var data = await getbalance(element.liquidityToken,library, account);
        pairList[index].userbalance = data;
        // if(data.greaterThan(0)){
            list.push(pairList[index])
        // }
        
        
    }
     return list ;

}


*/