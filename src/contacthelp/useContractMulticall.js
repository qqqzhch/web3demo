import { Contract } from "@ethersproject/contracts";

import { ChainId, WETH } from "@webfans/uniswapsdk";


import ERC20_ABI from "../constants/abis/erc20.json";
import ERC20_ABI_LAMB from "../constants/abis/erc20lamb.json";

import ERC20_ABI_tlambbar from "../constants/abis/tlambbar.json";

import { getContractMulticall  } from "./utils.js";

// import { abi as IUniswapV2PairABI } from "@uniswap/v2-core/build/IUniswapV2Pair.json";

import ERC20_ABI_StakingRewards from "@/constants/abis/StakingRewards.json";


import IUniswapV2PairABI  from '@/constants/abis/UniswapV2Pair.json';


import ABI_NDNProxyInterface from "../constants/abis/NDNProxyInterface.json";

import ABI_scusdDeposit_Exchanger from "../constants/abis/scusdDeposit/Exchanger.json";

import ABI_scusdDeposit_Synth from "../constants/abis/scusdDeposit/Synth.json";

// returns null on errors
function useContract(
  address,
  ABI,

) {
  // console.log('useContract');
  if (!address || !ABI) return null;
  try {
    // return new web3.eth.Contract(ABI,address)
    return getContractMulticall(
      address,
      ABI
    );
  } catch (error) {
    console.error("Failed to get contract", error);
    return null;
  }
}

export function useTokenContractMulticall(
  token
) {
  // console.info("- -useTokenContract");
  return useContract(
    token.address,
    ERC20_ABI
  );
}
export function useStakingRewardsContractMulticall(
  token
) {
  // console.info("- -useTokenContract");
  return useContract(
    token.address,
    ERC20_ABI_StakingRewards
  );
}


export function useIUniswapV2PairABIContractMulticall(
  token
) {
  // console.info("- -useTokenContract");
  return useContract(
    token.address,
    IUniswapV2PairABI
  );
}

export function useNDNProxyInterfaceContractMulticall(
  token
) {
  // console.info("- -useTokenContract");
  return useContract(
    token.address,
    ABI_NDNProxyInterface
  );
}


export function useScusdDeposit_ExchangerContractMulticall(
  token
) {
  // console.info("- -useTokenContract");
  return useContract(
    token.address,
    ABI_scusdDeposit_Exchanger
  );
}

export function useSscusdDeposit_SynthContractMulticall(
  token
) {
  // console.info("- -useTokenContract");
  return useContract(
    token.address,
    ABI_scusdDeposit_Synth
  );
}



