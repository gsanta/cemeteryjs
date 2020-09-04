import { AbstractStore } from "./AbstractStore";
import { IGameObj } from "../models/game_objects/IGameObj";

export abstract class AbstractObjStore<T extends IGameObj> extends AbstractStore<T> {
    protected objs: T[] = [];
    protected objMap: Map<string, T> = new Map();

    addObj(obj: T) {
        const id = this.generateId(this.createPrefix(obj));
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

    protected abstract createPrefix(obj: IGameObj): string;
}