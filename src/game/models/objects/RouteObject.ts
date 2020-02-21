import { MeshObject } from "./MeshObject";
import { IGameObject, GameObjectType } from "./IGameObject";
import { PathObject } from "./PathObject";
import { Point } from "../../../misc/geometry/shapes/Point";


export class RouteObject implements IGameObject {
    readonly objectType = GameObjectType.RouteObject;
    private getPathObjectFunc: () => PathObject;
    private getMeshObjectFunc: () => MeshObject;
    constructor(getMeshObject: () => MeshObject, getPathObject: () => PathObject) {
        this.getMeshObjectFunc = getMeshObject;
        this.getPathObjectFunc = getPathObject;
    }
    name: string;
    currentStop: number = 0;
    animation: string;
    isFinished = false;
    repeat = true;
    isPaused = false;

    getMeshObject() {
        return this.getMeshObjectFunc();
    }

    getPathObject() {
        return this.getPathObjectFunc();
    }

    reset() {
        this.currentStop = 1;
        this.isFinished = false;
        this.getMeshObject().setPosition(this.getPathObject().root);
    }
}