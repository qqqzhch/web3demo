
import { usePairContract } from "@/contacthelp/useContract.js";
import Web3 from 'web3';

import {  Token, TokenAmount, Fetcher ,
    Route, Percent, Router
} from "@webfans/uniswapsdk";

import { getTime } from "@/contacthelp/ethcom.js";
import { INITIAL_ALLOWED_SLIPPAGE,ROUTER_ADDRESS } from '@/constants/index.js';
import { splitSignature } from "@ethersproject/bytes";

import {
  calculateGasMargin,
  getRouterContract,
  calculateSlippageAmount,
} from "@/contacthelp/utils.js";
import {  getGasPrice } from '@/contacthelp/ethusdt.js';

import BigNumber  from 'bignumber.js';

import getChainCoinInfo from '@/constants/networkCoinconfig.js';


export async function localApprove(library,chainId,account,pair,ToRemoveAmount){
    const pairContract = usePairContract(
        library,
        account,
        pair.liquidityToken.address
      );

    const nonce = await pairContract.nonces(account);
    const lasttime = await getTime();
    const DEFAULT_DEADLINE_FROM_NOW = 60 * 20;
    const deadline = lasttime + DEFAULT_DEADLINE_FROM_NOW;


    const EIP712Domain = [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ];
      const domain = {
        name: "Uniswap V2",
        version: "1",
        chainId: chainId,
        verifyingContract: pair.liquidityToken.address,
      };
      const Permit = [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ];

     const liquidityAmount = new TokenAmount(
        pair.liquidityToken,
        ToRemoveAmount.raw.toString()
      );


      const message = {
        owner: account,
        spender: ROUTER_ADDRESS,
        value: liquidityAmount.raw.toString(),
        nonce: nonce.toHexString(),
        deadline: deadline,
      };

      const data = JSON.stringify({
        types: {
          EIP712Domain,
          Permit,
        },
        domain,
        primaryType: "Permit",
        message,
      });


      const  result = await new Promise((resolve, reject)=>{
        library
        .send("eth_signTypedData_v4", [account, data])
        .then(splitSignature)
        .then((signature) => {
            const SignatureData = {
              v: signature.v,
              r: signature.r,
              s: signature.s,
              deadline: deadline,
            };
            resolve(SignatureData);
            
            
          })
          .catch((error) => {
            reject(error);
          });

     });

     return result;



}

export async function buildremoveparameter({library,chainId,account,pair,
  signatureData,ToRemoveAmount,currencyAmountA,currencyAmountB}){

  console.log('buildremoveparameter');

  const liquidityAmount = new TokenAmount(
    pair.liquidityToken,
    ToRemoveAmount.raw.toString()
  );

  const amountsMin = {
    ["CURRENCY_A"]: calculateSlippageAmount(
      currencyAmountA,
      INITIAL_ALLOWED_SLIPPAGE
    )[0],
    ["CURRENCY_B"]: calculateSlippageAmount(
      currencyAmountB,
      INITIAL_ALLOWED_SLIPPAGE
    )[0],
  };

  let currencyoneIsETH = false,currencyBIsETH=false;
  const coinInfo = getChainCoinInfo(chainId);


  if(currencyAmountA.token.symbol==coinInfo.coinName||currencyAmountB.token.symbol==coinInfo.coinName){
    currencyoneIsETH = true;
    if(currencyAmountB.token.symbol==coinInfo.coinName){
      currencyBIsETH = true;
    }
  }

  let args;

  if(currencyoneIsETH){
    args = [
     currencyBIsETH?currencyAmountA.token.address:currencyAmountB.token.address,
     liquidityAmount.raw.toString(),
     amountsMin["CURRENCY_A"].toString(),
     amountsMin["CURRENCY_B"].toString(),
     account,
     signatureData.deadline,
     false,
     signatureData.v,
     signatureData.r,
     signatureData.s,
   ];

 }else{
    args = [
     currencyAmountA.token.address,
     currencyAmountB.token.address,
     liquidityAmount.raw.toString(),
     amountsMin["CURRENCY_A"].toString(),
     amountsMin["CURRENCY_B"].toString(),
     account,
     signatureData.deadline,
     false,
     signatureData.v,
     signatureData.r,
     signatureData.s,
   ];
  }

  console.log('args',args);
  return args;


}


export async function  removeliquidityGas (chainID,library,account,parameters){
  const contract = getRouterContract(chainID, library, account);
  let estimatedGasLimit,estimatedGasLimit1,estimatedGasLimit2;

  if(parameters.length==10){
    console.log('----1');
    estimatedGasLimit1 = await contract.estimateGas.removeLiquidityETHWithPermit(...parameters, {});
    estimatedGasLimit2 = await contract.estimateGas.removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(...parameters, {});

    if(BigNumber.isBigNumber(estimatedGasLimit1)){
      estimatedGasLimit = estimatedGasLimit1;
    }else if(BigNumber.isBigNumber(estimatedGasLimit2)){
      estimatedGasLimit = estimatedGasLimit2;
    }

  }else{
    console.log('----2');
     estimatedGasLimit = await contract.estimateGas.removeLiquidityWithPermit(...parameters, {});

  }
  

  const gasPrice = await getGasPrice(library);

  const useWEI = estimatedGasLimit.mul(gasPrice);
  const fee = Web3.utils.fromWei(useWEI.toString());

  return fee;
}

export async function sendremoveliquidity(chainID,library,account,parameters){

  const contract = getRouterContract(chainID, library, account);

  let estimatedGasLimit,estimatedGasLimit1,estimatedGasLimit2;
  if(parameters.length==10){
     estimatedGasLimit1 = await contract.estimateGas.removeLiquidityETHWithPermit(...parameters, {});
     estimatedGasLimit2 = await contract.estimateGas.removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(...parameters, {});

  }else{
     estimatedGasLimit = await contract.estimateGas.removeLiquidityWithPermit(...parameters, {});

  }
  

  let result;
  if(parameters.length==10){
    if(BigNumber.isBigNumber(estimatedGasLimit1)){
      estimatedGasLimit = estimatedGasLimit1;
       result = await contract.removeLiquidityETHWithPermit(...parameters, {
        ...{},
        gasLimit: calculateGasMargin(estimatedGasLimit),
      });
  
    }else if(BigNumber.isBigNumber(estimatedGasLimit2)){
      estimatedGasLimit = estimatedGasLimit2;
      result = await contract.removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(...parameters, {
        ...{},
        gasLimit: calculateGasMargin(estimatedGasLimit),
      });
    }
  
  }
  else{
    result = await contract.removeLiquidityWithPermit(...parameters, {
      ...{},
      gasLimit: calculateGasMargin(estimatedGasLimit),
    });

  }

  
        
  return result;
      
}

  