import { Point } from "./Point";

export class Line {
    public start: Point;
    public end: Point;

    constructor(start: Point, end: Point) {
        this.start = start;
        this.end = end;
    }

    public isVertical() {
        return this.start.x === this.end.x;
    }

    public isHorizontal() {
        return this.start.y === this.end.y;
    }
}