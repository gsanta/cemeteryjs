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

    public addToEnd(amount: number) {
        if (this.isVertical()) {
            return new Line(this.start, this.end.addY(amount));
        } else {
            return new Line(this.start, this.end.addX(amount));
        }
    }

    public addToStart(amount: number) {
        if (this.isVertical()) {
            return new Line(this.start.addY(amount), this.end);
        } else {
            return new Line(this.start.addX(amount), this.end);
        }
    }
}