import {
  calculateGasMargin,
  getRouterContract,
  isZero,
  calculateSlippageAmount
} from "./utils.js";

export default async function SendSwap(swapCalls, trade,account) {
  console.log(swapCalls, trade);
  const estimatedCalls = await Promise.all(
    swapCalls.map(call => {
      const {
        parameters: { methodName, args, value },
        contract
      } = call;
      const options = !value || isZero(value) ? {} : { value };

      return contract.estimateGas[methodName](...args, options)
        .then(gasEstimate => {
          return {
            call,
            gasEstimate
          };
        })
        .catch(gasError => {
          console.debug(
            "Gas estimate failed, trying eth_call to extract error",
            call
          );

          return contract.callStatic[methodName](...args, options)
            .then(result => {
              console.debug(
                "Unexpected successful call after failed estimate gas",
                call,
                gasError,
                result
              );
              return {
                call,
                error: new Error(
                  "Unexpected issue with estimating the gas. Please try again."
                )
              };
            })
            .catch(callError => {
              console.debug("Call threw error", call, callError);
              let errorMessage;
              switch (callError.reason) {
                case "UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT":
                case "UniswapV2Router: EXCESSIVE_INPUT_AMOUNT":
                  errorMessage =
                    "This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.";
                  break;
                default:
                  errorMessage = `The transaction cannot succeed due to error: ${callError.reason}. This is probably an issue with one of the tokens you are swapping.`;
              }
              return { call, error: new Error(errorMessage) };
            });
        });
    })
  );

  // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
  const successfulEstimation = estimatedCalls.find(
    (el, ix, list) =>
      "gasEstimate" in el &&
      (ix === list.length - 1 || "gasEstimate" in list[ix + 1])
  );

  if (!successfulEstimation) {
    const errorCalls = estimatedCalls.filter(call => "error" in call);
    if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error;
    throw new Error(
      "Unexpected error. Please contact support: none of the calls threw an error"
    );
  }

  const {
    call: {
      contract,
      parameters: { methodName, args, value }
    },
    gasEstimate
  } = successfulEstimation;
  const recipient = account;

return new Promise((resolve, reject)=>{
  contract[methodName](...args, {
    gasLimit: calculateGasMargin(gasEstimate),
    ...(value && !isZero(value) ? { value, from: account } : { from: account })
  })
    .then(response => {
      const inputSymbol = trade.inputAmount.currency.symbol;
      const outputSymbol = trade.outputAmount.currency.symbol;
      const inputAmount = trade.inputAmount.toSignificant(6);
      const outputAmount = trade.outputAmount.toSignificant(6);

      const base = `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`;
      // const withRecipient =
      //   recipient === account
      //     ? base
      //     : `${base} to ${
      //         recipientAddressOrName && isAddress(recipientAddressOrName)
      //           ? shortenAddress(recipientAddressOrName)
      //           : recipientAddressOrName
      //       }`;

      // const withVersion =
      //   tradeVersion === Version.v2 ? withRecipient : `${withRecipient} on ${(tradeVersion as any).toUpperCase()}`

      // addTransaction(response, {
      //   summary: withVersion
      // })
      resolve({
        base:base,
        hash:response.hash,
        response:response
      });


    })
    .catch(error => {
      // if the user rejected the tx, pass this along
      if (error?.code === 4001) {
        // throw new Error("Transaction rejected.");
        reject(new Error("Transaction rejected."));
      } else {
        // otherwise, the error was unexpected and we need to convey that
        console.error(`Swap failed`, error, methodName, args, value);
        reject(new Error(`Swap failed: ${error.message}`));
        // throw new Error(`Swap failed: ${error.message}`);
      }
    });


});


}
