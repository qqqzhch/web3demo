import {
  calculateGasMargin,
  getRouterContract,
  isZero,
  calculateSlippageAmount,
} from "./utils.js";

export default async function SendSwapGas(swapCalls, trade, account) {
  console.log(swapCalls, trade);
  const estimatedCalls = await Promise.all(
    swapCalls.map((call) => {
      const {
        parameters: { methodName, args, value },
        contract,
      } = call;
      const options = !value || isZero(value) ? {} : { value };

      return contract.estimateGas[methodName](...args, options)
        .then((gasEstimate) => {
          return {
            call,
            gasEstimate,
          };
        })
        .catch((gasError) => {
          console.debug(
            "Gas estimate failed, trying eth_call to extract error",
            call
          );
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
    const errorCalls = estimatedCalls.filter((call) => "error" in call);
    if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error;
    throw new Error(
      "Unexpected error. Please contact support: none of the calls threw an error"
    );
  }

  const {
    call: {
      contract,
      parameters: { methodName, args, value },
    },
    gasEstimate,
  } = successfulEstimation;
  const recipient = account;
  return new Promise((resolve, reject) => {
    const data = calculateGasMargin(gasEstimate);
    resolve(data);
  });
}
