const { EthersLiquity,  _connectByChainId } = require("@webfans/lib-ethers");
import {
  Percent,
  Difference,
  Decimalish,
  Decimal,
  Trove,
  LiquityStoreState,
  // LUSD_LIQUIDATION_RESERVE,
  // LUSD_MINIMUM_DEBT, //系统最小债务
  MINIMUM_COLLATERAL_RATIO,
  CRITICAL_COLLATERAL_RATIO,
} from "@liquity/lib-base";
import { AddressZero } from '@ethersproject/constants';
import config  from '@/config/config.js';

const mcrPercent = new Percent(MINIMUM_COLLATERAL_RATIO).toString(0);
const ccrPercent = new Percent(CRITICAL_COLLATERAL_RATIO).toString(0);

/**********Liquity config start***************/
// 业务地址
// const frontendTag = '0xc7B375ce501a2432A25d584dF1f40c73c83f9534';
const frontendTag = AddressZero;
// 最低费率0.5%
const minFeeRate = 0.005;
// Gas Limit
console.log('gasLimit');
const gasLimit = config.gasLimit;
const openGasLimit = 8000000;

export const stableName = 'LAI';

const liquidationRatio = 1.1;
// 清算保证金
const LUSD_LIQUIDATION_RESERVE = 20;

export const LUSD_MINIMUM_DEBT = 200;

/**********Liquity config end***************/

/**
 * 获取最大借贷利率
 * */
export const getMaxBorrowingRate = (liquityState) => {
  return liquityState.borrowingRate.add(minFeeRate).toString();
};

/**
 * fetch Liquity Entity
 *
 * */
export const fetchLiquityEntity = ({library, account, chainID}) => {
  const connection =  _connectByChainId(library, account?library.getSigner(account):undefined, chainID, {
    userAddress: account,
    frontendTag,
    useStore: "blockPolled"
  });
  // console.log(connection);
  const liquity = EthersLiquity._from(connection);

  return liquity;
};


/**
 * open Trove
 * */

export const openTrove = async ({library, account, chainID, depositAmount, borrowLUSDAmount, liquityState}) => {
  const liquity = fetchLiquityEntity({library, account, chainID});
  const maxBorrowingRate = getMaxBorrowingRate(liquityState);

  const transaction = await liquity.send.openTrove({
    depositCollateral: depositAmount,
    borrowLUSD: borrowLUSDAmount,
  }, maxBorrowingRate,{ gasLimit: openGasLimit });

  return {
    base: `Deposit: ${depositAmount} BNB, Debt: ${borrowLUSDAmount} ${stableName}`,
    transaction
  };
};

/**
 * close Trove
 * */

export const closeTrove = async ({library, account, chainID}) => {
  const liquity = fetchLiquityEntity({library, account, chainID});
  const transaction = await liquity.send.closeTrove({gasLimit: gasLimit});
  return {
    base: `Close Vault`,
    transaction
  };
};



/**
 * calc fee
 * liquidationReserve : 清算准备金 200 LUSD
 * price：清算价格
 * borrowingRate： 借贷利率
 * borrowingFee： 借贷费用
 * collateralRatio： 当前抵押率
 * liquidationRatio: 清算抵押率
 * */

const feeFrom  = (original, edited, borrowingRate) => {
  const change = original.whatChanged(edited, borrowingRate);
  if (change && change.type !== "invalidCreation" && change.params.borrowLUSD) {
    return change.params.borrowLUSD.mul(borrowingRate);
  } else {
    return Decimal.ZERO;
  }
};

export const calcTroveIndicators = (liquityState, depositAmount, debtAmount) => {
  const originalTrove = liquityState.trove;
  let edited = new Trove(originalTrove.collateral, originalTrove.debt);

  const { price, borrowingRate } = liquityState;

  edited = edited.setCollateral(depositAmount);
  edited = edited.setDebt(debtAmount);

  const borrowingFee = feeFrom(originalTrove, edited, borrowingRate).toString();
  const collateralRatio = !edited.isEmpty ? edited.collateralRatio(price).toString() : '';
  // const originalCollateralRatio = !originalTrove.isEmpty ? originalTrove.collateralRatio(price) : undefined;
  // const collateralRatioChange = Difference.between(collateralRatio, originalCollateralRatio);

  return {
    stableName,
    liquidationReserve: LUSD_LIQUIDATION_RESERVE,
    price,
    borrowingRate,
    borrowingFee,
    collateralRatio,
    liquidationRatio
  };
};

/**
 * adjust Balance
 *
 * type:
 * deposit 存
 * Withdraw 取
 * Borrow 借
 * Repay 还
 * */

const typeOptions = {
  deposit: 'Deposit',
  withdraw: 'Withdraw',
  borrow: 'Borrow',
  repay: 'Repay',
};

export const fetchAdjustBalanace = async ({library, account, chainID, liquityState, type, coinAmount, unit}) => {
  const liquity = fetchLiquityEntity({library, account, chainID});
  const maxBorrowingRate = getMaxBorrowingRate(liquityState);

  let params = {};
  switch (type) {
    case 'deposit': params = { depositCollateral: coinAmount }; break;
    case 'withdraw': params = { withdrawCollateral: coinAmount }; break;
    case 'borrow': params = { borrowLUSD: coinAmount }; break;
    case 'repay': params = { repayLUSD: coinAmount }; break;
  }

  const transaction = await liquity.send.adjustTrove(params, maxBorrowingRate,{ gasLimit });
  return {
    base: `${typeOptions[type]} ${coinAmount} ${unit}`,
    transaction,
  };
};
