import { AssetObjType } from "../models/objs/AssetObj";
import { IObj } from "../models/objs/IObj";
import { MeshObj, MeshObjType } from "../models/objs/MeshObj";
import { NodeObjJson, NodeObjType } from "../models/objs/NodeObj";
import { SpriteObj, SpriteObjType } from "../models/objs/SpriteObj";
import { SpriteSheetObj, SpriteSheetObjType } from "../models/objs/SpriteSheetObj";
import { Registry } from "../Registry";
import { AppJson } from "../services/export/ExportService";
import { IdGenerator } from "./IdGenerator";

export interface ObjStoreHook {
    addObjHook(obj: IObj);
    removeObjHook(obj: IObj);
}

export class ObjStore {
    protected objs: IObj[] = [];
    protected objById: Map<string, IObj> = new Map();
    private objsByType: Map<string, IObj[]> = new Map();
    private idGenerator: IdGenerator;
    private hooks: ObjStoreHook[] = [];
    id: string;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    exportInto(appjson: Partial<AppJson>) {
        appjson.objs = this.objs.map(obj => obj.serialize());
    }

    importFrom(appJson: AppJson) {
        // TODO: find a better way to ensure SpriteSheetObjType loads before SpriteObjType
        appJson.objs.sort((a, b) => a.objType === SpriteSheetObjType ? -1 : b.objType === SpriteSheetObjType ? 1 : 0);
        appJson.objs.forEach(obj => {
            if (obj.objType === AssetObjType) {
                return;
            }

            let objInstance: IObj;
            if (obj.objType === NodeObjType) {
                objInstance = this.registry.data.helper.node.createObj((<NodeObjJson> obj).type)
            } else {
                objInstance = this.registry.services.objService.createObj(obj.objType);
            }

            objInstance.deserialize(obj, this.registry);
            this.registry.stores.objStore.addObj(objInstance);
        });
    }

    setIdGenerator(idGenerator: IdGenerator) {
        if (this.idGenerator) {
            throw new Error(`Store ${this.id} already has an id generator, for consistency with the store's content, id generator should be set only once.`);
        }
        this.idGenerator = idGenerator;
    }

    generateId(obj: IObj): string {
        return this.idGenerator.generateId(obj.objType);
    }

    addObj(obj: IObj) {
        if (obj.id) {
            this.idGenerator.registerExistingIdForPrefix(obj.objType, obj.id);
        } else {
            obj.id = this.idGenerator.generateId(obj.objType);
        }
        this.objs.push(obj);
        this.objById.set(obj.id, obj);

        if (!this.objsByType.get(obj.objType)) {
            this.objsByType.set(obj.objType, []);
        }

        this.objsByType.get(obj.objType).push(obj);

        this.hooks.forEach(hook => hook.addObjHook(obj));
    }

    removeObj(obj: IObj) {
        this.hooks.forEach(hook => hook.removeObjHook(obj));

        this.objs.splice(this.objs.indexOf(obj), 1);
        this.objById.delete(obj.id);

        const thisObjTypes = this.objsByType.get(obj.objType);
        thisObjTypes.splice(thisObjTypes.indexOf(obj), 1);
        if (this.objsByType.get(obj.objType).length === 0) {
            this.objsByType.delete(obj.objType);
        }

        obj.dispose();
    }

    getById(id: string) {
        return this.objById.get(id);
    }

    getObjsByType(type: string): IObj[] {
        return this.objsByType.get(type) || [];
    }

    getAllTypes(): string[] {
        return Array.from(this.objsByType.keys());
    }

    getAll(): IObj[] {
        return this.objs;
    }

    size() {
        return this.objs.length;
    }

    clear() {
        this.objs.forEach(obj => this.removeObj(obj));
        this.objs = [];
        this.objById = new Map();
        this.objsByType = new Map();
        this.idGenerator.clear();
    }

    addHook(hook: ObjStoreHook) {
        this.hooks.push(hook);
    }

    removeHook(hook: ObjStoreHook) {
        this.hooks.splice(this.hooks.indexOf(hook), 1);
    }
}

export class ObjLifeCycleHook implements ObjStoreHook {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    addObjHook(obj: IObj) {
        switch(obj.objType) {
            case MeshObjType:
                this.registry.engine.meshes.createInstance(<MeshObj> obj);
                break;
            case SpriteObjType:
                this.registry.engine.sprites.createInstance(<SpriteObj> obj);
                break;
            case SpriteSheetObjType:
                this.registry.engine.spriteLoader.loadSpriteSheet(<SpriteSheetObj> obj);
                break;
        }
    }

    removeObjHook(obj: IObj) {
        switch(obj.objType) {
            case MeshObjType:
                this.registry.engine.meshes.deleteInstance(<MeshObj> obj);
                break;
            case SpriteObjType:
                this.registry.engine.sprites.deleteInstance(<SpriteObj> obj);
                break;
        }
    }
}