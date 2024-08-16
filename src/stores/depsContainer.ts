import UIStore from "stores/UIStore";
import PendleStore from "./pendleStore";

class DepsContainer {
  public uiStore: UIStore;
  public pendleStore: PendleStore;

  public constructor() {
    // Stores
    this.uiStore = new UIStore(this);
    this.pendleStore = new PendleStore(this);
  }
}

export default DepsContainer;
