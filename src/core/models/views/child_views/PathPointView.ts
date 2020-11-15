import { Point } from "../../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { Registry } from "../../../Registry";
import { PathObj } from "../../objs/PathObj";
import { PathView } from "../../../../plugins/canvas_plugins/scene_editor/views/PathView";
import { View, ViewJson } from "../View";
import { ChildView } from "./ChildView";

export interface EditPointViewJson extends ViewJson {
    point: string;
    parentId: string; 
}

export const PathPointViewType = 'PathPointViewType';
export class PathPointView extends ChildView {
    id: string;
    viewType = PathPointViewType;
    point: Point;
    readonly parent: PathView;

    constructor(parent: PathView, point?: Point) {
        super();
        this.point = point;
        this.parent = parent;
    }

    getObj(): PathObj {
        return this.parent.getObj();
    }

    setObj(obj: PathObj) {
        this.parent.setObj(obj);
    }

    move(delta: Point) {
        this.point.add(delta);
        this.parent.str = undefined;
        this.parent.update();
    }

    getBounds(): Rectangle {
        return this.bounds;
    }

    setBounds(rectangle: Rectangle) {
        this.bounds = rectangle;
    }

    dispose() {}

    toString() {
        return `EditPoint: ${this.parent.id} ${this.point.toString()}`
    }

    toJson(): EditPointViewJson {
        return {
            ...super.toJson(),
            point: this.point.toString(),
            parentId: this.parent.id,
        }
    }

    fromJson(json: EditPointViewJson, registry: Registry) {
        super.fromJson(json, registry);
        this.point = Point.fromString(json.point);
    }
}