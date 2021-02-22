import { AbstractGameObj } from "../../models/objs/AbstractGameObj";
import { IObj } from "../../models/objs/IObj";
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

    add(obj: AbstractGameObj) {
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

    remove(obj: AbstractGameObj) {
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
        return this.objById.get(id) || this.getByName(id);
    }

    getByTag(tag: string): AbstractGameObj[] {
        return this.objs.filter(obj => obj.hasTag(tag));
    }

    clearTag(tag: string): void {
        this.objs.forEach(obj => obj.removeTag(tag));
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

    getAll(): AbstractGameObj[] {
        return this.objs;
    }

    clear() {
        while(this.objs.length > 0) {
            this.objs[0].clearTags();
            this.remove(this.objs[0]);
        }
        // this.objs.forEach(obj => this.removeItem(obj));
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

    getByType(type: string): AbstractGameObj[] {
        return this.objsByType.get(type) || [];
    }
}