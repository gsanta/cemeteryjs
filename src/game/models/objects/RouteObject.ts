import { MeshObject } from "./MeshObject";
import { IGameObject, GameObjectType } from "./IGameObject";
import { PathObject } from "./PathObject";


export class RouteObject implements IGameObject {
    readonly objectType: GameObjectType.RouteObject;
    name: string;
    meshObjectName: string;
    pathObjectName: string;

    animation: string;
}