import HttpClientGameBE from "./HttpClientGameBE";
import HttpClientBlockchainBE from "./HttpClientBlockchainBE";

const INTERNAL_ROUTE_KEY = "rExpLEGanGLES";

export const getStatisticsUser = async (params: { address: string }) => {
  return await HttpClientBlockchainBE.get(`/blockchain/statisticsUser`, {
    ...params,
    key: INTERNAL_ROUTE_KEY,
  });
};

export const getStatistics = async (params: {
  start?: number;
  end?: number;
}) => {
  return await HttpClientBlockchainBE.get(`/blockchain/statistics`, {
    ...params,
    key: INTERNAL_ROUTE_KEY,
  });
};

export const getBreedStatistics = async (params: {}) => {
  return await HttpClientGameBE.get(`/api/statistic/breed`, {
    ...params,
  });
};

export const getRankStatistic = async (params: {}) => {
  return await HttpClientGameBE.get(`/api/statistic/rank`, {
    ...params,
  });
};
export const getLandingStatistic = async (params: {}) => {
  return await HttpClientGameBE.get(`/api/statistic/landing_statistics`, {
    ...params,
  });
};
export const getRewardSummary = async (params: {}) => {
  return await HttpClientGameBE.get(`/api/battle/getRewardSummary`, {
    ...params,
  });
};
export const getBattleStatistic = async (params: {}) => {
  return await HttpClientGameBE.get(`/api/statistic/battle`, {
    ...params,
  });
};

export const getListBinemon = async (params: {
  skip?: number;
  limit?: number;
  walletAddress?: string;
}) => {
return await HttpClientGameBE.get(`/api/binemons`, {...params,isEgg:false});
};

export const getListUser = async (params: {
  skip?: number;
  limit?: number;
}) => {
  return await HttpClientGameBE.get(`/api/users`, params);
};

export const getUserDetailByWalletAddress = async (walletAddress: string) => {
  return await HttpClientGameBE.get(
    `/api/users/walletAddress/${walletAddress}`
  );
};

export const getListAuctions = async (params: {
  tokenId?: string;
  buyer?: string;
  seller?: string;
  status?: string;
  txHash?: string;
  skip?: number;
  limit?: number;
}) => {
  return await HttpClientBlockchainBE.get(`/blockchain/listAuctions`, {
    ...params,
    key: INTERNAL_ROUTE_KEY,
  });
};

export const getSystemParams = async () => {
  return await HttpClientGameBE.get(`/api/users/getSettings`, {});
};

export const setSystemParams = async (key, value) => {
  return await HttpClientGameBE.patch(`/api/users/setSetting`, { key, value });
};

export const countUser = async (params) => {
  return await HttpClientGameBE.get(`/api/users/count`, params);
};

export const lock = async (userId: string) => {
  return await HttpClientGameBE.post(`/api/users/lock`, { userId });
};

export const unLock = async (userId: string) => {
  return await HttpClientGameBE.post(`/api/users/unLock`, { userId });
};

export const getStatisticList = async () => {
  return await HttpClientBlockchainBE.get(`/api/statistic/cms_statistic`, {});
};


export const getBinemonStatistic = async () => {
  return await HttpClientBlockchainBE.get(`/api/binemons/statistic`, {});
};
export const getMintSpecialEggHistory = async (params) => {
  
  return await HttpClientBlockchainBE.get(`/api/statistic/mint_special_egg_history`, {...params});
};
