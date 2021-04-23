import {
  Percent,
  Trove,
  // LUSD_MINIMUM_DEBT, //系统最小债务
  MINIMUM_COLLATERAL_RATIO,
  CRITICAL_COLLATERAL_RATIO,
} from "@liquity/lib-base";

const LUSD_MINIMUM_DEBT = 200;

import { stableName } from './liquity';

const mcrPercent = new Percent(MINIMUM_COLLATERAL_RATIO).toString(0);
const ccrPercent = new Percent(CRITICAL_COLLATERAL_RATIO).toString(0);

const validateTroveCreation = ({ depositCollateral }, {
  resultingTrove,
  recoveryMode,
  wouldTriggerRecoveryMode
}, state) => {
  const { accountBalance, price } = state;
  if (resultingTrove.debt.lt(LUSD_MINIMUM_DEBT)) {
    return `Debt must be at least ${LUSD_MINIMUM_DEBT.toString()} ${stableName}`;
  }
  if (recoveryMode){
    if (!resultingTrove.isOpenableInRecoveryMode(price)) {
      return `You're not allowed to open a Trove with less than ${ccrPercent} Collateral
                Ratio during recovery mode. Please increase your Trove's Collateral Ratio.`;


    }
  }else{
    if (resultingTrove.collateralRatioIsBelowMinimum(price)) {
      return `Collateral ratio must be at least ${mcrPercent}.`;
    }
    if (wouldTriggerRecoveryMode) {
      return `You're not allowed to open a Trove that would cause the Total Collateral Ratio to fall
                      below ${ccrPercent}. Please increase your Trove's Collateral Ratio.`;
    }
  }
  if (depositCollateral.gt(accountBalance)) {
    return `The amount you're trying to deposit exceeds your balance by
                    ${depositCollateral.sub(accountBalance).prettify()} BNB.`;
  }
  return null;
};

const validateTroveClosure = ({ repayLUSD },{recoveryMode,wouldTriggerRecoveryMode}, state) => {
  const { numberOfTroves, lusdBalance } = state;
  if (numberOfTroves === 1) {
    return `You're not allowed to close your Trove when there are no other Troves in the system.`;
  }
  if (recoveryMode) {
    return `You're not allowed to close your Trove during recovery mode.`;
  }
  if (repayLUSD?.gt(lusdBalance)) {
    return`You need ${repayLUSD.sub(lusdBalance).prettify()} ${stableName} more to close your Trove` ;
  }
  if (wouldTriggerRecoveryMode) {
    return `You're not allowed to close a Trove if it would cause the Total Collateralization Ratio to
        fall below ${ccrPercent}. Please wait until the Total Collateral Ratio
        increases.`;
  }
  return null;
};
const validateTroveAdjustment = ({ depositCollateral, withdrawCollateral, borrowLUSD, repayLUSD }, {originalTrove,
    resultingTrove,
    recoveryMode,
    wouldTriggerRecoveryMode}, state) => {
  const {price, accountBalance, lusdBalance} = state;
  if (recoveryMode) {
    if (withdrawCollateral) {
      return `You're not allowed to withdraw collateral during recovery mode.`;
    }
    if (borrowLUSD){
      if (resultingTrove.collateralRatioIsBelowCritical(price)) {
        return `Your collateral ratio must be at least ${ccrPercent} to borrow during
                    recovery mode. Please improve your collateral ratio.`;
      }
      if (resultingTrove.collateralRatio(price).lt(originalTrove.collateralRatio(price))) {
        return `You're not allowed to decrease your collateral ratio during recovery mode.`;
      }
    }
  }else{
    if (resultingTrove.collateralRatioIsBelowMinimum(price)) {
      return  `Collateral ratio must be at least ${mcrPercent}.`;
    }
    if (wouldTriggerRecoveryMode) {
      return `The adjustment you're trying to make would cause the Total Collateral Ratio to
            fall below ${ccrPercent} . Please increase your Trove's Collateral Ratio.
            `;
    }
  }
  if (repayLUSD) {
    if (resultingTrove.debt.lt(LUSD_MINIMUM_DEBT)) {
      return ` Debt must be at least ${LUSD_MINIMUM_DEBT.toString()} ${stableName}` ;
    }
    if (repayLUSD.gt(lusdBalance)) {
      return `The amount you're trying to repay exceeds your balance by ${repayLUSD.sub(lusdBalance).prettify()}`;
    }
  }
  if (depositCollateral&&depositCollateral.gt(accountBalance)) {
    return `The amount you're trying to deposit exceeds your balance by
                ${depositCollateral.sub(accountBalance).prettify()} BNB`;
  }
  return null;
};

export const liquityValidate = ({trove, borrowingRate, state, depositAmount, borrowAmount}) => {
  const originalTrove = trove;
  let edited = new Trove(originalTrove.collateral, originalTrove.debt);
  edited = edited.setCollateral(depositAmount);
  edited = edited.setDebt(borrowAmount);

  //edited.setDebt(LUSD_MINIMUM_DEBT)
  // const original = originalTrove;
  // const borrowingRate = this.$data.borrowingRate ;
  const { total, price } = state;
  const change = originalTrove.whatChanged(edited, borrowingRate);
  console.log(change);
  if (!change) {
    //没有变化
    return '';
  }
  const resultingTrove = originalTrove.apply(change, borrowingRate);
  const recoveryMode = total.collateralRatioIsBelowCritical(price);
  const wouldTriggerRecoveryMode = total
    .subtract(originalTrove)
    .add(resultingTrove)
    .collateralRatioIsBelowCritical(price);
  const sysNextInfocontext = {
    resultingTrove,
    recoveryMode,
    wouldTriggerRecoveryMode
  };
  console.log(sysNextInfocontext);
  if (change.type === "invalidCreation") {
    // Trying to create a Trove with negative net debt
    return `Debt must be at least ${LUSD_MINIMUM_DEBT.toString()}`;
  }

  const errorDescription =
    change.type === "creation"
      ? validateTroveCreation(change.params, sysNextInfocontext, state)
      : change.type === "closure"
      ? validateTroveClosure(change.params, sysNextInfocontext, state)
      : validateTroveAdjustment(change.params, sysNextInfocontext, state);
  console.log('errorDescription',errorDescription);

  return errorDescription || '';
};

