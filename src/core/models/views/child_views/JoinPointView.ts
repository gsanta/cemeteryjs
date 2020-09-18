import { Point } from "../../../../utils/geometry/shapes/Point";
import { NodeView } from "../NodeView";
import { ChildView } from "./ChildView";
import { NodeConnectionView } from "../NodeConnectionView";
import { sizes } from "../../../ui_components/react/styles";
import { View, ViewJson } from "../View";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { Registry } from "../../../Registry";

export function isJoinPointView(view: View) {
    return view && view.viewType === JoinPointViewType;
}

export interface JoinPointViewJson extends ViewJson {
    point: string;
    slotName: string;
    isInput: boolean;
    connectionId: string;
}

export const JoinPointViewType = 'JoinPointViewType';
export class JoinPointView extends ChildView {
    viewType = JoinPointViewType;
    id: string;
    point: Point;
    parent: NodeView;
    connection: NodeConnectionView;
    slotName: string;
    isInput: boolean;
    dimensions: Rectangle;

    constructor(parent: NodeView, config?: {slotName: string, isInput: boolean}) {
        super();
        this.parent = parent;

        if (config) {
            this.slotName = config.slotName;
            this.isInput = config.isInput;
        }
    }

    getAbsolutePosition() {
        return new Point(this.parent.dimensions.topLeft.x + this.point.x, this.parent.dimensions.topLeft.y + this.point.y); 
    }

    move(delta: Point) {
        if (this.connection) {
            this.isInput ? this.connection.setPoint1(this.getAbsolutePosition()) : this.connection.setPoint2(this.getAbsolutePosition());
        }
    }

    dispose() {}

    toString() {
        return `${this.viewType}: ${this.parent.id} ${this.point.toString()}`;
    }

    toJson(): JoinPointViewJson {
        return {
            ...super.toJson(),
            point: this.point.toString(),
            slotName: this.slotName,
            isInput: this.isInput,
            connectionId: this.connection.id
        }
    }

    fromJson(json: JoinPointViewJson, registry: Registry) {
        super.fromJson(json, registry);
        this.point = Point.fromString(json.point);
        this.slotName = json.slotName;
        this.isInput = json.isInput;
        this.connection = registry.stores.nodeStore.getById(json.connectionId) as NodeConnectionView;
    }
}