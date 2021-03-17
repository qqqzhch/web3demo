import token from "@/constants/token.json";
import pairlist from "@/constants/pairlist.json";

import { ChainId, Token, TokenAmount, Fetcher ,
    Route, Percent, Router
} from "@webfans/uniswapsdk";

// import { useTokenbalance } from "@/contacthelp/Allowances.js";
import getethProvider from '@/contacthelp/getethProvider.js';
import _ from 'underscore';

import { useTokenContractMulticall 
} from "../contacthelp/useContractMulticall.js";
import { Contract, Provider } from '@webfans/ethers-multicall';
import { ethers } from 'ethers';
import { INITIAL_ALLOWED_SLIPPAGE,ROUTER_ADDRESS } from '@/constants/index.js';

import { calculateSlippageAmount, getRouterContract, calculateGasMargin } from '@/contacthelp/utils.js';

import Web3 from 'web3';

import { getTime } from "@/contacthelp/ethcom.js";


import { splitSignature } from "@ethersproject/bytes";
import {  getGasPrice } from '@/contacthelp/ethusdt.js';
// import bignumber from  "bignumber.js"
const BigNumber = require("bignumber.js");

import {pairPrice} from '@/constants/apiconfig.js';

import {swapExactTokensForTokensformat} from './history.js';



function  Calculatepercentage(balance,totalSupply){
  const balance_ = new BigNumber(balance);
  const totalSupply_ = new BigNumber(totalSupply);
  return balance_.div(totalSupply_) ;


}

export async function readpairpool(chainID,library){
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

    
    const PairList = await Promise.all(callList);
    console.log(PairList);
    const dataList=[];
    /*
    this.$data.price = price.toSignificant(6);
    this.$data.invertprice = price.invert().toSignificant(6);
    */
   const PricePromiseList  = [];
    PairList.forEach(async element=>{
        const route = new Route([element], element.tokenAmounts[0].token);
        const price = route.pairs[0].priceOf(element.tokenAmounts[0].token);
        const  tokenA = element.tokenAmounts[0].token;
        const  tokenB = element.tokenAmounts[1].token;
        const pairaddress = element.liquidityToken.address;

        PricePromiseList.push(getpairPrice(pairaddress,chainID,tokenB.symbol,tokenA.symbol));  

        dataList.push({
            Pair:element,
            price:price.toSignificant(6),
            pairName:`${element.tokenAmounts[1].token.symbol}/${element.tokenAmounts[0].token.symbol}`,
            listSymbol:element.tokenAmounts[1].token.symbol,
            pairSymbols:[element.tokenAmounts[1].token.symbol,element.tokenAmounts[0].token.symbol]


        });

    });

    const PriceList = await Promise.all(PricePromiseList);
    console.log('PriceList',PriceList);
    dataList.forEach((item)=>{
      
    const   prise24 =  _.find(PriceList,(one)=>{
        if(one[item.pairName]){
          return one;

        } 

      });
      if(prise24){
        item.prise24=prise24[item.pairName];
        if(item.price - item.prise24>0){
          item.change='+';  
        }else{
          item.change='-';
        }
        item.prisechange=Math.abs((item.price - item.prise24)/item.prise24);
        


      }else{
        item.prisechange='';
      }
      

      
    });

    console.log(dataList);
    return dataList;

            //     const ethcallProvider = new Provider(library,chainID);
            //   await ethcallProvider.init(); // Only required when `chainId` is not provided in the `Provider` constructor
            //   const result = await ethcallProvider.all(callList);
            //   console.log(result);
}

