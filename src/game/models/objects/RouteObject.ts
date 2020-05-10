import { IGameObject } from "./IGameObject";
import { PathCorner } from "./PathObject";
import { MeshConcept } from "../../../core/models/concepts/MeshConcept";
import { PathConcept } from "../../../core/models/concepts/PathConcept";
import { ConceptType } from "../../../core/models/concepts/Concept";

export class RouteObject implements IGameObject {
    readonly type = ConceptType.RouteConcept;
    private getPathObjectFunc: () => PathConcept;
    private getMeshObjectFunc: () => MeshConcept;
    constructor(getMeshObject: () => MeshConcept, getPathObject: () => PathConcept) {
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