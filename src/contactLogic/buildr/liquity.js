const { EthersLiquity,  _connectByChainId } = require("@webfans/lib-ethers");
import {
  Percent,
  Difference,
  Decimalish,
  Decimal,
  Trove,
  LiquityStoreState,
  LUSD_LIQUIDATION_RESERVE,
  LUSD_MINIMUM_DEBT, //系统最小债务
  MINIMUM_COLLATERAL_RATIO,
  CRITICAL_COLLATERAL_RATIO,
} from "@liquity/lib-base";

const mcrPercent = new Percent(MINIMUM_COLLATERAL_RATIO).toString(0);
const ccrPercent = new Percent(CRITICAL_COLLATERAL_RATIO).toString(0);

// 这个是什么地址？
const frontendTag = '0xc7B375ce501a2432A25d584dF1f40c73c83f9534';
// 最低费率0.5%
const minFeeRate = 0.005;
// Gas Limit
const gasLimit = 800000;

/**
 * open Trove
 * */

export const openTrove = async ({library, account, chainID, depositAmount, borrowLUSDAmount, liquityState}) => {

  const maxBorrowingRate = liquityState.borrowingRate.add(minFeeRate).toString();

  const connection =  _connectByChainId(library, library.getSigner(account), chainID, {
    userAddress: account,
    frontendTag,
    useStore: "blockPolled"
  });
  // console.log(connection);

  const liquity = EthersLiquity._from(connection);
  const { newTrove } = await liquity.openTrove({
    depositCollateral: depositAmount,
    borrowLUSD: borrowLUSDAmount,
  }, maxBorrowingRate,{ gasLimit: gasLimit });

  // console.log(newTrove);

  return {
    base: `Deposit: ${depositAmount} BNB, Debt: ${borrowLUSDAmount} LUSD`,
    newTrove
  };
};

/**
 * fetch Liquity Store
 *
 * */

export const fetchLiquityStore = ({library, account, chainID}) => {
  const connection =  _connectByChainId(library, library.getSigner(account), chainID, {
    userAddress: account,
    frontendTag,
    useStore: "blockPolled"
  });
  // console.log(connection);
  const liquity = EthersLiquity._from(connection);

  return liquity;
};

/**
 * calc fee
 * */

const feeFrom  = (original, edited, borrowingRate) => {
  const change = original.whatChanged(edited, borrowingRate);
  if (change && change.type !== "invalidCreation" && change.params.borrowLUSD) {
    return change.params.borrowLUSD.mul(borrowingRate);
  } else {
    return Decimal.ZERO;
  }
};

export const calcTroveIndicators = (liquityState, depositAmount, borrowLUSDAmount) => {
  const originalTrove = liquityState.trove;
  let edited = new Trove(originalTrove.collateral, originalTrove.debt);

  const { price, borrowingRate } = liquityState;

  edited = edited.setCollateral(depositAmount);
  edited = edited.setDebt(borrowLUSDAmount);

  const borrowingFee = feeFrom(originalTrove, edited, borrowingRate).toString();
  const collateralRatio = !edited.isEmpty ? edited.collateralRatio(price).toString() : '';
  // const originalCollateralRatio = !originalTrove.isEmpty ? originalTrove.collateralRatio(price) : undefined;
  // const collateralRatioChange = Difference.between(collateralRatio, originalCollateralRatio);

  return {
    liquidationReserve: LUSD_LIQUIDATION_RESERVE.toString(),
    price,
    borrowingRate,
    borrowingFee,
    collateralRatio
  };
};


