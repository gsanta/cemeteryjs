import { IGameObject, GameObjectType } from "./IGameObject";
import { Point } from "../../../misc/geometry/shapes/Point";


export class PathObject implements IGameObject {
    readonly objectType = GameObjectType.PathObject
    name: string;
    points: Point[] = [];
}