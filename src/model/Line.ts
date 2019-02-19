import { Point } from "./Point";

export class Line {
    public start: Point;
    public end: Point;

    constructor(start: Point, end: Point) {
        this.start = start;
        this.end = end;
    }
}