import { IObj } from "../models/objs/IObj";
import { IdGenerator } from "./IdGenerator";

export interface ObjStoreHook {
    addObjHook(obj: IObj);
    removeObjHook(obj: IObj);
}

export class AbstractObjStore<T extends IObj> {
    protected objs: T[] = [];
    protected objMap: Map<string, T> = new Map();
    private idGenerator: IdGenerator;
    private hooks: ObjStoreHook[] = [];
    id: string;

    setIdGenerator(idGenerator: IdGenerator) {
        if (this.idGenerator) {
            throw new Error(`Store ${this.id} already has an id generator, for consistency with the store's content, id generator should be set only once.`);
        }
        this.idGenerator = idGenerator;
    }

    addObj(obj: T) {
        const id = this.idGenerator.generateId(obj.objType);
        obj.id = id;
        this.objs.push(obj);
        this.objMap.set(id, obj);

        this.hooks.forEach(hook => hook.addObjHook(obj));
    }

    removeObj(obj: T) {
        this.hooks.forEach(hook => hook.removeObjHook(obj));

        this.objs.splice(this.objs.indexOf(obj), 1);
        this.objMap.delete(obj.id);
    }

    getById(id: string) {
        return this.objMap.get(id);
    }

    getAll(): T[] {
        return this.objs;
    }

    size() {
        return this.objs.length;
    }

    clear() {
        this.objs = [];
        this.objMap = new Map();
    }

    addHook(hook: ObjStoreHook) {
        this.hooks.push(hook);
    }

    removeHook(hook: ObjStoreHook) {
        this.hooks.splice(this.hooks.indexOf(hook), 1);
    }
}