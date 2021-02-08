

import { ObjJson } from "../../../../core/models/objs/IObj";
import { LightObjType } from "../../../../core/models/objs/LightObj";
import { MeshObjType } from "../../../../core/models/objs/MeshObj";
import { PathObjType } from "../../../../core/models/objs/PathObj";
import { PhysicsImpostorObjType } from "../../../../core/models/objs/PhysicsImpostorObj";
import { SpriteObjType } from "../../../../core/models/objs/SpriteObj";
import { SpriteSheetObjType } from "../../../../core/models/objs/SpriteSheetObj";
import { Registry } from "../../../../core/Registry";
import { AbstractModuleExporter } from "../../../../core/services/export/AbstractModuleExporter";

export class Exporter_Scene extends AbstractModuleExporter {
    private registry: Registry;
    private acceptedObjTypes: string[] = [MeshObjType, SpriteObjType, PathObjType, LightObjType, PhysicsImpostorObjType, SpriteSheetObjType]

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    export() {
        const data: any = {};

        const items = this.exportObjs();

        if (items.length > 0) {
            data.items = items;
        }

        const assets = this.exportAssets();

        if (assets.length > 0) {
            data.assets = assets;
        }

        return data;
    }

    exportObjs(): ObjJson[] {
        return this.registry.data.scene.items.getAllItems()
            .filter(obj => this.acceptedObjTypes.includes(obj.objType))
            .map(obj => obj.serialize());
    }

    exportAssets() {
        return this.registry.stores.assetStore.getAll().map(obj => obj.serialize());
    }
}