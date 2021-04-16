import {useNDNProxyInterfaceContract} from '../contacthelp/useContract.js';
import listToken from '../constants/synthetix.json';
import _ from 'underscore';
import { getNameHex } from './buildr/create';
import Web3 from 'web3';
import {useNDNProxyInterfaceContractMulticall} from '../contacthelp/useContractMulticall.js';
import {  Provider } from '@webfans/ethers-multicall';

// const ocId = '1617712131000000';

export  async function  getTokenPriceinfo(library,account,chainId,key, oracleId){
  const token =  _.find(listToken,{
        "name": "NDNProxyInterface",
        "chainId": chainId
    });

   const NDNContract = useNDNProxyInterfaceContract(
        library,
        account,
        token.address,
        false
      );

    const symbol = getNameHex(Web3,key);
    // console.log(oracleId, symbol);
    // console.log(NDNContract.address);
    const result = await NDNContract.getCoinInfo(oracleId, symbol);

    return result;

}

export async function getTokenListPriceinfo(library,account,chainId,keys){
  const token =  _.find(listToken,{
    "name": "NDNProxyInterface",
    "chainId": chainId
  });

  const  callList=[

  ];
  const NDNContract = useNDNProxyInterfaceContractMulticall(token);

  keys.forEach(element => {
    const symbol = getNameHex(Web3,element.oracleCode);
    // console.log(element.oracleId, symbol);
    // console.log(NDNContract.address);
    const call =  NDNContract.getCoinInfo(element.oracleId, symbol);
    // const call =  NDNContract.getDaoAddr();
    // const call =  NDNContract.getOracleInfo(ocId);

    callList.push(call);

  });
  const ethcallProvider = new Provider(library,chainId);
    await ethcallProvider.init(); // Only required when `chainId` is not provided in the `Provider` constructor
  const result  = await ethcallProvider.all(callList);
  return result;


}

export async function getTokenHistory(library,account,chainId,key, oracleId, nowid){
  const token =  _.find(listToken,{
    "name": "NDNProxyInterface",
    "chainId": chainId
  });

  const  callList=[

  ];
 console.log('---');
  const NDNContract = useNDNProxyInterfaceContractMulticall(token);

  const symbol = getNameHex(Web3,key);
  console.log(nowid);
  for (let index = 0; index < 100; index++) {

    if(nowid-index>0){
      const call =  NDNContract.getCoinInfoById(oracleId,symbol,nowid-index);
      callList.push(call);
    }



  }
  // list.forEach((element,index) => {
  //   console.log('!!!',nowid-index);
  //   const call =  NDNContract.getCoinInfoById(ocId,symbol,nowid-index);
  //   // const call =  NDNContract.getDaoAddr();
  //   // const call =  NDNContract.getOracleInfo(ocId);

  //   callList.push(call);

  // });
  const ethcallProvider = new Provider(library,chainId);
    await ethcallProvider.init(); // Only required when `chainId` is not provided in the `Provider` constructor
  const result  = await ethcallProvider.all(callList);
  return result;


}
