
import { Contract, Provider } from '@webfans/ethers-multicall';
import { ethers } from 'ethers';
import tokens from "@/constants/token.json";
import _ from 'underscore';

import { useTokenContractMulticall 
} from "../contacthelp/useContractMulticall.js";

import {  Token, 
} from "@webfans/uniswapsdk";

import getChainCoinInfo from '@/constants/networkCoinconfig.js';

export async function readSwapBalance(chainID,library, account,TokenA,TokenB){
    console.log('readSwapBalance');
     const  TokenAContract = useTokenContractMulticall(TokenA);
     const  TokenBContract = useTokenContractMulticall(TokenB);

    const callList=[
        TokenAContract.balanceOf(account),
        TokenBContract.balanceOf(account)
    ];

    const ethcallProvider = new Provider(library,chainID);
    await ethcallProvider.init(); // Only required when `chainId` is not provided in the `Provider` constructor
    let [TokenAamount,TokenBamount] = await ethcallProvider.all(callList);
    const coinInfo = getChainCoinInfo(chainID);

    if(TokenA.symbol==coinInfo.coinName){
        TokenAamount = await library.getBalance(account);
    }

    if(TokenB.symbol==coinInfo.coinName){
        TokenBamount = await library.getBalance(account);
    }

    return{
        TokenAamount,TokenBamount
    };

}

export function getToken(tokensymbol,chainID){
    console.log(tokens);
    const coinA= _.find(tokens.tokens,{chainId:chainID,symbol:tokensymbol});
    const TokenA = new Token(coinA.chainId,coinA.address,coinA.decimals,coinA.symbol);
    return TokenA;
}

export function getTokenImg(tokensymbol,chainID){
    
    const coinA= _.find(tokens.tokens,{chainId:chainID,symbol:tokensymbol});
    if(coinA){
        return coinA.logoURI;
    }else{
        return '';

    }
    
}

