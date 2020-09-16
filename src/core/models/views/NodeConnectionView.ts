import { Point } from "../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { NodeConnectionObj, NodeConnectionObjJson } from "../game_objects/NodeConnectionObj";
import { NodeView } from "./NodeView";
import { View, ViewJson, ViewType } from "./View";
import { Registry } from "../../Registry";

export interface NodeConnectionViewJson extends ViewJson {
    point1X: number;
    point1Y: number;
    point2X: number;
    point2Y: number;
    obj: NodeConnectionObjJson;
}

export class NodeConnectionView extends View {
    readonly  viewType = ViewType.NodeConnectionView;

    // joinPoint1: JoinPointView;
    // joinPoint2: JoinPointView;
    dimensions = undefined;
    point1: Point;
    point2: Point;
    obj: NodeConnectionObj;

    constructor() {
        super();
        this.obj = new NodeConnectionObj();
    }

    private updateDimensions() {
        if (this.point1 && this.point2) {
            this.dimensions = Rectangle.fromTwoPoints(this.point1, this.point2);
        }
    }

    move() {
        // action nodes will move their join points, so this object is automatically moved
    }

    setPoint1(point: Point) {
        this.point1 = point;
        this.updateDimensions();
    }

    setPoint2(point: Point) {
        this.point2 = point;
        this.updateDimensions();
    }

    dispose() {}

    toJson(): NodeConnectionViewJson {
        return {
            ...super.toJson(),
            point1X: this.point1.x,
            point1Y: this.point1.y,
            point2X: this.point2.x,
            point2Y: this.point2.y,
            obj: this.obj.toJson()
        };
    }

    fromJson(json: NodeConnectionViewJson, registry: Registry) {
        super.fromJson(json, registry);
        this.obj.fromJson(json.obj, registry);
        (registry.stores.nodeStore.getById(this.obj.node1.id) as NodeView).findJoinPointView(this.obj.joinPoint1).connection = this;
        (registry.stores.nodeStore.getById(this.obj.node2.id) as NodeView).findJoinPointView(this.obj.joinPoint2).connection = this;
        this.point1 = new Point(json.point1X, json.point1Y);
        this.point2 = new Point(json.point2X, json.point2Y);

        this.updateDimensions();
    }
}