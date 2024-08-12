/* eslint-disable indent */

export const BUY_TRANSACTION = {
  ERROR: "Error!",
  SUCCESSED: "Buy Order placed successfully!",
};

export const SELL_TRANSACTION = {
  ERROR: "Error!",
  SUCCESSED: "Sell Order placed successfully!",
};

export const CANCEL_TRANSACTION = {
  ERROR: "Error!",
  SUCCESSED: "Order cancelled successfully!",
};

export const WITHDRAW_MESSAGE = (coinSymbol: string) => {
  return {
    ERROR: "Error!",
    SUCCESSED: `${coinSymbol} withdrawn successfully!`,
  };
};

export const BUY_ERROR = {
  INVALID_PRICE: `Price must be over zero.`,
  INVALID_AMOUNT: `Amount must be over zero.`,
};

export const SELL_ERROR = {
  INVALID_PRICE: `Price must be over zero.`,
  INVALID_AMOUNT: `Amount must be over zero.`,
};

export const WITHDRAW_ERROR = {
  INVALID_AMOUNT: "Insufficient amount",
  INVALID_ADDRESS: "Invalid address",
  INVALID_HOT_BALANCE: "Please try again later.",
  ADDRESS_CAN_NOT_MATCH: "Please enter a different address for withdrawal!",
};
