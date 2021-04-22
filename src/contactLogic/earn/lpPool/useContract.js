import ERC20_ABI_StakingRewards from "@/constants/abis/StakingRewards.json";
import { Contract } from "@ethersproject/contracts";
import { getAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";


export function isAddress(value) {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

export function getSigner(library, account) {
  return library.getSigner(account).connectUnchecked();
}


export function getProviderOrSigner(library, account) {
  return account ? getSigner(library, account) : library;
}


function getContract(address, ABI, library, account) {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return new Contract(address, ABI, getProviderOrSigner(library, account));
}

function useContract(library, account, address, ABI, withSignerIfPossible = true) {
  if (!address || !ABI || !library) return null;
  try {
    return getContract(
      address,
      ABI,
      library,
      withSignerIfPossible && account ? account : undefined
    );
  } catch (error) {
    console.error("Failed to get contract", error);
    return null;
  }
}

export function useStakingRewardsContract(library, account, tokenAddress, withSignerIfPossible) {
  return useContract(
    library,
    account,
    tokenAddress,
    ERC20_ABI_StakingRewards,
    withSignerIfPossible
  );
}
