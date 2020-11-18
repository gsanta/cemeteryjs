import { IObj } from "./IObj";


export interface IGameObj {
    ready();

    setParent(obj: IObj & IGameObj): void;
    getParent(): IObj & IGameObj;
}