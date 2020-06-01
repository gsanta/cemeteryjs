import { ConceptType, View, ViewJson } from "./View";
import { JoinPointView } from "./child_views/JoinPointView";
import { Rectangle } from "../../geometry/shapes/Rectangle";

export interface NodeConnectionViewJson extends ViewJson {
    joinPoint1: {
        nodeId: string;
        slotName: string;
    },
    joinPoint2: {
        nodeId: string;
        slotName: string;
    }
}

export class NodeConnectionView extends View {
    readonly  type = ConceptType.ActionNodeConnectionConcept;

    joinPoint1: JoinPointView;
    joinPoint2: JoinPointView;
    dimensions = undefined;

    constructor(config?: {joinPoint1: JoinPointView, joinPoint2: JoinPointView}) {
        super();
        if (config) {
            this.setup(config.joinPoint1, config.joinPoint2);
        }
    }

    private setup(joinPoint1: JoinPointView, joinPoint2: JoinPointView) {
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

    toJson(): NodeConnectionViewJson {
        return {
            ...super.toJson(),
            joinPoint1: {
                nodeId: this.joinPoint1.parent.id,
                slotName: this.joinPoint1.slotName
            },
            joinPoint2: {
                nodeId: this.joinPoint2.parent.id,
                slotName: this.joinPoint2.slotName
            }
        };
    }
}