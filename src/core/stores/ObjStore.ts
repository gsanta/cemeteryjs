import { IObj } from "../models/objs/IObj";
import { LightObj, LightObjType } from "../models/objs/LightObj";
import { MeshObj, MeshObjType } from "../models/objs/MeshObj";
import { RayObj, RayObjType } from "../models/objs/RayObj";
import { SpriteObj, SpriteObjType } from "../models/objs/SpriteObj";
import { SpriteSheetObj, SpriteSheetObjType } from "../models/objs/SpriteSheetObj";
import { Registry } from "../Registry";
import { IdGenerator } from "./IdGenerator";

export interface ObjStoreHook {
    addObjHook(obj: IObj);
    removeObjHook(obj: IObj);
}

export class ObjStore {
    protected objs: IObj[] = [];
    protected objById: Map<string, IObj> = new Map();
    protected nameCache: Map<string, IObj> = new Map();
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

    generateId(objType: string): string {
        return this.idGenerator.generateId(objType);
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
        this.nameCache.delete(obj.name);

        const thisObjTypes = this.objsByType.get(obj.objType) || [];
        thisObjTypes.splice(thisObjTypes.indexOf(obj), 1);
        if (thisObjTypes.length === 0) {
            this.objsByType.delete(obj.objType);
        }

        obj.dispose();
    }

    getById(id: string) {
        return this.objById.get(id);
    }

    getByName(name: string) {
        if (this.nameCache.get(name) && this.nameCache.get(name).name !== name) {
            this.nameCache.delete(name);
        }

        if (!this.nameCache.get(name)) {
            this.addObjWithNameToCache(name);
        }

        return this.nameCache.get(name);
    }

    private addObjWithNameToCache(name: string) {
        const obj = this.objs.find(obj => obj.name === name);
        this.nameCache.set(name, obj);
    }

    getByNameOrId(nameOrId: string) {
        return this.getById(nameOrId) || this.getByName(nameOrId);
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
        this.nameCache = new Map();
        this.objsByType = new Map();
        this.idGenerator && this.idGenerator.clear();
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
            case LightObjType:
                this.registry.engine.lights.createInstance(<LightObj> obj);
                break;
            case RayObjType:
                this.registry.engine.rays.createInstance(<RayObj> obj);
                break;
        }
    }

    removeObjHook(obj: IObj) {
        const view = this.registry.data.view.scene.getByObjId(obj.id);
        if (view) {
            this.registry.data.view.scene.removeView(view);
        }
    }
}