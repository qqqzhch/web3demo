import collPools from '@/constants/Collateralpool.json';
import {getCollateralStateToken, getCollateralToken, getProxyToActionsToken, getTokenBySymbol} from "../buildr/tokens";
import { getNameHex } from '../buildr/create';
import {
  useCollateralContractRead,
  useCollateralStateRead,
  useProxyActionsContractRead,
  useProxyActionsContractSigna,
  useSynthetixRewardRead
} from "./contractApi";

import {calculateGasMargin} from "../../contacthelp/utils";
import getChainCoinInfo from '../../constants/networkCoinconfig';



/**
 *  获取抵押资产
 *  1 通过ProxyActions.sol合约获取tokenCollateralAddress
 *  2 根据tokenCollateralAddress 通过Collateral.sol合约获取 tokenCollateralStateAddress
 *  3 根据 tokenCollateralStateAddress 通过CollateralState.sol中accountCollateral方法获取抵押资产：accountCollateral
 * */

export const fetchRewardAddress = async ({ web3, chainID, account, library, tokenName }) => {
    console.log({ web3, chainID, account, library, tokenName });
    const token = getProxyToActionsToken(chainID);
    const methodName = 'collateralAddress';
    const currencyKey = getNameHex(web3, tokenName);
    const parameter = [currencyKey];
    const tokenCollateralAddress = await useProxyActionsContractRead(library, account, token, methodName, parameter);

    const collateralToken = getCollateralToken(chainID);
    collateralToken.address = tokenCollateralAddress;

    const methodName2 = 'rewarderAddress';
    const parameter2 = [];
    const Address = await useCollateralContractRead(library, account, collateralToken, methodName2, parameter2);

    return Address;
  };



  export const getUnClaimedReward = async ({ web3, chainID, account, library, tokenName }) => {
      console.log(web3, chainID, account, library, tokenName );
      const Address = await fetchRewardAddress({ web3, chainID, account, library, tokenName }) ;
      const objToken =  getCollateralToken(chainID);

      objToken.address = Address;



    // const token = getProxyToActionsToken(chainID);
    // const methodName = 'collateralAddress';
    // const currencyKey = getNameHex(web3, tokenName);
    // const parameter = [currencyKey];
    // const tokenCollateralAddress = await useProxyActionsContractRead(library, account, token, methodName, parameter);

    // const collateralToken = getCollateralToken(chainID);
    // collateralToken.address = tokenCollateralAddress;

    const methodName = 'getUnClaimedReward';
    const parameter = [account];

    const result = await useSynthetixRewardRead(library, account, objToken, methodName, parameter);

    return result;
  };


