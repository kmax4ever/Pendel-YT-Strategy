import UIStore from "stores/UIStore";
import CmsStore from "./cmsStore";

class DepsContainer {
  public uiStore: UIStore;
  public cmsStore: CmsStore;

  public constructor() {
    // Stores
    this.uiStore = new UIStore(this);
    this.cmsStore = new CmsStore(this);
  }
}

export default DepsContainer;
