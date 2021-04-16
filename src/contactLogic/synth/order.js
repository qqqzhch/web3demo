import { useVaultContract } from './contractApi';
import { getNameHex } from "../buildr/create";
import { contractEstimateGas } from "../buildr/balance";

/**
 * Exchange
 * buy: scUSD => sc[Coin]
 * sell: sc[Coin] => scUSD
 * SourceKey or destKey must be scUSD
 *
 * 目前只有sBTC
 * */
export const createOrder = async ({web3, chainID, library, account, side, volume, product}) => {
  const VaultContract = useVaultContract(chainID, account, library);
  const { baseSymbol } = product;

  const sourceKey = getNameHex(web3, 'scUSD');
  const destKey = getNameHex(web3, baseSymbol);
  const amount = web3.utils.toWei(volume.toString());

  try {
    let response;
    switch(side) {
      case 'buy':
        response = await contractEstimateGas(VaultContract, 'exchange', [sourceKey, amount, destKey]);
        break;
      case 'sell':
        response = await contractEstimateGas(VaultContract, 'exchange', [destKey, amount, sourceKey]);
        break;
    }

    return {
      hash: response.hash,
      response: response,
    };
  } catch (error) {
    console.error(error);
  }
};
