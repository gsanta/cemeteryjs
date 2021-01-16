import { AfterAllObjsDeserialized, IObj, ObjJson } from "../../../../core/models/objs/IObj";
import { LightObjType } from "../../../../core/models/objs/LightObj";
import { NodeObj, NodeObjJson, NodeObjType } from "../../../../core/models/objs/node_obj/NodeObj";
import { SpriteSheetObjType } from "../../../../core/models/objs/SpriteSheetObj";
import { View, ViewJson } from "../../../../core/models/views/View";
import { Registry } from "../../../../core/Registry";
import { AbstractModuleImporter } from "../../../../core/services/import/AbstractModuleImporter";
import { NodeViewType } from "../models/views/NodeView";

interface ImportData {
    views?: ViewJson[];
    objs?: ObjJson[];
}

export class NodeEditorImporter extends AbstractModuleImporter {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    import(data: ImportData): void {
        this.importObjs(data.objs || []);
        this.importViews(data.views || []);
    }

    private importViews(viewJsons: ViewJson[]) {
        const store = this.registry.data.view.node;

        viewJsons.forEach(viewJson => {
            let viewInstance: View;
        
            if (viewJson.type === NodeViewType) {
                const nodeObj = (<NodeObj> this.registry.stores.objStore.getById(viewJson.objId));
                viewInstance = this.registry.data.helper.node.createView(nodeObj.type, nodeObj)
                viewInstance.fromJson(viewJson, this.registry);
            } else {
                viewInstance = store.getViewFactory(viewJson.type).instantiate();
                viewInstance.fromJson(viewJson, this.registry);
            }
            store.addView(viewInstance);
        });

    }

    private importObjs(objJsons: ObjJson[]) {
        const objStore = this.registry.stores.objStore;
        const afterAllObjsDeserializedFuncs: AfterAllObjsDeserialized[] = [];

        // TODO: find a better way to ensure SpriteSheetObjType loads before SpriteObjType
        objJsons.sort((a, b) => a.objType === SpriteSheetObjType ? -1 : b.objType === SpriteSheetObjType ? 1 : 0);
        objJsons.forEach(obj => {
            let objInstance: IObj;
            let afterAllObjsDeserialized: AfterAllObjsDeserialized;
            if (obj.objType === NodeObjType) {
                objInstance = this.registry.data.helper.node.createObj((<NodeObjJson> obj).type);
                const nodeObj = <NodeObj> objInstance;
                objInstance.deserialize(obj, this.registry);
                nodeObj.listener && nodeObj.listener.onInit && nodeObj.listener.onInit();
            } else if (obj.objType === LightObjType) {
                [objInstance, afterAllObjsDeserialized] = this.registry.services.objService.getObjFactory(LightObjType).insantiateFromJson(obj); 
                afterAllObjsDeserializedFuncs.push(afterAllObjsDeserialized);
            } else {
                objInstance = this.registry.services.objService.createObj(obj.objType);
                objInstance.deserialize(obj, this.registry);
            }

            objStore.addObj(objInstance);
        });

        afterAllObjsDeserializedFuncs.forEach(func => func());
    }
}