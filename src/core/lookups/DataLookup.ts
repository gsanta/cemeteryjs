import { Registry } from "../Registry";
import { DataHelperLookup } from "./DataHelperLookup";
import { ViewLookup } from "./ViewLookup";


export class DataLookup {

    helper: DataHelperLookup;
    view: ViewLookup;
    
    private _registry: Registry;

    constructor(registry: Registry) {
        this.helper = new DataHelperLookup(registry);
        this.view = new ViewLookup(registry);
        this._registry = registry;
    }

    clearData() {
        this.view.scene.clear();
        this.view.node.clear();

        this._registry.stores.objStore.clear();
        this._registry.stores.assetStore.clear();
    }
}