import { IObj } from "../models/objs/IObj";

export class ObjSelectionStore {
    protected objs: IObj[] = [];
    protected objById: Map<string, IObj> = new Map();
    protected nameCache: Map<string, IObj> = new Map();
    private objsByType: Map<string, IObj[]> = new Map();

    addObj(obj: IObj) {
        this.objs.push(obj);
        this.objById.set(obj.id, obj);

        if (!this.objsByType.get(obj.objType)) {
            this.objsByType.set(obj.objType, []);
        }

        this.objsByType.get(obj.objType).push(obj);
    }

    removeObj(obj: IObj) {
        this.objs.splice(this.objs.indexOf(obj), 1);
        this.objById.delete(obj.id);
        this.nameCache.delete(obj.name);

        const thisObjTypes = this.objsByType.get(obj.objType) || [];
        thisObjTypes.splice(thisObjTypes.indexOf(obj), 1);
        if (thisObjTypes.length === 0) {
            this.objsByType.delete(obj.objType);
        }
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
    }
}