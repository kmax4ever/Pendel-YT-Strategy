export const SETTINGS = {
  BLOCKCHAIN_BE_URL:
    process.env.NODE_ENV !== "production2"
      ? "https://api-bsc.binemon.io"
      : "http://localhost:3000",
  GAME_BE_URL:
    process.env.NODE_ENV !== "production2"
      ? "https://api-bsc.binemon.io"
      : "http://localhost:3000",

  BINEMON_ADDRESS:
    process.env.NODE_ENV !== "production2"
      ? "0x671c49b5a2e6c28C2bCb63f784ebCb8Dcb50b376"
      : "0xa9fB87473373DbFA1366741B61d8bFA4f7eAFB19",
  BINEMON_STORE_ADDRESS:
    process.env.NODE_ENV !== "production2"
      ? "0xCC76b19E9Ff41C910713F0003dEE5E813CD0CB3D"
      : "0xd5B50Ae3408995D96897292d55b3264ad50d3E2a",
  AMBS_STORE_ADDRESS:
    process.env.NODE_ENV !== "production2"
      ? "0x6f665876893841795578d1c6bDA4D313E355Ee33"
      : "0x32A91882b280fD50A659F093BEb74aA48e9d828E",
};

export const COINS_DECIMAL_STR = {
  USDT: "mwei",
  GES: "ether",
  BRI: "mwei",
  ELD: "ether",
};

export const TRANSACTION_STATUS = {
  PENDING: 0,
  APPROVED: 1,
  PROCESSED: 2,
  REJECTED: 3,
};

export const TRANSACTION_TYPE = {
  DEPOSIT: "DEPOSIT",
  WITHDRAW: "WITHDRAW",
  TRANSFER: "TRANSFER",
  RECEIVED: "RECEIVED",
};
