import { ConceptType, View } from "./View";
import { JoinPointView } from "./child_views/JoinPointView";
import { Rectangle } from "../../geometry/shapes/Rectangle";


export class NodeConnectionView extends View {
    readonly  type = ConceptType.ActionNodeConnectionConcept;
    readonly id: string;

    readonly joinPoint1: JoinPointView;
    readonly joinPoint2: JoinPointView;
    dimensions = undefined;

constructor(id: string, joinPoint1: JoinPointView, joinPoint2: JoinPointView) {
        super();
        this.id = id;
        this.joinPoint1 = joinPoint1;
        this.joinPoint2 = joinPoint2;
        this.updateDimensions();
    }

    updateDimensions() {
        this.dimensions = Rectangle.fromTwoPoints(this.joinPoint1.point, this.joinPoint2.point);
    }

    move() {
        // action nodes will move their join points, so this object is automatically moved
    }

    delete() {
        this.joinPoint1.connection = undefined;
        this.joinPoint2.connection = undefined;

        return [this];
    }
}