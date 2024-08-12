import DepsContainer from "stores/depsContainer";

class BaseStore {
  public depsContainer: DepsContainer;
  public constructor(depsContainer: DepsContainer) {
    this.depsContainer = depsContainer;
  }
}

export default BaseStore;