export async function readpairLiquidity(chainID,library,account){
    const list =  await readpairpool(chainID,library);
    const callList=[];
    list.forEach((element)=>{
        
        const TokenContract = useTokenContractMulticall(element.Pair.liquidityToken);
        
        
        callList.push(TokenContract.totalSupply());
        if(account!=""){
          callList.push(TokenContract.balanceOf(account));
        }
      

    });

    const ethcallProvider = new Provider(library,chainID);
    await ethcallProvider.init(); // Only required when `chainId` is not provided in the `Provider` constructor
    const listresult  = await ethcallProvider.all(callList);
    
    console.log(listresult);

    
    list.forEach((item,index)=>{
        
        let balance ='0',totalSupply='';
        if(account!=''){
           totalSupply = listresult[index*2];
           balance = listresult[index*2+1];
        }else{
          totalSupply = listresult[index];
        }
        

        const totalSupplyTokenAmount = new TokenAmount(item.Pair.liquidityToken, totalSupply.toString());

        const balanceTokenAmount = new TokenAmount(item.Pair.liquidityToken, balance.toString());

        item.totalSupply = Web3.utils.fromWei(totalSupply.toString())  ;
        item.balance = Web3.utils.fromWei(balance.toString()) ;
        console.log('-------');

        item.aToketotalSupply = item.Pair.getLiquidityValue(item.Pair.tokenAmounts[0].token, totalSupplyTokenAmount, totalSupplyTokenAmount, false);
        item.bToketotalSupply = item.Pair.getLiquidityValue(item.Pair.tokenAmounts[1].token, totalSupplyTokenAmount, totalSupplyTokenAmount, false);

        item.aTokenbalance = item.Pair.getLiquidityValue(item.Pair.tokenAmounts[0].token, totalSupplyTokenAmount, balanceTokenAmount, false).toSignificant(3);
        item.bTokenbalance = item.Pair.getLiquidityValue(item.Pair.tokenAmounts[1].token, totalSupplyTokenAmount, balanceTokenAmount, false).toSignificant(3);
        
        

    });

    return list;

    // 读取总量
    //读物我的余额
    //根据我的余额和总量关系，换算两个币中分别是多少
}

export async function  readpariInfo(chainID,library,tokensymbolA,tokensymbolB){

    const tokenList= _.where(token.tokens,{chainId:chainID});

    const coinA = _.find(tokenList,{symbol:tokensymbolA});
    const coinB = _.find(tokenList,{symbol:tokensymbolB});

    const TokenA = new Token(coinA.chainId,coinA.address,coinA.decimals,coinA.symbol);
    const TokenB = new Token(coinB.chainId,coinB.address,coinB.decimals,coinB.symbol);

    const  pairInfo = await  Fetcher.fetchPairData(TokenA, TokenB,getethProvider(TokenB));

    return pairInfo ;



}

export async function  calculationLiquidity(library,chainID,coinATokenAmount,coinBTokenAmount,istargetBToken,account){
  console.log('calculationLiquidity');
  
    const pair = await Fetcher.fetchPairData(
        coinATokenAmount.token,
        coinBTokenAmount.token,
        getethProvider(coinBTokenAmount.token)
      );
      // console.log(pair);
      let route;

      route = new Route([pair], coinATokenAmount.token);

      const price = route.pairs[0].priceOf(coinATokenAmount.token);
      const invertprice = price.invert();

      let outputNum;

      if(istargetBToken){
         outputNum = route.pairs[0].priceOf(coinATokenAmount.token).quote(coinATokenAmount);
      }else{
         outputNum = route.pairs[0].priceOf(coinBTokenAmount.token).quote(coinBTokenAmount);

      }

      const TokenContract = useTokenContractMulticall(pair.liquidityToken);
      const callList=[];

      callList.push(TokenContract.totalSupply());
      callList.push(TokenContract.balanceOf(account));

      const ethcallProvider = new Provider(library,chainID);
      await ethcallProvider.init(); // Only required when `chainId` is not provided in the `Provider` constructor
      const listresult  = await ethcallProvider.all(callList);

      const [pooltotalSupply,mypoolBlance] =  listresult ;

      const pooltotalSupplyTokenAmount = new TokenAmount(
        pair.liquidityToken,
        pooltotalSupply.toString()) ;

      let liquidityMinted;

      if (istargetBToken) {
        liquidityMinted = pair.getLiquidityMinted(pooltotalSupplyTokenAmount, coinATokenAmount, outputNum);
      } else {
        liquidityMinted = pair.getLiquidityMinted(pooltotalSupplyTokenAmount, outputNum, coinBTokenAmount);
      }

      let poolPercentData = liquidityMinted.divide(pooltotalSupplyTokenAmount.add(liquidityMinted));
        poolPercentData = poolPercentData.toSignificant(4);
      
      // if (poolPercentData.multiply(10000).lessThan(1)) {
      //   poolPercentData = '<0.01';
      // } else {
      //   poolPercentData = poolPercentData.multiply(100).toSignificant(4);
      // }

      return {
        istargetBToken,
        outputNum,
        poolPercentData,
        price,
        invertprice,
        liquidityMinted

      };


    //let poolBlance = await this.getTokenbalance(pair.liquidityToken, window.ethersprovider, this.ethAddress);
    //let poolTotal = await this.getTokenTotalSupply(window.ethersprovider, this.ethAddress, pair.liquidityToken);



}

