
import { Contract, Provider } from '@webfans/ethers-multicall';
import { ethers } from 'ethers';
import tokens from "@/constants/token.json";
import _ from 'underscore';

import { useTokenContractMulticall 
} from "../contacthelp/useContractMulticall.js";

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
    const [TokenAamount,TokenBamount] = await ethcallProvider.all(callList);
    return{
        TokenAamount,TokenBamount
    };

}

export function getToken(tokensymbol,chainID){
    console.log(tokens);
    const coin= _.find(tokens.tokens,{chainId:chainID,symbol:tokensymbol});
    return coin;
}