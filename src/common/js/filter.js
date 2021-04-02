import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import numeral from "numeral";
dayjs.extend(utc);
const BigNumber = require("bignumber.js");
BigNumber.config({ DECIMAL_PLACES: 6, ROUNDING_MODE: BigNumber.ROUND_DOWN });

// const formatLAMBValue = (value) => {
//   if (!value) {
//     return 0;
//   }
//   const val = parseFloat(value);
//   const bigValue = new BigNumber(val);
//   const returnVal = bigValue.div("1e6").toNumber();
//   if (returnVal < 0.000001) {
//     return "<0.000001";
//   }
//   return returnVal;
// };

const format1e18Value = (value) => {
  if (!value) {
    return 0;
  }
  const val = String(value);
  const bigValue = new BigNumber(val);
  const returnVal = bigValue.div("1e18").toNumber();
  if (returnVal < 0.000001) {
    return "<0.000001";
  }
  return returnVal;
};

const format1e18ValueList = (value) => {
  if (!value) {
    return 0;
  }
  const val = String(value);
  const bigValue = new BigNumber(val);
  const returnVal = bigValue.div("1e18").toFixed(2);
  if (returnVal < 0.000001) {
    return "<0.000001";
  }
  return returnVal;
};

const formatNormalValue = (value, decimal = 6) => {
  if (!value) {
    return 0;
  }
  const val = String(value);
  const bigValue = new BigNumber(val);
  const returnVal = bigValue.div(1).decimalPlaces(decimal).toNumber();
  return returnVal;
};

const formatDate = (value) => {
  if (value == "" || value == undefined) {
    return "";
  }
  if (value == "0001-01-01T00:00:00Z") {
    return "--";
  }

  return dayjs
    .utc(value)
    .local()
    .format("YYYY-MM-DD HH:mm:ss");
};


const formatToken = (value) => {
  if (!value) {
    return "";
  }
  let val;

  if (value.indexOf("u") >= 0) {
    val = value.slice(1);
  } else {
    val = value;
  }
  val = val.toUpperCase();
  return val;
};

const formatRate = (value) => {
  if (!value) {
    return "0%";
  }
  if (value >= 0.00001 || value == 0) {
    return numeral(value).format("0.[00]%");
  } else {
    return "<0.001%";
  }
};

const formatReward = (value, days, scashPrice, totalSupply,LPvalue) => {
  // console.log(value, days, scashPrice, totalSupply,LPvalue);
  if (!value) {
    return "0";
  }
  const rate = new BigNumber(value);
  const time = new BigNumber(3600 * 24 * days);
  let total = new BigNumber(totalSupply);

  if (total.isZero()) {
    total = new BigNumber('1');
  }
  const scash = new BigNumber(scashPrice);
  // console.log(value, days, scashPrice, totalSupply,LPvalue,total.toNumber());
  const reward = time.times(rate).div(LPvalue).times(scash).times('100').decimalPlaces(2).toNumber();
  return reward;
};

const formatBalance = (value) => {
  if (!value || isNaN(value)) {
    return "--";
  }
  const bigValue = new BigNumber(value);
  return bigValue.toFixed(2);
};

const formatBalanceNumber = (value) => {
  if (!value || isNaN(value)) {
    return "--";
  }
  const bigValue = new BigNumber(value);
  return bigValue.toFixed(6);
};

const two_digits = (value) => {
  if (value < 0) {
    return '00';
  }
  if (value.toString().length <= 1) {
    return `0${value}`;
  }
  return value;
};

export default {
  formatBalance,
  // formatLAMBValue,
  format1e18Value,
  formatDate,
  formatToken,
  formatNormalValue,
  formatRate,
  formatReward,
  formatBalanceNumber,
  format1e18ValueList,
  two_digits
};
