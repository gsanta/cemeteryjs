import { Point } from './Point';


export class Polygon {
    public points: Point[];
    public left: number;
    public top: number;
    public width: number;
    public height: number;


    constructor(points: Point[]) {
        this.points = points;
    }

    clone(): Polygon {
        const points = this.points.map(point => point.clone());

        return new Polygon(points);
    }
}