import { Point } from './Point';


export class Polygon {
    public points: Point[];

    constructor(points: Point[]) {
        this.points = points;
    }
}