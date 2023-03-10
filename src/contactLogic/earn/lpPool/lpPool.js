import multiSymbolData from "@/constants/earnList.json";
import tokenlist from "@/constants/token.json";
import { TokenAmount } from "@webfans/uniswapsdk";
import _ from 'underscore';
const BigNumber = require('bignumber.js');
BigNumber.config({ DECIMAL_PLACES: 6, ROUNDING_MODE: BigNumber.ROUND_DOWN });

import { Contract, Provider } from '@webfans/ethers-multicall';

import { useStakingRewardsContractMulticall, useTokenContractMulticall } from "@/contacthelp/useContractMulticall.js";


function getTokenInfo(chainID, address) {
  let result;
  _.find(tokenlist.tokens, (item) => {
    if (item.chainId === chainID && item.address.toString().toLowerCase() === address.toString().toLowerCase()) {
      result = item;
    }
  });
  return result;
}

export async function StakingRewardListbatch(library, account, chainID) {
  // console.log({ library, account, chainID });
  const list = multiSymbolData || [];
  const result = [];
  list.forEach((item) => {
    if (item.chainId === chainID) {
      result.push(item);
    }
  });
  // console.log({ result });
  let callList = [];
  result.forEach((element) => {
    const TokenAContract = useStakingRewardsContractMulticall(element);
    callList.push(TokenAContract.rewardRate());
    callList.push(TokenAContract.uniToken());
    callList.push(TokenAContract.totalSupply());
    callList.push(TokenAContract.lqtyToken());
  });

  // callList.push(TokenAContract.rewardRate());
  // callList.push(TokenAContract.uniToken());
  // callList.push(TokenAContract.totalSupply());
  // callList.push(TokenAContract.lqtyToken());
  const ethcallProvider = new Provider(library, chainID);
  await ethcallProvider.init(); // Only required when `chainId` is not provided in the `Provider` constructor
  const infoList = await ethcallProvider.all(callList);


  callList = [];
  let j = 0;

  for (let index = 0; index < infoList.length; index += 4) {
    const element = result[j];
    j++;
    const rewardRate = infoList[index];
    const totalSupply = infoList[index + 2];
    const stakingToken_ = infoList[index + 1];
    const rewardsToken_ = infoList[index + 3];

    // ?????????????????????????????????????????????
    const rewardRateNumber = new BigNumber(rewardRate.toString()).div('1e18').toNumber();
    const totalSupplyNumber = new BigNumber(totalSupply.toString()).div('1e18').toNumber();
    // console.log({totalSupplyNumber});
    const rewardTokenSymbol = getTokenInfo(chainID, rewardsToken_);
    // console.log({rewardTokenSymbol});
    element.data = {
      rewardRate: rewardRateNumber,
      LPTokenAddress: stakingToken_,
      totalSupply: totalSupplyNumber,
      rewardToken: rewardTokenSymbol.symbol,
    };
    // ?????????????????????
    if (!account) {
      element.data = {
        earned: '',
        balance: '',
        LPTokenbalance: '',
        rewardRate: rewardRateNumber,
        LPTokenAddress: stakingToken_,
        totalSupply: totalSupplyNumber,
        rewardToken: rewardTokenSymbol.symbol,
      };
    } else {
      const stakingToken = {
        address: stakingToken_
      };
      try {
        // const rewardTokenContract = useTokenContractMulticall(rewardToken);
        const stakingTokenContract = useTokenContractMulticall(stakingToken);
        const TokenAContract = useStakingRewardsContractMulticall(element);
        // callList.push(rewardTokenContract.balanceOf(account));
        callList.push(stakingTokenContract.balanceOf(account));
        callList.push(TokenAContract.earned(account));
        callList.push(TokenAContract.balanceOf(account));
      } catch (error) {
        console.log(error);
      }
      const infoList2 = await ethcallProvider.all(callList);
      // console.log('infoList2',infoList2);
      let jj = 0;
      for (let index = 0; index < infoList2.length; index += 3) {
        const element = result[jj];
        // console.log({ element });
        jj++;
        // const rewardbalance = infoList2[index];
        const stakingbalance = infoList2[index];
        const earn = infoList2[index + 1];
        const haveStack = infoList2[index + 2];

        // ????????????????????????????????????
        element.data['LPTokenbalance'] = new BigNumber(stakingbalance.toString()).div('1e18').toNumber();
        element.data['earned'] = new BigNumber(earn.toString()).div('1e18').toNumber();
        element.data['balance'] = new BigNumber(haveStack.toString()).div('1e18').toNumber();

      }
    }
  }

  return result;
}


