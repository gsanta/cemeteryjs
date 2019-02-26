import { Point } from './Point';
import * as turf from '@turf/turf';

export class Polygon {
    public points: Point[];
    public left: number;
    public top: number;
    public width: number;
    public height: number;

    constructor(points: Point[]) {
        this.points = points;
    }

    public clone(): Polygon {
        const points = this.points.map(point => point.clone());

        return new Polygon(points);
    }

    public overlaps(other: Polygon): boolean {
        const poly1 = turf.polygon([this.toLinearRing().toTwoDimensionalArray()]);
        const poly2 = turf.polygon([other.toLinearRing().toTwoDimensionalArray()]);

        return turf.booleanContains(poly1, poly2);
    }

    private toTwoDimensionalArray(): number[][] {
        return <[][]> this.points.map(point => [point.x, point.y]);
    }

    private toLinearRing(): Polygon {
        const clone = this.clone();
        clone.points.push(clone.points[0]);
        return clone;
    }
}