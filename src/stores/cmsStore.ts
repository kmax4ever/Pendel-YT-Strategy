import {
  getSystemParams,
  getStatisticList,
  getBinemonStatistic,
} from "api/cms";
import { action, observable } from "mobx";
import BaseStore from "./BaseStore";
import { getAllAssetByNetwork, getApy, getYtOHLCV } from "api/pendel";

class CmsStore extends BaseStore {
  //@ts-ignore
  @observable public statisticData: StatisticData | null = {};

  @observable public systemParams = {};
  @observable public pendleAssets = [];
  @observable public apy = {};
  @observable public ytOHLCV = {};

  @action public getAssets = async (network: number) => {
    const rs = await getAllAssetByNetwork(network.toString());
    if (rs.data) {
      this.pendleAssets = rs.data;
    }
  };

  @action public getApy = async (
    network: string,
    marketAddress: string,
    time_frame = "hour",
    timestamp_start = 0,
    end_time_str = 0
  ) => {
    const rs = await getApy(
      network,
      marketAddress,
      time_frame,
      timestamp_start,
      end_time_str
    );
    if (rs.data) {
      this.apy = rs.data;
    }
  };

  @action public getOHLCV = async (
    network: string,
    marketAddress: string,
    time_frame = "hour",
    timestamp_start = 0,
    end_time_str = 0
  ) => {
    const rs = await getYtOHLCV(
      network,
      marketAddress,
      time_frame,
      timestamp_start,
      end_time_str
    );
    if (rs.data) {
      this.ytOHLCV = rs.data;
    }
  };
}

export default CmsStore;
