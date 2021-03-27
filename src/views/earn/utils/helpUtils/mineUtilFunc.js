import multiSymbolData from "@/constants/earnList.json";
import tokenlist from "@/constants/token.json";
import { TokenAmount } from "@webfans/uniswapsdk";
import _ from 'underscore';



import { useStakingRewardsbalance, useStakingRewardstotalSupply, useStakingRewardsRead } from "./allowances.js";

import { Contract, Provider } from '@webfans/ethers-multicall';

import { useStakingRewardsContractMulticall,useTokenContractMulticall } from "@/contacthelp/useContractMulticall.js";


function getTokenInfo(chainID, address) {
  let result;
  _.find(tokenlist.tokens, (item) => {
    if (item.chainId === chainID && item.address.toString() === address.toString()) {
      result = item;
    }
  });
  return result;
}

export async function StakingRewardList(library, account, chainID) {
  // console.log({library, account, chainID});
  const list = multiSymbolData || [];
  const result = [];

  list.forEach((item) => {
    if (item.chainId === chainID) {
      result.push(item);
    }
  });

  for (let index = 0; index < result.length; index++) {
    const element = result[index];
    let balance, totalSupply, rewardRate, earned, rewardToken, TokenAddress, TokenAddressbalance;
    const originRewardRate = await useStakingRewardsRead(library, account, element, 'rewardRate', []);
    totalSupply = await useStakingRewardstotalSupply(library, account, element);
    rewardRate = new TokenAmount(element, originRewardRate.toString());
    // 未连接钱包状态
    if (!account) {
      element.data = {
        balance: '',
        totalSupply: totalSupply.toSignificant(6),
        rewardRate: rewardRate.toSignificant(6),
        LPTokenAddress: '',
        earned: '',
        rewardToken: '',
        LPTokenbalance: '',
      };
    } else {
      try {
        const rewardsTokenAddress = await useStakingRewardsRead(library, account, element, 'rewardsToken', []);

        rewardToken = getTokenInfo(chainID, rewardsTokenAddress);

        balance = await useStakingRewardsbalance(library, account, element);

        //  TokenAddress = await useStakingRewardsRead(library,account,element,'stakingToken',[]);
        earned = await useStakingRewardsRead(library, account, element, 'earned', [account]);

        TokenAddress = await useStakingRewardsRead(library, account, element, 'stakingToken', []);

        const newToken = _.clone(element);
        newToken.address = TokenAddress;
        TokenAddressbalance = await useStakingRewardsbalance(library, account, newToken);

        earned = new TokenAmount(element, earned.toString());

        //  console.log('TokenAddress',TokenAddress)

      } catch (error) {
        console.log(error);
      }
      element.data = {
        balance: balance.toSignificant(6),
        totalSupply: totalSupply.toSignificant(6),
        rewardRate: rewardRate.toSignificant(6),
        LPTokenAddress: TokenAddress,
        earned: earned.toSignificant(6),
        rewardToken: rewardToken.symbol,
        LPTokenbalance: TokenAddressbalance.toSignificant(6),
      };
    }
    element.tokens = [];
    _.find(tokenlist.tokens, (item) => {
      if (item.chainId === chainID && element.symbol.indexOf(item.symbol) > -1) {
        element.tokens.push(item);

      }

    });


  }
  return result;
}


export async function StakingRewardListbatch(library, account, chainID){
  console.log({library, account, chainID});
  const list = multiSymbolData || [];
  const result = [];

  list.forEach((item) => {
    if (item.chainId === chainID) {
      result.push(item);
    }
  });
  
  let callList = [];

  result.forEach((element)=>{

    const  TokenAContract = useStakingRewardsContractMulticall(element);
    
    callList.push(TokenAContract.rewardRate());
    callList.push(TokenAContract.stakingToken());
    callList.push(TokenAContract.totalSupply());
    callList.push(TokenAContract.rewardsToken());
    

    
  });
  const ethcallProvider = new Provider(library,chainID);
  await ethcallProvider.init(); // Only required when `chainId` is not provided in the `Provider` constructor
  const infoList = await ethcallProvider.all(callList);
  console.log(infoList);


  callList = [];
  let j=0;

  for (let index = 0; index < infoList.length; index+=4) {
    const element = result[j];
    console.log('element',element);
    j++;


    const rewardRate = infoList[index];
    const stakingToken_ = infoList[index+1];
    const totalSupply = infoList[index+2];
    const rewardsToken_ = infoList[index+3];

    console.log('rewardRate',rewardRate.toString());
    console.log('stakingToken',stakingToken_);
    console.log('totalSupply',totalSupply.toString());
    console.log('rewardsToken',rewardsToken_);
    element.data={
      rewardRate:rewardRate,
      stakingToken:stakingToken_,
      totalSupply:totalSupply,
      rewardsToken:rewardsToken_
    };

    

    const  stakingToken = {
      address:stakingToken_
    };
    

    try {
      // const rewardTokenContract = useTokenContractMulticall(rewardToken);

      const stakingTokenContract = useTokenContractMulticall(stakingToken);
      const  TokenAContract = useStakingRewardsContractMulticall(element);
    
    

      // callList.push(rewardTokenContract.balanceOf(account));
      callList.push(stakingTokenContract.balanceOf(account));
      callList.push(TokenAContract.earned(account));
      callList.push(TokenAContract.balanceOf(account));
      
    } catch (error) {
      console.log(error);
    }
    

    // TokenAContract.earned(account)

    
  }

  const infoList2 = await ethcallProvider.all(callList);
  // console.log('infoList2',infoList2);
  let jj=0;
   for (let index = 0; index < infoList2.length; index+=3) {
     const element = result[jj];
     jj++;

      // const rewardbalance = infoList2[index];
      const stakingbalance = infoList2[index];
      const earn = infoList2[index+1];
      const haveStack = infoList2[index+2];

      element.data['stakingbalance']=stakingbalance;
      element.data['earn']=earn;
      element.data['haveStack']=haveStack;

      console.log(element);
      // console.log('rewardbalance',stakingbalance.toString());
      console.log('stakingbalance',stakingbalance.toString());
      console.log('earn',earn.toString());
      console.log('haveStack',haveStack.toString());

     
   }

   console.log(result);



  // if(account){

  // } 



}



