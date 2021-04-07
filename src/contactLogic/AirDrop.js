import { useAirDropContract } from '@/contacthelp/useContract.js';
import AirDropconfig from '@/constants/AirDrop.json';
import _ from 'underscore';
// import { AirDropper_address } from '@/constants/index.js'

import {
  calculateGasMargin,
  getRouterContract,
  calculateSlippageAmount,
} from "@/contacthelp/utils.js";


export async function userAirDropValue(
  library,
  account,
  chainId
) {

  const tokenConig = _.find(AirDropconfig, { name: 'AirDrop', chainId: chainId });
  const contract = useAirDropContract(library, account, tokenConig.address, false);


  let rewarder = 0;
  try {
    rewarder = await contract.rewarders(account);
  } catch (error) {
    console.log(error);
  }
  return rewarder;

}


export async function withdrawAirDropGas(library,
  account, chainId) {
  console.log('--');
  const tokenConig = _.find(AirDropconfig, { name: 'AirDrop', chainId: chainId });
  const contract = useAirDropContract(library, account, tokenConig.address, true);
  const dataGas = contract.estimateGas.withdraw();

  return dataGas;

}

export async function withdrawAirDropValue(library,
  account, chainId) {

  const tokenConig = _.find(AirDropconfig, { name: 'AirDrop', chainId: chainId });
  const estimatedGasLimit = await withdrawAirDropGas(library,
    account, chainId);
  const contract = useAirDropContract(library, account, tokenConig.address, true);
  const dataGas = contract.withdraw({
    gasLimit: calculateGasMargin(estimatedGasLimit),
  });

  return dataGas;

}