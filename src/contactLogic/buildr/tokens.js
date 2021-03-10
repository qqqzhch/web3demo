import tokenlist from "@/constants/token.json";
import synthetixTokens from "@/constants/synthetix.json";

export const getTokenBySymbol = (chainID, symbol) => {
  const token = tokenlist.tokens.find((token) => {
    return chainID === token.chainId && token.symbol === symbol;
  });
  return token || {};
};

export const getProxyActionsToken = (chainID) => {
  const token = synthetixTokens.find((token) => {
    return chainID === token.chainId && token.name === 'proxyActions';
  });
  return token || {};
};

export const getCollateralToken = (chainID) => {
  const token = synthetixTokens.find((token) => {
    return chainID === token.chainId && token.name === 'Collateral';
  });
  return token || {};
};
