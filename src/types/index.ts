export type SystemSummary = {
  totalDeposit?: SummaryByToken;
  totalWithdrawal?: SummaryByToken;
  sumUserHotWallets?: SummaryByToken;
  countUserHotWallet?: SummaryByToken;
  countOrder?: SummaryByToken;
  totalTradeVolume?: SummaryByToken;
  totalUserRevenue?: SummaryByToken;
  totalCommission?: SummaryByToken;
  totalAgencyCommission?: number;
  totalRankBonus?: SummaryByToken;
};

export type Round = {
  roundId: number;
  pair: string;
  initTime: number;
  open1?: number;
  close1?: number;
  high1?: number;
  low1?: number;
  open2?: number;
  close2?: number;
  high2?: number;
  low2?: number;
  volume1?: number;
  volume2?: number;
  tur?: { [token: string]: number };
  turBp?: { [token: string]: number };
  tbv?: { [token: string]: number };
  tbvBp?: { [token: string]: number };
  tbvUp?: { [token: string]: number };
  totalOrder?: number;
  totalOrderUp?: number;
  status?: number;
  result?: number;
  adminResult?: number;
};

export type StatisticData = {
  summary: SystemSummary;
  activeRound: Round;
  countPlayer: number;
  countAgency: number;
  withdrawalHotWallets: { [key: string]: number };
  coldWallets: { [key: string]: number };
};

export type SummaryByToken = {
  USDT: number;
  GES: number;
  BRI: number;
  ELD: number;
};

export type User = {
  _id: string;
  agencyRefCountF1: number;
  fullname: string;
  phone: string;
  createdAt: string;
  email: string;
  avatar?: string;
  is2FA: boolean;
  isAgency: boolean;
  agencyVolume?: number;
  isLocked: boolean;
  isVerified: boolean;
  otpAuth: string;
  rank: string;
  refCode: string;
  refTree: [];
  serectAuthCode: string;
  totalAgencyCommission: number;
  wallets?: SummaryByToken;
  totalCommission: SummaryByToken;
  totalRevenue: SummaryByToken;
  totalTrade: SummaryByToken;
  totalTradeLoose: SummaryByToken;
  totalTradeVolume: SummaryByToken;
  totalTradeWin: SummaryByToken;
  totalDeposit: SummaryByToken;
  totalReceived: SummaryByToken;
  totalWithdrawal: SummaryByToken;
  updatedAt: string;
  username: string;
  id: string;
  activeAgencyTime: number;
  session: number;
  totalRef?: number;
};

export type Transaction = {
  userId: string;
  tokenSymbol: string;
  amount: number;
  type: string; //DEPOSIT WITHDRAW TRANSFER
  withdrawAddress?: string; //for case WITHDRAW
  depositAddress?: string; //for case DEPOSIT
  txId?: string;
  status?: number;
  toUsername?: string; //for case TRANSFER
  fromUsername?: string; //for case RECEIVED
  note?: string;
  createdAt: number;
  chain?: string;
};

export type Commission = {
  fromUser: string;
  toUser: string;
  tokenSymbol: string;
  amount: number;
  roundId: number;
  orderId: string;
  game: string;
  createdAt: number;
};

export type ChartData = {
  userId: string;
  type:
    | "TRADING_COMMISSION_VOLUME"
    | "TRADING_COMMISSION"
    | "AGENCY_COMMSSION_VOLUME"
    | "AGENCY_COMMISSION";
  data: { [tokenSymbol: string]: { [key: number]: number } };
};
