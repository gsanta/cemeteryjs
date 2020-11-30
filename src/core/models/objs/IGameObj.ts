import { Point } from "../../../utils/geometry/shapes/Point";
import { IObj } from "./IObj";


export interface IGameObj extends IObj {
    setParent(obj: IObj & IGameObj): void;
    getParent(): IObj & IGameObj;
    setScale(scale: Point);
    getScale(): Point;
}