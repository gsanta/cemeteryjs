import { AbstractGameObj } from "../../models/objs/AbstractGameObj";
import { IObj } from "../../models/objs/IObj";
import { LightObj, LightObjType } from "../../models/objs/LightObj";
import { MeshObj, MeshObjType } from "../../models/objs/MeshObj";
import { RayObj, RayObjType } from "../../models/objs/RayObj";
import { SpriteObj, SpriteObjType } from "../../models/objs/SpriteObj";
import { SpriteSheetObj, SpriteSheetObjType } from "../../models/objs/SpriteSheetObj";
import { Registry } from "../../Registry";
import { IdGenerator } from "../IdGenerator";
import { IStore } from "./IStore";

export interface ObjStoreHook {
    addObjHook(obj: IObj);
    removeObjHook(obj: IObj);
}

export class ObjStore implements IStore<AbstractGameObj> {
    protected objs: AbstractGameObj[] = [];
    protected objById: Map<string, AbstractGameObj> = new Map();
    protected nameCache: Map<string, AbstractGameObj> = new Map();
    private objsByType: Map<string, AbstractGameObj[]> = new Map();
    private idGenerator: IdGenerator;
    private hooks: ObjStoreHook[] = [];
    id: string;

    constructor() {
        this.setIdGenerator(new IdGenerator());
    }

    setIdGenerator(idGenerator: IdGenerator) {
        if (this.idGenerator) {
            throw new Error(`Store ${this.id} already has an id generator, for consistency with the store's content, id generator should be set only once.`);
        }
        this.idGenerator = idGenerator;
    }

    generateId(obj: AbstractGameObj): string {
        return this.idGenerator.generateId(obj.objType);
    }

    addItem(obj: AbstractGameObj) {
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

    removeItem(obj: AbstractGameObj) {
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

    getItemById(id: string) {
        return this.objById.get(id) || this.getByName(id);
    }

    private getByName(name: string) {
        if (!name) { return undefined; }

        if (this.nameCache.get(name) && this.nameCache.get(name).name !== name) {
            this.nameCache.delete(name);
        }

        if (!this.nameCache.get(name)) {
            this.addObjWithNameToCache(name);
        }

        return this.nameCache.get(name);
    }

    find<T>(prop: (item: AbstractGameObj) => T, expectedVal: T): AbstractGameObj[] {
        throw new Error("Method not implemented.");
    }

    private addObjWithNameToCache(name: string) {
        const obj = this.objs.find(obj => obj.name === name);
        this.nameCache.set(name, obj);
    }

    getAllItems(): AbstractGameObj[] {
        return this.objs;
    }

    clear() {
        this.objs.forEach(obj => this.removeItem(obj));
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

    getItemsByType(type: string): AbstractGameObj[] {
        return this.objsByType.get(type) || [];
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
                // this.registry.engine.meshes.createInstance(<MeshObj> obj);
                break;
            case SpriteObjType:
                this.registry.engine.sprites.createInstance(<SpriteObj> obj);
                break;
            case SpriteSheetObjType:
                this.registry.engine.spriteLoader.loadSpriteSheet(<SpriteSheetObj> obj);
                break;
            case LightObjType:
                // this.registry.engine.lights.createInstance(<LightObj> obj);
                break;
            case RayObjType:
                this.registry.engine.rays.createInstance(<RayObj> obj);
                break;
        }
    }

    removeObjHook(obj: IObj) {
        const view = this.registry.data.sketch.items.find(item => item.getObj().id, obj.id)[0];
        if (view) {
            this.registry.data.sketch.items.removeItem(view);
        }
    }
}