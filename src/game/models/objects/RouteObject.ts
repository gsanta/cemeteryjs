import { MeshObject } from "./MeshObject";
import { IGameObject, GameObjectType } from "./IGameObject";
import { PathObject, PathCorner } from "./PathObject";
import { Point } from "../../../misc/geometry/shapes/Point";


export class RouteObject implements IGameObject {
    readonly objectType = GameObjectType.RouteObject;
    private getPathObjectFunc: () => PathObject;
    private getMeshObjectFunc: () => MeshObject;
    constructor(getMeshObject: () => MeshObject, getPathObject: () => PathObject) {
        this.getMeshObjectFunc = getMeshObject;
        this.getPathObjectFunc = getPathObject;
    }
    id: string;
    currentGoal: PathCorner = undefined;
    isTurning = false;
    animation: string;
    isFinished = false;
    repeat = true;
    isPaused = false;
    path: PathCorner[] = [];

    getMeshObject() {
        return this.getMeshObjectFunc();
    }

    getPathObject() {
        return this.getPathObjectFunc();
    }

    reset() {
        this.currentGoal = undefined;
        this.isFinished = false;
        this.getMeshObject().setPosition(this.getPathObject().root);
    }
}