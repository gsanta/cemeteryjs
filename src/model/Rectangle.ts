import { Polygon } from './Polygon';
import { Point } from './Point';

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
}