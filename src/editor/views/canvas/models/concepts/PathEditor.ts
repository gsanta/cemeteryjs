import { PathConcept } from "./PathConcept";
import { Point } from "../../../../../misc/geometry/shapes/Point";

export class PathEditor {
    private pathConcept: PathConcept;

    constructor(pathConcept: PathConcept) {
        this.pathConcept = pathConcept;
    }

    move(point: Point) {
        this.pathConcept.selected.add(point);
    }
}