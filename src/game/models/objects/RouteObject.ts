import { IGameObject } from "./IGameObject";
import { PathObject, PathCorner } from "./PathObject";
import { ConceptType } from "../../../editor/views/canvas/models/concepts/Concept";
import { MeshConcept } from "../../../editor/views/canvas/models/concepts/MeshConcept";

export class RouteObject implements IGameObject {
    readonly type = ConceptType.RouteConcept;
    private getPathObjectFunc: () => PathObject;
    private getMeshObjectFunc: () => MeshConcept;
    constructor(getMeshObject: () => MeshConcept, getPathObject: () => PathObject) {
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

    dispose() {}
}