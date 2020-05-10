import { PathConcept } from "./PathConcept";
import { Point } from "../../geometry/shapes/Point";

export class PathEditor {
    private pathConcept: PathConcept;

    constructor(pathConcept: PathConcept) {
        this.pathConcept = pathConcept;
    }

    move(point: Point) {
        // this.pathConcept.selected.add(point);
    }
}