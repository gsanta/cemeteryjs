import { IGameObj } from "../models/game_objects/IGameObj";
import { IdGenerator } from "./IdGenerator";

export abstract class AbstractObjStore<T extends IGameObj> {
    protected objs: T[] = [];
    protected objMap: Map<string, T> = new Map();
    private idGenerator: IdGenerator;
    id: string;

    setIdGenerator(idGenerator: IdGenerator) {
        if (this.idGenerator) {
            throw new Error(`Store ${this.id} already has an id generator, for consistency with the store's content, id generator should be set only once.`);
        }
        this.idGenerator = idGenerator;
    }

    addObj(obj: T) {
        const id = this.idGenerator.generateId(this.createPrefix(obj));
        obj.id = id;
        this.objs.push(obj);
        this.objMap.set(id, obj);
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

    protected abstract createPrefix(obj: IGameObj): string;
}