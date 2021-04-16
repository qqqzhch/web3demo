import tokenlist from "@/constants/token.json";
import synthetixTokens from "@/constants/synthetix.json";

export const getTokenBySymbol = (chainID, symbol) => {
  const token = tokenlist.tokens.find((token) => {
    return chainID === token.chainId && token.symbol === symbol;
  });
  return token || {};
};

/**
 * getProxyActionsToken 只用于授权操作
 * */
export const getProxyActionsToken = (chainID) => {
  const token = synthetixTokens.find((token) => {
    return chainID === token.chainId && token.name === 'ProxyActions';
  });
  return token || {};
};

export const getProxyToActionsToken = (chainID) => {
  const token = synthetixTokens.find((token) => {
    return chainID === token.chainId && token.name === 'ProxyToActions';
  });
  return token || {};
};

export const getExchangeRatesToken = (chainID) => {
  const token = synthetixTokens.find((token) => {
    return chainID === token.chainId && token.name === 'ExchangeRates';
  });
  return token || {};
};

export const getCollateralToken = (chainID) => {
  const token = synthetixTokens.find((token) => {
    return chainID === token.chainId && token.name === 'Collateral';
  });
  return token || {};
};

export const getCollateralStateToken = (chainID) => {
  const token = synthetixTokens.find((token) => {
    return chainID === token.chainId && token.name === 'CollateralState';
  });
  return token || {};
};

export const getProxyVaultToken = (chainID) => {
  const token = synthetixTokens.find((token) => {
    return chainID === token.chainId && token.name === 'ProxyVault';
  });
  return token || {};
};

export const getExchangerToken = (chainID) => {
  const token = synthetixTokens.find((token) => {
    return chainID === token.chainId && token.name === 'Exchanger';
  });
  return token || {};
};

export const getSynthToken = (chainID) => {
  const token = synthetixTokens.find((token) => {
    return chainID === token.chainId && token.name === 'Synth';
  });
  return token || {};
};
