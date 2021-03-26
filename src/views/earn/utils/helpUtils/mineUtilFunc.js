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
  console.log({library, account, chainID});
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



