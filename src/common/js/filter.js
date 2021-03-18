import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import numeral from "numeral";
dayjs.extend(utc);
const BigNumber = require("bignumber.js");
BigNumber.config({ DECIMAL_PLACES: 6, ROUNDING_MODE: BigNumber.ROUND_DOWN });

const formatLAMBValue = (value) => {
  if (!value) {
    return 0;
  }
  const val = parseFloat(value);
  const bigValue = new BigNumber(val);
  const returnVal = bigValue.div("1e6").toNumber();
  if (returnVal < 0.000001) {
    return "<0.000001";
  }
  return returnVal;
};

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

const formatNormalValue = (value) => {
  if (!value) {
    return 0;
  }
  const val = String(value);
  const bigValue = new BigNumber(val);
  const returnVal = bigValue.div(1).decimalPlaces(6).toNumber();
  if (returnVal < 0.000001) {
    return "<0.000001";
  }
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

const formatAmount = (value) => {
  if (value == "" || value == null) {
    return 0;
  }
  let letters;
  let val;

  if (value.indexOf(",") >= 0) {
    let letters1;
    let val1;
    const newValueList = [];
    const valueList = value.split(",");
    valueList.forEach((item) => {
      const originValue = item.match(/[0-9\.]+/g);
      const num = originValue[0].toString().length;

      // let originLetters = item.split(originValue)[1];
      const originLetters = item.slice(num);

      letters1 = originLetters.substr(1);
      const newval = new BigNumber(originValue[0]);
      val1 = newval.div("1e6").toNumber();

      letters1 = letters1.toUpperCase();
      const amount = `${val1} ${letters1}`;
      newValueList.push(amount);
    });
    return newValueList.join(",");
  } else {
    // console.log(value);
    const originValue = value.match(/[0-9\.]+/g);
    const num = originValue[0].toString().length;
    const originLetters = value.slice(num);
    letters = originLetters.slice(1);
    const newval = new BigNumber(originValue[0]);
    val = newval.div("1e6");
    letters = letters.toUpperCase();
    return `${val} ${letters}`;
  }
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

const formatReward = (value,days) => {
  if (!value) {
    return "0";
  }

  return numeral(value * (60 * 60 * 24 * days)).format("0,0");
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

export default {
  formatBalance,
  formatLAMBValue,
  format1e18Value,
  formatDate,
  formatToken,
  formatAmount,
  formatNormalValue,
  formatRate,
  formatReward,
  formatBalanceNumber,
  format1e18ValueList
};
