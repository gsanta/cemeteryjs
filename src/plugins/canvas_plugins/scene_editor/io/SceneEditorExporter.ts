import { ObjJson } from "../../../../core/models/objs/IObj";
import { LightObjType } from "../../../../core/models/objs/LightObj";
import { MeshObjType } from "../../../../core/models/objs/MeshObj";
import { PathObjType } from "../../../../core/models/objs/PathObj";
import { PhysicsImpostorObjType } from "../../../../core/models/objs/PhysicsImpostorObj";
import { SpriteObjType } from "../../../../core/models/objs/SpriteObj";
import { ViewJson } from "../../../../core/models/views/View";
import { Registry } from "../../../../core/Registry";
import { AbstractModuleExporter } from "../../../../core/services/export/IModuleExporter";

export class SceneEditorExporter extends AbstractModuleExporter {
    private registry: Registry;
    private acceptedObjTypes: string[] = [MeshObjType, SpriteObjType, PathObjType, LightObjType, PhysicsImpostorObjType]

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    export() {
        const data: any = {};

        const views = this.exportViews();
        
        if (views.length > 0) {
            data.views = views;
        }

        const objs = this.exportObjs();

        if (objs.length > 0) {
            data.objs = objs;
        }

        const assets = this.exportAssets();

        if (assets.length > 0) {
            data.assets = assets;
        }

        return data;
    }

    exportViews(): ViewJson[] {
        return this.registry.data.view.scene.getAllViews().map(view => view.toJson());
    }

    exportObjs(): ObjJson[] {
        return this.registry.stores.objStore.getAll()
            .filter(obj => this.acceptedObjTypes.includes(obj.objType))
            .map(obj => obj.serialize());
    }

    exportAssets() {
        return this.registry.stores.assetStore.getAll().map(obj => obj.serialize());
    }
}