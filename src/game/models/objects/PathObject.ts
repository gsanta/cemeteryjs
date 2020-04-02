import { IGameObject, GameObjectType } from "./IGameObject";
import { Point } from "../../../misc/geometry/shapes/Point";


export class PathObject implements IGameObject {
    readonly objectType = GameObjectType.PathObject
    id: string;
    points: Point[] = [];
    tree: Map<number, number[]> = new Map();
    root: Point;
}