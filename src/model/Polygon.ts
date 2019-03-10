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

        const clone = new Polygon(points);
        clone.left = this.left;
        clone.top = this.top;
        clone.width = this.width;
        clone.height = this.height;

        return clone;
    }

    public contains(other: Polygon): boolean {
        const poly1 = turf.polygon([this.toLinearRing().toTwoDimensionalArray()]);
        const poly2 = turf.polygon([other.toLinearRing().toTwoDimensionalArray()]);

        return turf.booleanContains(poly1, poly2);
    }

    /**
     * Returns true if the two polygons intersect only at a border (but do not overlap)
     */
    public intersectBorder(other: Polygon): boolean {
        const poly1 = turf.polygon([this.toLinearRing().toTwoDimensionalArray()]);
        const poly2 = turf.polygon([other.toLinearRing().toTwoDimensionalArray()]);

        const intersection = turf.intersect(poly1, poly2);
        return intersection !== null && intersection.geometry.type === 'LineString';
    }

    public scaleX(times: number): Polygon {
        const points = this.points.map(point => point.scaleX(times));
        const left = this.left ? this.left * times : this.left;
        const width = this.width ? this.width * times : this.width;

        const newPolygon = this.clone();
        newPolygon.points = points;
        newPolygon.left = left;
        newPolygon.width = width;

        return newPolygon;
    }

    public scaleY(times: number) {
        const points = this.points.map(point => point.scaleY(times));

        const top = this.top ? this.top * times : this.top;
        const height = this.height ? this.height * times : this.height;

        const newPolygon = this.clone();
        newPolygon.points = points;

        newPolygon.top = top;
        newPolygon.height = height;

        return newPolygon;
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