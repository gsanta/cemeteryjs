import { Point } from "../../../../../geometry/shapes/Point";


export class Rectangle {
    topLeft: Point;
    bottomRight: Point;

    constructor(topLeft: Point, bottomRight: Point) {
        this.topLeft = topLeft;
        this.bottomRight = bottomRight;
    }
}