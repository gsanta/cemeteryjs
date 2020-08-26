import { AbstractStore } from "./AbstractStore";
import { IGameObj } from "../models/game_objects/IGameObj";


export class ObjStore extends AbstractStore {
    protected objs: IGameObj[] = [];

    addObj(obj: IGameObj) {
        this.objs.push(obj);
    }
}