import HttpPendelClient from "./PendelClient";

export const getAllAssetByNetwork = async (network: string) => {
  return await HttpPendelClient.get(`/v1/${network}/assets/all`);
};

export const getApy = async (
  network: string,
  marketAddress: string,
  time_frame = "hour",
  timestamp_start = 0,
  end_time_str = 0
) => {
  return await HttpPendelClient.get(
    `/v1/${network}/markets/${marketAddress}/apy-history-1ma`,
    { time_frame, timestamp_start, end_time_str }
  );
};

export const getYtOHLCV = async (
  network: string,
  ytAddress: string,
  time_frame = "hour",
  timestamp_start = 0,
  end_time_str = 0
) => {
  return await HttpPendelClient.get(
    `/v3/${network}/prices/${ytAddress}/ohlcv`,
    { time_frame, timestamp_start, end_time_str }
  );
};
