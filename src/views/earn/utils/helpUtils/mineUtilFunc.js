import multiSymbolData from "@/constants/earnList.json";
import tokenlist from "@/constants/token.json";
import { TokenAmount } from "@webfans/uniswapsdk";

import _ from 'underscore';

import { useStakingRewardsbalance, useStakingRewardstotalSupply, useStakingRewardsRead } from "./allowances.js";

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

    // 未连接钱包状态
    if (!account) {
      element.data = {
        balance: '',
        totalSupply: '',
        rewardRate: '',
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
  return list;
}


