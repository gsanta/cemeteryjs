import { Point } from "../../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { Registry } from "../../../Registry";
import { PathObj } from "../../objs/PathObj";
import { PathShape } from "../../../../modules/sketch_editor/main/models/shapes/PathShape";
import { AbstractShape, ShapeJson } from "../AbstractShape";
import { ChildShape } from "./ChildShape";

export interface EditPointViewJson extends ShapeJson {
    point: string;
    parentId: string; 
}

export const PathPointViewType = 'PathPointViewType';
export class PathPoinShape extends ChildShape {
    id: string;
    viewType = PathPointViewType;
    point: Point;
    readonly containerView: PathShape;

    constructor(parent: PathShape, point?: Point) {
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

    clone(): PathPoinShape {
        throw new Error('not implemented')
    }

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