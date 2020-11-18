import { IObj } from "./IObj";


export interface IGameObj {
    setParent(obj: IObj & IGameObj): void;
    getParent(): IObj & IGameObj;
}