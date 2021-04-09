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

import {useScusdDeposit_VaultContract,useScusdDeposit_MasterContract,useScusdDeposit_syntheticContract} from '../../contacthelp/useContract.js';

import synthetixTokens from "@/constants/synthetix.json";
import Web3 from 'web3';



export const getProxyVaultToken = (chainID) => {
   const token = synthetixTokens.find((token) => {
     return chainID === token.chainId && token.name === 'ProxyVault';
   });
   return token || {};
 };

 export const getMasterChefToken = (chainID) => {
   const token = synthetixTokens.find((token) => {
     return chainID === token.chainId && token.name === 'MasterChef';
   });
   return token || {};
 };

 export const getSyntheticToken = (chainID) => {
  const token = synthetixTokens.find((token) => {
    return chainID === token.chainId && token.name === 'Synthetic';
  });
  return token || {};
};

export  function getSCUSDVaultContract({chainID,account, library}){
   const Token =  getProxyVaultToken(chainID);
   const VaultContract =  useScusdDeposit_VaultContract(library,account,Token.address,true);

   return VaultContract;

}

export  function getSCUSDMasterContract({chainID,account, library}){
   const Token =  getMasterChefToken(chainID);
   const VaultContract =  useScusdDeposit_MasterContract(library,account,Token.address,false);

   return VaultContract;

}

export  function getSCUSDMasterContractSigner({chainID,account, library}){
  const Token =  getMasterChefToken(chainID);
  const VaultContract =  useScusdDeposit_MasterContract(library,account,Token.address,true);

  return VaultContract;

}

export  function getMasterUserInfo({chainID,account, library}){
   const MasterContract = getSCUSDMasterContract({chainID,account, library});
   const poolName =getNameHex(Web3,'Synth');

   const data = MasterContract.getUserInfo(poolName, account);

   return data;

}

export  function getMasterPendingScash({chainID,account, library}){
   const MasterContract = getSCUSDMasterContract({chainID,account, library});
   const poolName =getNameHex(Web3,'Synth');

   const data = MasterContract.pendingScash(poolName, account);

   return data;

}

export async function getmaxExitableAmount({chainID,account, library}){
  const Token = getSyntheticToken(chainID);
  const Contract = useScusdDeposit_syntheticContract(library,account,Token.address,true);


  const data = await Contract.maxExitableAmount(account);

  return data;

}


export async function Masterwithdraw({chainID,account, library}){
  const MasterContract = getSCUSDMasterContractSigner({chainID,account, library});
  const poolName =getNameHex(Web3,'Synth');
  const esGas = await MasterContract.estimateGas.withdraw(poolName);
  const tx = await MasterContract.withdraw(poolName,{
    gasLimit: esGas
  });

  return tx;

}



