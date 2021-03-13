import multiSymbolData from "./mineList/list.json";
import tokenlist from "@/constants/token.json";
import { TokenAmount } from "@uniswap/sdk";

import _ from 'underscore';

import { useStakingRewardsbalance, useStakingRewardstotalSupply, useStakingRewardsRead } from "./helpUtils/allowances.js";

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
  const list = multiSymbolData || [];
  const result = [];

  list.forEach((item) => {
    if (item.chainId === chainID) {
      result.push(item);
    }
  });

  for (let index = 0; index < list.length; index++) {
    const element = list[index];
    let balance, totalSupply, rewardRate, earned, rewardToken, TokenAddress, TokenAddressbalance;

    try {
      const rewardsTokenAddress = await useStakingRewardsRead(library, account, element, 'rewardsToken', []);

      rewardToken = getTokenInfo(chainID, rewardsTokenAddress);

      balance = await useStakingRewardsbalance(library, account, element);
      totalSupply = await useStakingRewardstotalSupply(library, account, element);
      rewardRate = await useStakingRewardsRead(library, account, element, 'rewardRate', []);
      //  TokenAddress = await useStakingRewardsRead(library,account,element,'stakingToken',[]);
      earned = await useStakingRewardsRead(library, account, element, 'earned', [account]);

      TokenAddress = await useStakingRewardsRead(library, account, element, 'stakingToken', []);

      const newToken = _.clone(element);
      newToken.address = TokenAddress;
      TokenAddressbalance = await useStakingRewardsbalance(library, account, newToken);


      //  console.log('TokenAddress',TokenAddress)
      rewardRate = new TokenAmount(element, rewardRate.toString());
      earned = new TokenAmount(element, earned.toString());

    } catch (error) {
      console.log(error);
    }
    element.tokens = [];
    _.find(tokenlist.tokens, (item) => {
      if (item.chainId === chainID && element.symbol.indexOf(item.symbol) > -1) {
        element.tokens.push(item);

      }

    });

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
  return list;
}

export async function StakingRewardListInfo(library, account, chainID, address) {
  const list = multiSymbolData || [];
  const selectlist = [];

  list.forEach((item) => {
    if (item.chainId === chainID && item.address === address) {
      selectlist.push(item);
    }
  });
  for (let index = 0; index < selectlist.length; index++) {
    const element = selectlist[index];
    let balance, totalSupply, rewardRate, TokenAddress,rewardToken, earned, TokenAddressbalance;

    try {
      const rewardsTokenAddress = await useStakingRewardsRead(library, account, element, 'rewardsToken', []);
      rewardToken = getTokenInfo(chainID, rewardsTokenAddress);

      balance = await useStakingRewardsbalance(library, account, element);
      totalSupply = await useStakingRewardstotalSupply(library, account, element);
      rewardRate = await useStakingRewardsRead(library, account, element, 'rewardRate', []);
      TokenAddress = await useStakingRewardsRead(library, account, element, 'stakingToken', []);
      earned = await useStakingRewardsRead(library, account, element, 'earned', [account]);

      const newToken = _.clone(element);
      newToken.address = TokenAddress;
      TokenAddressbalance = await useStakingRewardsbalance(library, account, newToken);
      rewardRate = new TokenAmount(element, rewardRate.toString());
      earned = new TokenAmount(element, earned.toString());

      //  TokenAddressbalance = new TokenAmount(newToken, TokenAddressbalance.toString())

    } catch (error) {
      console.log(error);

    }
    element.tokens = [];
    _.find(tokenlist.tokens, (item) => {
      if (item.chainId === chainID && element.symbol.indexOf(item.symbol) > -1) {
        element.tokens.push(item);

      }

    });



    element.data = {
      balance: balance.toSignificant(6),
      totalSupply: totalSupply.toSignificant(6),
      rewardRate: rewardRate.toSignificant(6),
      LPTokenAddress: TokenAddress,
      earned: earned.toSignificant(6),
      LPTokenbalance: TokenAddressbalance.toSignificant(6),
      rewardToken: rewardToken.symbol

    };


  }
  if (selectlist && selectlist[0]) {
    return selectlist[0];

  } else {
    return null;
  }



}


export function findTokenaddress(item, chainID) {
  const addresslist = [];
  _.find(tokenlist.tokens, (token) => {
    if (item.symbol.indexOf(token.symbol) > -1 && token.chainId === chainID) {
      addresslist.push(token);
    }

  });
  return addresslist;

}


