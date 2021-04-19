import { getNameHex } from "../buildr/create";
import {
  useScusdDeposit_ExchangerContractMulticall,
  useSscusdDeposit_SynthContractMulticall
} from '@/contacthelp/useContractMulticall.js';
import { useExchangerContract } from './contractApi';
import { getExchangerToken } from "../buildr/tokens";
import { Contract, Provider } from '@webfans/ethers-multicall';
import { getMasterUserInfo } from "../earn/scusdDeposit";



/**
 *  获取合成的scUSD余额(LP)
 * */

export const fetchSynthScUSDBalance = async ({chainID, account, library}) => {
  try {
    const data = await getMasterUserInfo({ chainID, account, library });
    return {
      scUSDAmount: data[0].toString()
    };
  } catch (error) {
    console.log(error);
  }
};

/**
 * 获取Assets数量
 * 1 根据Exchanger.sol合约的synths方法，通过合约资产的TokenName获取合约地址。
 * 2 根据合约地址,通过Synth.sol合约的balanceOf方法获取资产数量。
 * 3 目前只部署了sBTC
 * */

export const fetchSynthAssetsList = async ({web3, chainID, account, library, products}) => {
  const callList = [] ;
  products.forEach((product)=>{
    const methodName = 'synths';
    const nameKey = getNameHex(web3, product.baseSymbol);
    const parameter = [nameKey];
    const Token = getExchangerToken(chainID);

    const ContractMulticall = useScusdDeposit_ExchangerContractMulticall(Token);
    callList.push(ContractMulticall[methodName](...parameter));
  });

  const ethcallProvider = new Provider(library, chainID);
  await ethcallProvider.init(); // Only required when `chainId` is not provided in the `Provider` constructor
  const synthAddressList = await ethcallProvider.all(callList);

  const callList2 = [];
  synthAddressList.forEach((address)=>{
    const synthContract = useSscusdDeposit_SynthContractMulticall({ address });

    // callList2.push(synthContract.symbol());
    callList2.push(synthContract.balanceOf(account));
  });
  const synthAssetsList = await ethcallProvider.all(callList2);
  const synthAssets = products.map((product, index) => {
    const assetAmount = web3.utils.fromWei(synthAssetsList[index].toString());
    // console.log(index, product.baseSymbol, synthAddressList[index], assetAmount);
    return {
      ...product,
      assetAmount
    };
  });

  return synthAssets;
};


/**
 * 获取用户scUSD净值
 * */

export const fetchAccountNetValue = async ({web3, chainID, account, library, amount}) => {
  const methodName = 'calAmountFromBlackhole';
  const parameter =  [web3.utils.toWei(amount.toString())];
  const [netValue, direction] = await useExchangerContract(chainID, account, library, methodName, parameter);

  return {
    netValue: web3.utils.fromWei(netValue.toString()),
    direction,
  };
};


/**
 * 获取当前手续费率
 * currFeeRate 当前费率
 * direction: true 表示费率为负数，false 表示费率为正
 * */

export const fetchCurrFeeRate = async ({web3, chainID, account, library, amount}) => {
  const methodName = 'currentFeeRate';
  const parameter =  [];
  const [currFeeRate, direction]  = await useExchangerContract(chainID, account, library, methodName, parameter);

  let feeRate = web3.utils.fromWei(currFeeRate.toString());
  feeRate = direction ? -feeRate : feeRate;

  return {
    currFeeRate: feeRate,
  };
};
