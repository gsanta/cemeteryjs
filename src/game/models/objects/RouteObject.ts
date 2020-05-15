import { IGameObject } from "./IGameObject";
import { PathCorner } from "./PathObject";
import { MeshView } from "../../../core/models/views/MeshView";
import { PathView } from "../../../core/models/views/PathView";
import { ConceptType } from "../../../core/models/views/View";

export class RouteObject implements IGameObject {
    readonly type = ConceptType.RouteConcept;
    private getPathObjectFunc: () => PathView;
    private getMeshObjectFunc: () => MeshView;
    constructor(getMeshObject: () => MeshView, getPathObject: () => PathView) {
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
        this.getMeshObject().setPosition(this.getPathObject().editPoints[0].point);
    }

    dispose() {}
}