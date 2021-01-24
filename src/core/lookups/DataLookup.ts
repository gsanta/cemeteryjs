import { ObjObservable } from "../models/ObjObservable";
import { Registry } from "../Registry";
import { ObjSelectionStore } from "../stores/ObjSelectionStore";
import { ObjStore } from "../stores/ObjStore";
import { DataHelperLookup } from "./DataHelperLookup";
import { ShapeLookup } from "./ShapeLookup";

export class DataLookup {
    helper: DataHelperLookup;
    shape: ShapeLookup;
    obj: ObjLookup;
    scene: {
        selection: ObjSelectionStore;
        observable: ObjObservable;
    }
    
    private _registry: Registry;

    constructor(registry: Registry) {
        this.helper = new DataHelperLookup(registry);
        this.shape = new ShapeLookup(registry);
        this.obj = new ObjLookup(registry);

        this.scene = {
            selection: new ObjSelectionStore(),
            observable: new ObjObservable()
        }

        this._registry = registry;
    }

    clearData() {
        this.shape.scene.clear();
        this.shape.node.clear();
        this.obj.feature.clear();

        this._registry.stores.objStore.clear();
        this._registry.stores.assetStore.clear();
    }
}

export class ObjLookup {

    feature: ObjStore;
    
    constructor(registry: Registry) {
        this.feature = new ObjStore();
    }
}