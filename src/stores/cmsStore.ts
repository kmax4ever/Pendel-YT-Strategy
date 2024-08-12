import {
  getSystemParams,
  getStatisticList,
  getBinemonStatistic,
} from "api/cms";
import { action, observable } from "mobx";
import BaseStore from "./BaseStore";

class CmsStore extends BaseStore {
  //@ts-ignore
  @observable public statisticData: StatisticData | null = {};

  @observable public systemParams = {};
  @observable public ambStatistics = {};
  @observable public ambRevenue = {};
  @observable public mintMonStatistic = {} as any;
  @observable public ambRecent = {};
  @action public getSystemParams = async () => {
    let response = await getSystemParams();
    const data = response.data.response;
    delete data["_id"];
    delete data["createdAt"];
    delete data["updatedAt"];
    delete data["SETTING_ID"];

    this.systemParams = {
      ...data,
    };
  };

  @action public getAmbStatistic = async () => {
    const rs = await getStatisticList();

    if (rs?.data) {
      for (const i of rs.data) {
        delete i["_id"];
        delete i["createdAt"];
        delete i["__v"];
        if (i.key === "TOTAL_AMB_REVENUE") {
          this.ambRevenue = i.data;
        } else {
          if (i.key !== "BATTLE_TICKET") {
            this.ambStatistics[i.key] = i;
          }
        }
      }
    }
  };

  @action public getBinemonStatistic = async () => {
    const rs = await getBinemonStatistic();
    if (rs.data) {
      this.mintMonStatistic = rs.data.response
    }
  };
}

export default CmsStore;
