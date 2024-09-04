import utils from "web3-utils";
import Web3 from "web3";
import moment from "moment";
import * as WAValidator from "wallet-address-validator";
import Numeral from "numeral";
import lodashGet from "lodash/get";

const BigNumber = require("bignumber.js");

export const cutString = (s: string) => {
  if (s.length < 20) return s;
  var first5 = s.substring(0, 5).toLowerCase();
  var last3 = s.slice(-3);
  return first5 + "..." + last3;
};

export const fromWei = (value: any, decimal: any) => {
  const s = utils.fromWei(value, "ether");
  const rs = new BigNumber(s).toFixed(decimal);
  return rs;
};

function removeSpecialChars(str: string) {
  return str.replace(/[^a-zA-Z ]/g, "");
}

export const getMetadataName = (metadata: any) => {
  const str =
    utils.toAscii(metadata.firstName) +
    " " +
    Web3.utils.toAscii(metadata.lastName);
  return cutString(removeSpecialChars(str));
};

export const updateMetadata = async (
  methods: any,
  wallet: any,
  firstname: any,
  lastname: any
) => {
  const firstnameBytes32 = utils.fromAscii(firstname);
  const lastnameBytes32 = utils.fromAscii(lastname);
  const empty = "empty";
  const emptyBytes32 = utils.fromAscii(empty);
  return await methods
    .updateMetadata(
      firstnameBytes32,
      lastnameBytes32,
      emptyBytes32,
      empty,
      emptyBytes32,
      emptyBytes32,
      0,
      0,
      0,
      0,
      emptyBytes32,
      true
    )
    .send({ from: wallet });
};

export const publicKeyToAddress = (publicKey: any) => {
  try {
    const hash = utils.sha3("0x" + publicKey.slice(4)) || "";
    const address = "0x" + hash.slice(26);
    return address;
  } catch (e) {
    return false;
  }
};

export const objectArray = (object: any) => {
  return Object.keys(object).map(function (key) {
    return object[key];
  });
};

export const hourOnlyFormat = (timestamp: number) => {
  const formatted = moment(timestamp).format("HH:mm:ss");
  return formatted;
};

export const datetimeFormat = (timestamp: number) => {
  //const formatted = moment(timestamp).format("HH:mm:ss DD-MM-YYYY");
  const formatted = moment(timestamp).format("DD-MM-YYYY");
  return formatted;
};

export const isBtcAddress = (address: string) => {
  const valid = WAValidator.validate(address, "BTC", "prod");
  return valid;
};

export const clipAddressText = (address: string) => {
  if (!address) {
    return "";
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const waitPromise = (duration: number) => {
  return new Promise((resolve) => {
    return setTimeout(() => {
      resolve(0);
    }, duration);
  });
};

var priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export const formattedNum = (number, usd = false, acceptNegatives = false) => {
  if (isNaN(number) || number === "" || number === undefined) {
    return usd ? "$0" : 0;
  }
  let num = parseFloat(number);

  if (num > 500000000) {
    return (usd ? "$" : "") + toK(num.toFixed(0), true);
  }

  if (num === 0) {
    if (usd) {
      return "$0";
    }
    return 0;
  }

  if (num < 0.0001 && num > 0) {
    return usd ? "< $0.0001" : "< 0.0001";
  }

  if (num > 1000) {
    return usd
      ? "$" + Number(parseFloat(num).toFixed(0)).toLocaleString()
      : "" + Number(parseFloat(num).toFixed(0)).toLocaleString();
  }

  if (usd) {
    if (num < 0.1) {
      return "$" + Number(parseFloat(num).toFixed(4));
    } else {
      let usdString = priceFormatter.format(num);
      return "$" + usdString.slice(1, usdString.length);
    }
  }

  return Number(parseFloat(num).toFixed(5));
};

export const toK = (num) => {
  return Numeral(num).format("0.[00]a");
};

export const formatTokenNumber = (num: number, fraction?: number) => {
  const _fraction = fraction !== undefined ? fraction : 2;
  return (num || 0).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: _fraction,
  });
};

export const formatFiatNumber = (num: number, fraction?: number) => {
  const _fraction = fraction ? fraction : 0;
  return (num || 0).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: _fraction,
  });
};

export const convertFormatedNumberToNum = (formatedNum: string) => {
  return formatedNum ? +formatedNum.replaceAll(",", "") || 0 : 0;
};

export const getErrorMessageFromServer = (err) => {
  return lodashGet(
    err,
    "data.message",
    "Something wrong, please try again later!"
  );
};

export const getSeconds = (date: any) => {
  return new Date(date).getTime() / 1000 || 0;
};
