import { Point } from "../../../../utils/geometry/shapes/Point";
import { ChildView, FeedbackType } from "./ChildView";
import { PathView } from "../PathView";
import { View, ViewJson } from "../View";
import { Registry } from "../../../Registry";

export interface EditPointViewJson extends ViewJson {
    point: string;
    parentId: string; 
}

export class EditPointView extends ChildView<PathView> {
    id: string;
    viewType = FeedbackType.EditPointFeedback;
    point: Point;
    readonly parent: PathView;
    isActive: boolean = false;

    constructor(parent: PathView, point?: Point) {
        super();
        this.point = point;
        this.parent = parent;
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