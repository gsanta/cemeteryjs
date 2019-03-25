import { Point } from "./Point";

export class Line {
    public start: Point;
    public end: Point;

    constructor(endPoint1: Point, endPoint2: Point) {
        [this.start, this.end] = this.orderPoints(endPoint1, endPoint2);
    }

    public isVertical() {
        return this.start.x === this.end.x;
    }

    public isHorizontal() {
        return this.start.y === this.end.y;
    }

    public scaleX(times: number): Line {
        return new Line(this.start.scaleX(times), this.end.scaleX(times));
    }

    public scaleY(times: number): Line {
        return new Line(this.start.scaleY(times), this.end.scaleY(times));
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

    public equalTo(otherLine: Line): boolean {
        return this.start.equalTo(otherLine.start) && this.end.equalTo(otherLine.end);
    }

    public getLength(): number {
        const xDistance = Math.abs(this.start.x - this.end.x);
        const yDistance = Math.abs(this.start.y - this.end.y);

        return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    }

    private orderPoints(endPoint1: Point, endPoint2: Point): [Point, Point] {
        if (endPoint1.y < endPoint2.y) {
            return [endPoint1, endPoint2];
        } else if (endPoint1.x < endPoint2.x) {
            return [endPoint1, endPoint2];
        } else {
            return [endPoint2, endPoint1];
        }
    }
}