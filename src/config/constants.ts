export const ORDER_EVENTS = {
  CREATE: "CreateOrder",
  REMOVE: "RemoveOrder",
  CANCEL: "CancelOrder",
  MATCHING: "Matching",
  UPDATE: "UpdateOrder",
  RECEIVED: "TokenReceived",
};

export const ORDER_TYPES = {
  BUY: true,
  SELL: false,
};

export const ORDER_STATUES = {
  ACTIVE: "ACTIVE",
  FILLED: "FILLED",
  CANCELLED: "CANCELLED",
};

export const DEFAULT_PARAMS = {
  COMMISSION_SETTING: {
    CF1: 0.013,
    CF2: 0.008,
    CF3: 0.005,
    CF4: 0.003,
    CF5: 0.002,
    CF6: 0.001,
    CF7: 0.001,
    CF8: 0.001,
    CF9: 0.001,
    CF10: 0.001,
    CF11: 0.001,
    CF12: 0.001,
    CF13: 0.001,

    RANK_REQUIRED_FOR_LVL_1: 1,
    RANK_REQUIRED_FOR_LVL_2: 2,
    RANK_REQUIRED_FOR_LVL_3: 3,
    RANK_REQUIRED_FOR_LVL_4: 4,
    RANK_REQUIRED_FOR_LVL_5: 4,
    RANK_REQUIRED_FOR_LVL_6: 5,
    RANK_REQUIRED_FOR_LVL_7: 5,
    RANK_REQUIRED_FOR_LVL_8: 5,
    RANK_REQUIRED_FOR_LVL_9: 5,
    RANK_REQUIRED_FOR_LVL_10: 6,
    RANK_REQUIRED_FOR_LVL_11: 6,
    RANK_REQUIRED_FOR_LVL_12: 6,
    RANK_REQUIRED_FOR_LVL_13: 6,

    AGENCY_CF1: 0.5,
    AGENCY_CF2: 0.05,
    AGENCY_CF3: 0.05,
    AGENCY_CF4: 0.05,
    AGENCY_CF5: 0.025,
    AGENCY_CF6: 0.025,
    AGENCY_CF7: 0.025,
    AGENCY_CF8: 0.025,
    AGENCY_CF9: 0.01,
    AGENCY_CF10: 0.01,
    AGENCY_CF11: 0.01,
    AGENCY_CF12: 0.01,
    AGENCY_CF13: 0.01,
  },

  RANK_CONDITION: {
    RANK_CONDITION_WEEKLY_VOLUME_LVL_1: 2000, // USDT
    RANK_CONDITION_WEEKLY_VOLUME_LVL_2: 4000, // USDT
    RANK_CONDITION_WEEKLY_VOLUME_LVL_3: 8000, // USDT
    RANK_CONDITION_WEEKLY_VOLUME_LVL_4: 16000, // USDT
    RANK_CONDITION_WEEKLY_VOLUME_LVL_5: 32000, // USDT
    RANK_CONDITION_WEEKLY_VOLUME_LVL_6: 64000, // USDT
  },

  AGENCY_BUY_PRICE: 100,
  COMFEE: 0.03,
  TXFEE: 0.005,

  FEED_PRICE_SETTING: {
    BP: 3000,
    BR: 0.98,
    BRAKE_MAX: 8,
    BRAKE_REDUCE: 1.55,
    BUFFER_RANGE: 0.0001,
  },

  PAUSE_SETTING: {
    GAME_PAUSE: 0,
    PROCESS_ORDER_PAUSE: 0,
    PROCESS_DEPOSIT_PAUSE: 0,
    PROCESS_SEND_DEPOSIT_PAUSE: 0,
    PROCESS_WITHDRAW_PAUSE: 0,
    PROCESS_RANKING_PAUSE: 0,

    //pause for pairs feed price
    FEED_PRICE_PAUSE_BTCUSDT: 0,
    FEED_PRICE_PAUSE_ETHUSDT: 0,
  },

  //tokens settings
  TOKEN_SETTING: {
    SEND_HOT_WALLET_THRESHOLD_USDT: 100, // >100 USD => send hot walletAddress
    AUTO_APPROVE_WITHDRAW_THRESHOLD_USDT: 100, // < 100USDT => auto approved
    MIN_ORDER_AMOUNT_USDT: 5,
    MAX_ORDER_AMOUNT_USDT: 10000,
    MIN_DEOPSIT_AMOUNT_USDT: 10,
    DEPOSIT_FEE_USDT: 3,
    MIN_WITHDRAW_AMOUNT_USDT: 10,
    MAX_WITHDRAW_AMOUNT_USDT: 10000, //-1 => unlimit
    WITHDRAW_FEE_USDT: 3,
    WITHDRAW_FEE_PERCENT_USDT: 0.002, // 2% withdraw amount

    SEND_HOT_WALLET_THRESHOLD_GES: 3,
    AUTO_APPROVE_WITHDRAW_THRESHOLD_GES: 3,
    MIN_ORDER_AMOUNT_GES: 3,
    MAX_ORDER_AMOUNT_GES: 29000,
    MIN_DEOPSIT_AMOUNT_GES: 0.3,
    DEPOSIT_FEE_GES: 0.08,
    MIN_WITHDRAW_AMOUNT_GES: 0.3,
    MAX_WITHDRAW_AMOUNT_GES: 300, //-1 => unlimit
    WITHDRAW_FEE_GES: 0.08,
    WITHDRAW_FEE_PERCENT_GES: 0.002, // 2% withdraw amount

    SEND_HOT_WALLET_THRESHOLD_BRI: 3,
    AUTO_APPROVE_WITHDRAW_THRESHOLD_BRI: 3,
    MIN_ORDER_AMOUNT_BRI: 3,
    MAX_ORDER_AMOUNT_BRI: 29000,
    MIN_DEOPSIT_AMOUNT_BRI: 0.3,
    DEPOSIT_FEE_BRI: 0.08,
    MIN_WITHDRAW_AMOUNT_BRI: 0.3,
    MAX_WITHDRAW_AMOUNT_BRI: 300, //-1 => unlimit
    WITHDRAW_FEE_BRI: 0.08,
    WITHDRAW_FEE_PERCENT_BRI: 0.002, // 2% withdraw amount

    SEND_HOT_WALLET_THRESHOLD_ELD: 3,
    AUTO_APPROVE_WITHDRAW_THRESHOLD_ELD: 3,
    MIN_ORDER_AMOUNT_ELD: 3,
    MAX_ORDER_AMOUNT_ELD: 29000,
    MIN_DEOPSIT_AMOUNT_ELD: 0.3,
    DEPOSIT_FEE_ELD: 0.08,
    MIN_WITHDRAW_AMOUNT_ELD: 0.3,
    MAX_WITHDRAW_AMOUNT_ELD: 300, //-1 => unlimit
    WITHDRAW_FEE_ELD: 0.08,
    WITHDRAW_FEE_PERCENT_ELD: 0.002, // 2% withdraw amount
  },

  //RANKING BONUS PERCENT
  RANK_BONUS_PERCENT: 0.1, // 0.1%
};

