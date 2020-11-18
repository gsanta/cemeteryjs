import { Point } from "../../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { Registry } from "../../../Registry";
import { PathObj } from "../../objs/PathObj";
import { PathView } from "../../../../plugins/canvas_plugins/scene_editor/views/PathView";
import { View, ViewJson } from "../View";
import { ContainedView } from "./ChildView";

export interface EditPointViewJson extends ViewJson {
    point: string;
    parentId: string; 
}

export const PathPointViewType = 'PathPointViewType';
export class PathPointView extends ContainedView {
    id: string;
    viewType = PathPointViewType;
    point: Point;
    readonly containerView: PathView;

    constructor(parent: PathView, point?: Point) {
        super();
        this.point = point;
        this.containerView = parent;
    }

    getObj(): PathObj {
        return this.containerView.getObj();
    }

    setObj(obj: PathObj) {
        this.containerView.setObj(obj);
    }

    move(delta: Point) {
        this.point.add(delta);
        this.containerView.str = undefined;
        this.containerView.update();
    }

    getBounds(): Rectangle {
        return this.bounds;
    }

    setBounds(rectangle: Rectangle) {
        this.bounds = rectangle;
    }

    dispose() {}

    toString() {
        return `EditPoint: ${this.containerView.id} ${this.point.toString()}`
    }

    toJson(): EditPointViewJson {
        return {
            ...super.toJson(),
            point: this.point.toString(),
            parentId: this.containerView.id,
        }
    }

    fromJson(json: EditPointViewJson, registry: Registry) {
        super.fromJson(json, registry);
        this.point = Point.fromString(json.point);
    }
}