export async function buildAddliquidityParam(coinATokenAmount,coinBTokenAmount,account){

  const allowedSlippage = INITIAL_ALLOWED_SLIPPAGE;

  const amountsMin = {
    CURRENCY_A: calculateSlippageAmount(coinATokenAmount, allowedSlippage)[0],
    CURRENCY_B: calculateSlippageAmount(coinBTokenAmount, allowedSlippage)[0],
  };
  const blockTime = await getTime();
      // 20 minutes, denominated in seconds
  const DEFAULT_DEADLINE_FROM_NOW = 60 * 20;

  const deadline = blockTime + DEFAULT_DEADLINE_FROM_NOW;

  const args = [
    coinATokenAmount.currency.address,
    coinBTokenAmount.currency.address,
    coinATokenAmount.raw.toString(),
    coinBTokenAmount.raw.toString(),
    amountsMin['CURRENCY_A'].toString(),
    amountsMin['CURRENCY_B'].toString(),
    account,
    Web3.utils.asciiToHex(deadline + ''),
  ];
  return args;

}

export async  function checkoutTokenAllowance(tokenA,tokenB,library,chainID,account){

  // ROUTER_ADDRESS
  
  const TokenAContract = useTokenContractMulticall(tokenA);
  const TokenBContract = useTokenContractMulticall(tokenB);

  const callList=[TokenAContract.allowance(account, ROUTER_ADDRESS),
    TokenBContract.allowance(account, ROUTER_ADDRESS)];

  const ethcallProvider = new Provider(library,chainID);
  await ethcallProvider.init(); // Only required when `chainId` is not provided in the `Provider` constructor
  const listresult  = await ethcallProvider.all(callList);

  const [tokenAallowance,tokenBallowance] =  listresult;

  return  {
    tokenAallowance,
    tokenBallowance
  };



}


export async function  readpariInfoNuminfo(chainID,library,account,tokensymbolA,tokensymbolB){
  console.log('readpariInfoNuminfo');
   const  pairInfo = await  readpariInfo(chainID,library,tokensymbolA,tokensymbolB) ;

   const callList = [];

   const TokenContract = useTokenContractMulticall(pairInfo.liquidityToken);
        
        
   callList.push(TokenContract.totalSupply());
   callList.push(TokenContract.balanceOf(account));

   const ethcallProvider = new Provider(library,chainID);
   await ethcallProvider.init(); // Only required when `chainId` is not provided in the `Provider` constructor
   const listresult  = await ethcallProvider.all(callList);
   const  totalSupply = listresult[0];
   const  balance = listresult[1];


   const totalSupplyTokenAmount = new TokenAmount(pairInfo.liquidityToken, totalSupply.toString());
   const balanceTokenAmount = new TokenAmount(pairInfo.liquidityToken, balance.toString());

   const aToketotalSupply = pairInfo.getLiquidityValue(pairInfo.tokenAmounts[0].token, totalSupplyTokenAmount, totalSupplyTokenAmount, false);
   const bToketotalSupply = pairInfo.getLiquidityValue(pairInfo.tokenAmounts[1].token, totalSupplyTokenAmount, totalSupplyTokenAmount, false);

   const aTokenbalance = pairInfo.getLiquidityValue(pairInfo.tokenAmounts[0].token, totalSupplyTokenAmount, balanceTokenAmount, false);
   const bTokenbalance = pairInfo.getLiquidityValue(pairInfo.tokenAmounts[1].token, totalSupplyTokenAmount, balanceTokenAmount, false);

   const route = new Route([pairInfo], pairInfo.tokenAmounts[0].token);
   const price = route.pairs[0].priceOf(pairInfo.tokenAmounts[0].token);

   let poolPercentData = Calculatepercentage(balance.toString(),totalSupply.toString()) ;
     poolPercentData = poolPercentData.toString();

  //  if (poolPercentData.times(10000).isLessThan(1)) {
  //   poolPercentData = '<0.01';
  // } else {
  //   poolPercentData = poolPercentData.times(100).toString();
  // }

   return {
    pairInfo,
    aToketotalSupply,
    bToketotalSupply,
    aTokenbalance,
    bTokenbalance,
    totalSupply,
    balance,
    price,
    priceinvert:price.invert(),
    poolPercentData
   };

}


