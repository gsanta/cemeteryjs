import { Point } from "../../../geometry/shapes/Point";
import { ChildView, FeedbackType } from "./ChildView";
import { PathView } from "../PathView";
import { View, ViewJson } from "../View";

export interface EditPointViewJson extends ViewJson {
    point: string;
    parentId: string; 
}

export class EditPointView extends ChildView<PathView> {
    id: string;
    type = FeedbackType.EditPointFeedback;
    point: Point;
    parent: PathView;

    constructor(config?: {point: Point, parent: PathView}) {
        super();
        this.point = config && config.point;
        this.parent = config && config.parent;
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

    fromJson(json: EditPointViewJson, viewMap: Map<string, View>) {
        super.fromJson(json, viewMap);
        this.point = Point.fromString(json.point);
        this.parent = <PathView> viewMap.get(json.parentId)
    }
}