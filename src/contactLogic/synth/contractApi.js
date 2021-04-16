import {
  useScusdDeposit_VaultContract,
  useScusdDepositExchangerContract,
  useScusdDepositSynthContract,
} from '../../contacthelp/useContract';
import { getProxyVaultToken, getExchangerToken, getSynthToken } from "../buildr/tokens";

/**
 * Vault合约
 * */
export function useVaultContract(chainID, account, library){
  const Token =  getProxyVaultToken(chainID);

  const VaultContract =  useScusdDeposit_VaultContract(library, account, Token.address,true);

  return VaultContract;
}

/**
 * Exchanger合约
 * */
export async function useExchangerContract(chainID, account, library, methodName, parameter){
  const Token =  getExchangerToken(chainID);

  const ExchangerContract =  useScusdDepositExchangerContract(library, account, Token.address,true);

  let result;
  try {
    result = await ExchangerContract[methodName](...parameter);
  } catch (error) {
    console.log(error);
  }
  return result;
}

/**
 * Synth合约
 * */
export async function useSynthContract(chainID, account, library, synthAddress, methodName, parameter){
  const Token =  getSynthToken(chainID);
  Token.address = synthAddress;

  const SynthContract =  useScusdDepositSynthContract(library, account, Token.address,true);

  let result;
  try {
    result = await SynthContract[methodName](...parameter);
  } catch (error) {
    console.log(error);
  }
  return result;
}
