import { AssetObj, AssetObjType } from "../../../../core/models/objs/AssetObj";
import { AfterAllObjsDeserialized, IObj, ObjJson } from "../../../../core/models/objs/IObj";
import { LightObjType } from "../../../../core/models/objs/LightObj";
import { NodeObjType, NodeObjJson } from "../../../../core/models/objs/node_obj/NodeObj";
import { PhysicsImpostorObjType } from "../../../../core/models/objs/PhysicsImpostorObj";
import { SpriteSheetObjType } from "../../../../core/models/objs/SpriteSheetObj";
import { AfterAllViewsDeserialized, AbstractShape, ShapeJson } from "../../../../core/models/shapes/AbstractShape";
import { Registry } from "../../../../core/Registry";
import { AbstractModuleImporter } from "../../../../core/services/import/AbstractModuleImporter";
import { LightShapeType } from "../models/shapes/LightShape";
import { MeshShapeType } from "../models/shapes/MeshShape";

interface ImportData {
    views?: ShapeJson[];
    objs?: ObjJson[];
    assets?: ObjJson[];
}

export class SceneEditorImporter extends AbstractModuleImporter {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    import(data: ImportData): void {
        this.importAssetObjs(data.assets || []);
        this.importObjs(data.objs || []);
        this.importViews(data.views || []);
    }

    private importViews(viewJsons: ShapeJson[]) {
        const store = this.registry.data.shape.scene;

        const afterAllViewsDeserializedFuncs: AfterAllViewsDeserialized[] = [];

        viewJsons.forEach(viewJson => {
            let viewInstance: AbstractShape;
            let afterAllViewsDeserialized: AfterAllViewsDeserialized;
        
            if (viewJson.type === MeshShapeType || viewJson.type === LightShapeType) {
                [viewInstance, afterAllViewsDeserialized] = store.getViewFactory(viewJson.type).instantiateFromJson(viewJson);
                afterAllViewsDeserializedFuncs.push(afterAllViewsDeserialized);
            } else {
                viewInstance = store.getViewFactory(viewJson.type).instantiate();
                viewInstance.fromJson(viewJson, this.registry);
            }
            store.addShape(viewInstance);
        });

        afterAllViewsDeserializedFuncs.forEach(func => func());
    }

    private importObjs(objJsons: ObjJson[]) {
        const objStore = this.registry.stores.objStore;
        const afterAllObjsDeserializedFuncs: AfterAllObjsDeserialized[] = [];

        // TODO: find a better way to ensure SpriteSheetObjType loads before SpriteObjType
        objJsons.sort((a, b) => a.objType === SpriteSheetObjType ? -1 : b.objType === SpriteSheetObjType ? 1 : 0);
        // TODO: find a better way to ensure PhysicsImpostorObj loads before MeshObj
        objJsons.sort((a, b) => a.objType === PhysicsImpostorObjType ? -1 : b.objType === PhysicsImpostorObjType ? 1 : 0);
        objJsons.forEach(obj => {
            let objInstance: IObj;
            let afterAllObjsDeserialized: AfterAllObjsDeserialized;
            if (obj.objType === NodeObjType) {
                objInstance = this.registry.data.helper.node.createObj((<NodeObjJson> obj).type);
                objInstance.deserialize(obj, this.registry);
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

    private importAssetObjs(objJsons: ObjJson[]) {
        const assetStore = this.registry.stores.assetStore;

        objJsons.forEach(objJson => {
            const objInstance = this.registry.services.objService.createObj(objJson.objType);
            objInstance.deserialize(objJson, this.registry);
            assetStore.addObj(objInstance as AssetObj);
        });
    }
}