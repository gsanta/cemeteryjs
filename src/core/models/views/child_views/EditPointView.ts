import { Point } from "../../../../utils/geometry/shapes/Point";
import { Registry } from "../../../Registry";
import { PathView } from "../PathView";
import { View, ViewJson } from "../View";
import { ChildView } from "./ChildView";

export interface EditPointViewJson extends ViewJson {
    point: string;
    parentId: string; 
}

export const PathPointViewType = 'PathPointViewType';
export class EditPointView extends ChildView {
    id: string;
    viewType = PathPointViewType;
    point: Point;
    readonly parent: PathView;

    constructor(parent: PathView, point?: Point) {
        super();
        this.point = point;
        this.parent = parent;
        parent.children.push(this);
    }

    delete(): View[] {
        this.parent.deleteEditPoint(this);
        return [this];
    }

    move(delta: Point) {
        this.parent.moveEditPoint(this, delta);
    }

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