export async function checkApprove(chainID,library,account,coinATokenAmount,coinBTokenAmount){

  //coinATokenAmount.token
  const TokenAContract = useTokenContractMulticall(coinATokenAmount.token);
  const TokenBContract = useTokenContractMulticall(coinBTokenAmount.token);

  const  spender = ROUTER_ADDRESS  ;
  const callList=[];

  callList.push(TokenAContract.allowance(account, spender));
  callList.push(TokenBContract.allowance(account, spender));

  const ethcallProvider = new Provider(library,chainID);
  await ethcallProvider.init(); // Only required when `chainId` is not provided in the `Provider` constructor
  const listresult  = await ethcallProvider.all(callList);
  const  [Aallowance,Ballowance] =  listresult;

  console.log(Aallowance,Ballowance);
  let tokenAnotNeed =false,tokenBnotNeed = false;
  const aUserin = new BigNumber(coinATokenAmount.raw.toString());
  const bUserin = new BigNumber(coinBTokenAmount.raw.toString());

  if(aUserin.lt(Aallowance.toString())||aUserin.eq(Aallowance.toString())){
    tokenAnotNeed = true;
  }

  if(bUserin.lt(Ballowance.toString())||bUserin.eq(Ballowance.toString())){
    tokenBnotNeed = true;
  }
  
  // const tokenAnotNeed = coinATokenAmount.isLessThanOrEqualTo(Aallowance.toString());

  // const tokenBnotNeed = coinBTokenAmount.isLessThanOrEqualTo(Ballowance.toString());

  return {
    tokenAnotNeed,
    tokenBnotNeed
  };


}

export async function  addliquidityGas (chainID,library,account,parameters){
  const contract = getRouterContract(chainID, library, account);

  const estimatedGasLimit = await contract.estimateGas.addLiquidity(...parameters, {});
  const gasPrice = await getGasPrice(library);

  const useWEI = estimatedGasLimit.mul(gasPrice);
  const fee = Web3.utils.fromWei(useWEI.toString());

  return fee;
}

export async function sendaddliquidity(chainID,library,account,parameters){

  const contract = getRouterContract(chainID, library, account);
  const estimatedGasLimit = await contract.estimateGas.addLiquidity(...parameters, {});
    
  const result = await contract.addLiquidity(...parameters, {
          ...{},
          gasLimit: calculateGasMargin(estimatedGasLimit),
        });
  return result;

}

export async  function getpairPrice(pairaddress,chainID,tokenA,tokenB){
  const data = await pairPrice(pairaddress);
  if(data == ''){
    return null;
  }
  const PriceInfo = swapExactTokensForTokensformat(data.Data.txs,chainID,tokenA,tokenB) ;
  // inamount: "1000000000000000000"
  // outamount: "187379656538552111"
  // tokenA: "USDT"
  // tokenB: "scUSD"
  if(!PriceInfo ){
    return null;
  }
  

  const innum = new  BigNumber(PriceInfo.inamount);
  const outnum = new  BigNumber(PriceInfo.outamount); 

  const infoData = {
    [PriceInfo.tokenA+"/"+PriceInfo.tokenB]:innum.div(outnum).toFixed(3),
    [PriceInfo.tokenB+"/"+PriceInfo.tokenA]:outnum.div(innum).toFixed(3),
  };
  const obj={};
  obj[tokenA+'/'+tokenB] =infoData[tokenA+'/'+tokenB];
  return obj;


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