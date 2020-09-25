import { Point } from "../../../../utils/geometry/shapes/Point";
import { NodeView } from "../NodeView";
import { ChildView } from "./ChildView";
import { NodeConnectionView } from "../NodeConnectionView";
import { sizes } from "../../../ui_components/react/styles";
import { View, ViewJson } from "../View";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { Registry } from "../../../Registry";
import { NodeObj } from "../../objs/NodeObj";

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
    bounds: Rectangle;

    constructor(parent: NodeView, config?: {slotName: string, isInput: boolean}) {
        super();
        this.parent = parent;

        if (config) {
            this.slotName = config.slotName;
            this.isInput = config.isInput;
        }
    }

    getObj(): NodeObj {
        return this.parent.getObj();
    }

    setObj(obj: NodeObj) {
        this.parent.setObj(obj);
    }

    getAbsolutePosition() {
        return new Point(this.parent.getBounds().topLeft.x + this.point.x, this.parent.getBounds().topLeft.y + this.point.y); 
    }

    move(delta: Point) {
        if (this.connection) {
            this.isInput ? this.connection.setPoint1(this.getAbsolutePosition()) : this.connection.setPoint2(this.getAbsolutePosition());
        }
    }

    getBounds(): Rectangle {
        return this.bounds;
    }

    setBounds(rectangle: Rectangle) {
        this.bounds = rectangle;
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
        this.connection = registry.stores.viewStore.getById(json.connectionId) as NodeConnectionView;
    }
}