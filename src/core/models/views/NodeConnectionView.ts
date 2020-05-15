import { ConceptType } from "./View";
import { VisualConcept } from "../concepts/VisualConcept";
import { JoinPointView } from "./control/JoinPointView";


export class NodeConnectionView implements VisualConcept {
    readonly  type = ConceptType.ActionNodeConnectionConcept;
    readonly id: string;

    readonly joinPoint1: JoinPointView;
    readonly joinPoint2: JoinPointView;
    dimensions = undefined;

    constructor(id: string, joinPoint1: JoinPointView, joinPoint2: JoinPointView) {
        this.id = id;
        this.joinPoint1 = joinPoint1;
        this.joinPoint2 = joinPoint2;
    }

    move() {
        // action nodes will move their join points, so this object is automatically moved
    }
}