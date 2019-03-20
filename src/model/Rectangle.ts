import { Polygon } from './Polygon';
import { Point } from './Point';
import { Line } from './Line';

export class Rectangle extends Polygon {
    constructor(left: number, top: number, width: number, height: number) {
        super([
            new Point(left, top),
            new Point(left + width, top),
            new Point(left + width, top + height),
            new Point(left, top + height),
        ])
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }

    public getNarrowSides(): [Line, Line] {
        if (this.width < this.height) {
            return [
                new Line(this.points[0], this.points[1]),
                new Line(this.points[3], this.points[2])
            ]
        } else {
            return [
                new Line(this.points[1], this.points[2]),
                new Line(this.points[0], this.points[3])
            ]
        }
    }
}