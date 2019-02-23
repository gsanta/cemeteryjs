import { Point } from './Point';


export class Polygon {
    public points: Point[];

    constructor(points: Point[]) {
        this.points = points;
    }

    clone(): Polygon {
        const points = this.points.map(point => point.clone());

        return new Polygon(points);
    }
}