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
    readonly containerShape: PathShape;

    constructor(parent: PathShape, point?: Point) {
        super(parent.canvas);
        this.point = point;
        this.containerShape = parent;
    }

    getObj(): PathObj {
        return this.containerShape.getObj();
    }

    setObj(obj: PathObj) {
        this.containerShape.setObj(obj);
    }

    move(delta: Point) {
        this.point.add(delta);
        this.containerShape.str = undefined;
        this.containerShape.update();
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
        return `EditPoint: ${this.containerShape.id} ${this.point.toString()}`
    }

    toJson(): EditPointViewJson {
        return {
            ...super.toJson(),
            point: this.point.toString(),
            parentId: this.containerShape.id,
        }
    }

    fromJson(json: EditPointViewJson) {
        super.fromJson(json, undefined);
        this.point = Point.fromString(json.point);
    }
}