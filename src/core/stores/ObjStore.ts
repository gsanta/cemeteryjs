import { IObj } from "../models/objs/IObj";
import { MeshObj, MeshObjType } from "../models/objs/MeshObj";
import { SpriteObj, SpriteObjType } from "../models/objs/SpriteObj";
import { Registry } from "../Registry";
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

    setIdGenerator(idGenerator: IdGenerator) {
        if (this.idGenerator) {
            throw new Error(`Store ${this.id} already has an id generator, for consistency with the store's content, id generator should be set only once.`);
        }
        this.idGenerator = idGenerator;
    }

    addObj(obj: IObj) {
        const id = this.idGenerator.generateId(obj.objType);
        obj.id = id;
        this.objs.push(obj);
        this.objById.set(id, obj);

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

    getAll(): IObj[] {
        return this.objs;
    }

    size() {
        return this.objs.length;
    }

    clear() {
        this.objs = [];
        this.objById = new Map();
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