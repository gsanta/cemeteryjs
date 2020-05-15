import { ConceptType } from "../concepts/Concept";
import { VisualConcept } from "../concepts/VisualConcept";
import { JoinPointControl } from "../controls/JoinPointControl";


export class NodeConnectionView implements VisualConcept {
    readonly  type = ConceptType.ActionNodeConnectionConcept;
    readonly id: string;

    readonly joinPoint1: JoinPointControl;
    readonly joinPoint2: JoinPointControl;
    dimensions = undefined;

    constructor(id: string, joinPoint1: JoinPointControl, joinPoint2: JoinPointControl) {
        this.id = id;
        this.joinPoint1 = joinPoint1;
        this.joinPoint2 = joinPoint2;
    }

    move() {
        // action nodes will move their join points, so this object is automatically moved
    }
}