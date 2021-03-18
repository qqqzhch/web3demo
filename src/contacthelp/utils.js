import { Contract } from "@ethersproject/contracts";
import { getAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { BigNumber } from "@ethersproject/bignumber";
import { abi as IUniswapV2Router02ABI } from "@uniswap/v2-periphery/build/IUniswapV2Router02.json";

import { Contract as ContractMulticall} from '@webfans/ethers-multicall';

import {
  ChainId,
  JSBI,
  Percent,
  Token,
  CurrencyAmount,
  Currency,
  ETHER,
} from "@webfans/uniswapsdk";

// import { TokenAddressMap } from '../state/lists/hooks'

import { ROUTER_ADDRESS, ZERO_ADDRESS } from "@/constants/index.js";

export function isAddress(value) {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

// account is not optional
export function getSigner(library, account) {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
export function getProviderOrSigner(library, account) {
  return account ? getSigner(library, account) : library;
}

// account is optional
export function getContract(address, ABI, library, account) {
  // console.log('getContract');
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account));
}

export function getContractMulticall(address, ABI) {
  // console.log('getContract');
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new ContractMulticall(address, ABI);
}



// account is optional
export function getRouterContract(_, library, account) {
  return getContract(ROUTER_ADDRESS, IUniswapV2Router02ABI, library, account);
}

/**
 * Returns true if the string value is zero in hex
 * @param hexNumberString
 */
export function isZero(hexNumberString) {
  return /^0x0*$/.test(hexNumberString);
}

// add 10%
export function calculateGasMargin(value) {
  return value
    .mul(BigNumber.from(10000).add(BigNumber.from(1000)))
    .div(BigNumber.from(10000));
}

// export function calculateGasMarginS(value) {
//   // console.log('calculateGasMarginS',value)
//   const BN = web3.utils.BN;
//   return value.mul(new BN(10000).add(new BN(1000))).div(new BN(10000));
// }

// export function useSingleCallResult(contract, methodName, inputs, options) {
//   const fragment = () => contract?.interface?.getFunction(methodName);

//   const calls = () => {
//     return contract && fragment && isValidMethodArgs(inputs)
//       ? [
//           {
//             address: contract.address,
//             callData: contract.interface.encodeFunctionData(fragment, inputs),
//           },
//         ]
//       : [];
//   };

//   const result = useCallsData(calls, options)[0];
//   const latestBlockNumber = useBlockNumber();

//   {
//   }
// }

export function calculateSlippageAmount(value, slippage) {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`);
  }
  return [
    JSBI.divide(
      JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)),
      JSBI.BigInt(10000)
    ),
    JSBI.divide(
      JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)),
      JSBI.BigInt(10000)
    ),
  ];
}

export function isNum(data) {
  const isnuma = /^[0-9]+$/.test(data);
  const isnumb = /^[0-9]+\.?[0-9]+?$/.test(data);
  if (isnuma || isnumb) {
    return true;
  } else {
    return false;
  }
}

export function basisPointsToPercent(num) {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000));
}
