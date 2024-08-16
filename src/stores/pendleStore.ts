import {
  getSystemParams,
  getStatisticList,
  getBinemonStatistic,
} from "api/cms";
import { action, observable } from "mobx";
import BaseStore from "./BaseStore";
import { getAllAssetByNetwork, getApy, getYtOHLCV } from "api/pendel";

class PendleStore extends BaseStore {
  //@ts-ignore
  // @observable public statisticData: StatisticData | null = {};
  // @observable public systemParams = {};
  @observable public pendleAssets = [];
  @observable public apy = [];
  @observable public ytOHLCV = [];
  @observable public volume = [];
  @observable public sumVolume = 0;

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
    timestamp_start = "0",
    end_time_str = "0"
  ) => {
    const rs = await getApy(
      network,
      marketAddress,
      time_frame,
      timestamp_start,
      end_time_str
    );
    console.log(" xxx apy rs", rs.data);

    if (rs?.data?.results) {
      const arr1 = rs?.data?.results.split("\n");
      const keys = arr1[0].split(",");
      const results = [] as any;
      console.log(keys, { keys });

      for (let i = 1; i < arr1.length; i++) {
        const values = arr1[i].split(",");
        const obj = {};
        obj[keys[0]] = new Date(+values[0] * 1000);
        obj[keys[1]] = +values[1];
        obj[keys[2]] = +values[2];
        results.push(obj);
      }
      this.apy = results;
      console.log("xxx this apy", this.apy);
    }
  };

  @action public getOHLCV = async (
    network: string,
    marketAddress: string,
    time_frame = "hour",
    timestamp_start,
    end_time_str
  ) => {
    const rs = await getYtOHLCV(
      network,
      marketAddress,
      time_frame,
      timestamp_start,
      end_time_str
    );
    console.log("xxx", rs.data);

    if (rs?.data?.results) {
      this.ytOHLCV = rs.data.results;
      this.ytOHLCV.slice(this.ytOHLCV.length - 1, 1);
      this.volume = this.ytOHLCV.map((i: any) => +i.volume) as any;
      this.sumVolume = this.volume.reduce((a, b) => a + b, 0);
      console.log("xxx sum volume", this.sumVolume);
    }
    // console.log("xxxxx getOHGLVC", this.ytOHLCV);
    // console.log("xxx volume", this.volume);
  };
}

export default PendleStore;
