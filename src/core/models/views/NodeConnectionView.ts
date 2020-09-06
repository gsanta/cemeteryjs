import { ViewType, View, ViewJson } from "./View";
import { JoinPointView } from "./child_views/JoinPointView";
import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { NodeView } from "./NodeView";
import { SlotName } from '../game_objects/NodeObj';

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
    readonly  viewType = ViewType.NodeConnectionView;

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

    fromJson(json: NodeConnectionViewJson, viewMap: Map<string, View>) {
        super.fromJson(json, viewMap);
        const node1 = <NodeView> viewMap.get(json.joinPoint1.nodeId);
        const joinPoint1 = node1.findJoinPointView(json.joinPoint1.slotName as SlotName);

        const node2 = <NodeView> viewMap.get(json.joinPoint2.nodeId);
        const joinPoint2 = node2.findJoinPointView(json.joinPoint2.slotName as SlotName);

        this.setup(joinPoint1, joinPoint2);
    }
}