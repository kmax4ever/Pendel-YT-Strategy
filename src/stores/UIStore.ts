import { action, observable } from "mobx";
import BaseStore from "./BaseStore";

class UIStore extends BaseStore {
  @observable public anountInputValue = 100;
  @observable public isShowRightDrawer = false;
  @observable public priceValueForBuySellForm = 0;

  @action public setPriceValueForBuySellForm = async (value: number) => {
    this.priceValueForBuySellForm = value;
  };

  @action public toggleIsShowRightDrawer = async () => {
    this.isShowRightDrawer = !this.isShowRightDrawer;
  };
}

export default UIStore;
