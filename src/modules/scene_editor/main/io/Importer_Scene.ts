import { Canvas2dPanel } from "../../../../core/models/modules/Canvas2dPanel";
import { Canvas3dPanel } from "../../../../core/models/modules/Canvas3dPanel";
import { AssetObj, AssetObjJson, AssetObjType } from "../../../../core/models/objs/AssetObj";
import { AfterAllObjsDeserialized, IObj, ObjJson } from "../../../../core/models/objs/IObj";
import { LightObj, LightObjType } from "../../../../core/models/objs/LightObj";
import { MeshObj, MeshObjType } from "../../../../core/models/objs/MeshObj";
import { NodeConnectionObj, NodeConnectionObjType } from "../../../../core/models/objs/NodeConnectionObj";
import { NodeObjJson, NodeObjType } from "../../../../core/models/objs/node_obj/NodeObj";
import { PathObj, PathObjType } from "../../../../core/models/objs/PathObj";
import { PhysicsImpostorObj, PhysicsImpostorObjType } from "../../../../core/models/objs/PhysicsImpostorObj";
import { SpriteObj, SpriteObjType } from "../../../../core/models/objs/SpriteObj";
import { SpriteSheetObjType } from "../../../../core/models/objs/SpriteSheetObj";
import { Registry } from "../../../../core/Registry";
import { AbstractModuleImporter } from "../../../../core/services/import/AbstractModuleImporter";

interface ImportData {
    items?: ObjJson[];
    assets?: ObjJson[];
}

export class Importer_Scene extends AbstractModuleImporter {
    private registry: Registry;
    private canvas: Canvas3dPanel;

    constructor(canvas: Canvas3dPanel, registry: Registry) {
        super();
        this.canvas = canvas;
        this.registry = registry;
    }

    import(data: ImportData): void {
        this.importAssetObjs(data.assets || []);
        this.importObjs(data.items || []);
    }

    private importObjs(objJsons: ObjJson[]) {
        const afterAllObjsDeserializedFuncs: AfterAllObjsDeserialized[] = [];

        // TODO: find a better way to ensure SpriteSheetObjType loads before SpriteObjType
        objJsons.sort((a, b) => a.objType === SpriteSheetObjType ? -1 : b.objType === SpriteSheetObjType ? 1 : 0);
        // TODO: find a better way to ensure PhysicsImpostorObj loads before MeshObj
        objJsons.sort((a, b) => a.objType === PhysicsImpostorObjType ? -1 : b.objType === PhysicsImpostorObjType ? 1 : 0);
        objJsons.forEach(obj => {
            let objInstance: IObj;
            if (obj.objType === NodeObjType) {
                objInstance = this.registry.data.helper.node.createObj((<NodeObjJson> obj).type);
                objInstance.deserialize(obj, this.registry);
            } else {
                objInstance = this.createObj(obj);
                const afterAllObjsDeserialized = objInstance.deserialize(obj, this.registry);
                if (afterAllObjsDeserialized) {
                    afterAllObjsDeserializedFuncs.push(afterAllObjsDeserialized);
                }
            }
        });

        afterAllObjsDeserializedFuncs.forEach(func => func());
    }

    createObj(objJson: ObjJson) {
        switch(objJson.objType) {
            case MeshObjType:
                const obj = new MeshObj(this.canvas);
                return obj;
            case PathObjType:
                return new PathObj(this.canvas);
            case SpriteObjType:
                const spriteObj = new SpriteObj(this.canvas);
                return spriteObj;
            case AssetObjType:
                return new AssetObj(this.canvas);
            case NodeConnectionObjType:
                return new NodeConnectionObj(this.canvas);
            case LightObjType:
                const lightObj = new LightObj(this.canvas);
                lightObj.id = this.registry.data.scene.items.generateId(lightObj);
                return lightObj; 
            case PhysicsImpostorObjType:
                return new PhysicsImpostorObj(this.canvas);
        }
    }

    private importAssetObjs(objJsons: ObjJson[]) {
        const assetStore = this.registry.stores.assetStore;

        objJsons.forEach(objJson => {
            const objInstance = new AssetObj(this.canvas);;
            objInstance.deserialize(<AssetObjJson> objJson);
            assetStore.addObj(objInstance as AssetObj);
        });
    }
}