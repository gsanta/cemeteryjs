import { AbstractStore } from "./AbstractStore";
import { IGameObj } from "../models/game_objects/IGameObj";

export abstract class AbstractObjStore<T extends IGameObj> extends AbstractStore<T> {
    protected objs: T[] = [];

    addObj(obj: T) {
        const id = this.generateId(this.createPrefix(obj));
        this.objs.push(obj);
    }

    getAll(): T[] {
        return this.objs;
    }

    protected abstract createPrefix(obj: IGameObj): string;
}