export const TRANSACTION_STATUS = {
  PENDING: 0,
  APPROVED: 1,
  PROCESSED: 2,
  REJECTED: 3,
};

export const BREED = {
  1: {
    label: "Dog",
    src: "breed-dog.png",
  },
  2: {
    label: "Cat",
    src: "breed-cat.png",
  },
  3: {
    label: "Titan",
    src: "breed-titan.png",
  },
  4: {
    label: "Unicorn",
    src: "breed-unicorn.png",
  },
  0: {
    label: "Fused",
    src: "fused.png",
  },
};

export const STAGE = {
  1: { id: 1, label: "Baby" },
  2: { id: 2, label: "Teenager" },
  3: { id: 3, label: "Adult" },
};

export const RANK = {
  1: { id: 1, label: "E", color: "text-white" },
  2: { id: 2, label: "D", color: "text-green-2" },
  3: { id: 3, label: "C", color: "text-green-3" },
  4: { id: 4, label: "B", color: "text-blue-5" },
  5: { id: 5, label: "A", color: "text-orange-3" },
  6: { id: 6, label: "S", color: "text-pink-1" },
  7: { id: 7, label: "SR", color: "text-red-1" },
};

export const MONCLASS = {
  0: { id: 0, label: "NONE" },
  1: { id: 1, label: "FIGHTER" },
  2: { id: 2, label: "TANKER" },
  3: { id: 3, label: "HEALER" },
  4: { id: 4, label: "MAGE" },
};
