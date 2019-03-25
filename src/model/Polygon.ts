import { Point } from './Point';
import * as turf from '@turf/turf';
import { Line } from './Line';
import _ = require('lodash');

export class Polygon {
    public points: Point[];
    public left: number;
    public top: number;
    public width: number;
    public height: number;

    constructor(points: Point[]) {
        this.points = points;
    }

    public addX(amount: number): Polygon {
        const translatedPoints = this.points.map(point => point.addX(amount));
        return new Polygon(translatedPoints);
    }

    public addY(amount: number): Polygon {
        const translatedPoints = this.points.map(point => point.addY(amount));
        return new Polygon(translatedPoints);
    }

    public translate(point: Point): Polygon {
        return this.addX(point.x).addY(point.y);
    }

    public negateX(): Polygon {
        const translatedPoints = this.points.map(point => new Point(-point.x, point.y));
        return new Polygon(translatedPoints);
    }


    public negateY(): Polygon {
        const translatedPoints = this.points.map(point => new Point(point.x, -point.y));
        return new Polygon(translatedPoints);
    }

    public getCircumference(): number {
        return this.points.reduce(
            (sum: number, currentItem: Point, index: number) => sum + this.getNthLine(index).getLength(),
            0
        );
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
    public intersectBorder(other: Polygon): Line {
        const poly1 = turf.polygon([this.toLinearRing().toTwoDimensionalArray()]);
        const poly2 = turf.polygon([other.toLinearRing().toTwoDimensionalArray()]);

        const intersection = turf.intersect(poly1, poly2);

        if (intersection !== null && intersection.geometry.type === 'LineString') {
            // return intersection.geometry.coordinates;
            const coordinates: [[number, number], [number, number]] = intersection.geometry.coordinates;

            return new Line(new Point(coordinates[0][0], coordinates[0][1]), new Point(coordinates[1][0], coordinates[1][1]));
        }
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

    /**
     * Returns with the minimum x position of all of the polygon's points
     */
    public minX(): number {
        return _.minBy(this.points, point => point.x).x;
    }

    /**
     * Returns with the maximum x position of all of the polygon's points
     */
    public maxX(): number {
        return _.maxBy(this.points, point => point.x).x;
    }

    /**
     * Returns with the minimum y position of all of the polygon's points
     */
    public minY(): number {
        return _.minBy(this.points, point => point.y).y;
    }

    /**
     * Returns with the maxmium y position of all of the polygon's points
     */
    public maxY(): number {
        return _.maxBy(this.points, point => point.y).y;
    }

    public strechX(amount: number): Polygon {
        return this.points.reduce(
            (stretchedPolygon, point, index) => {
            const currentCircumference = stretchedPolygon.getCircumference();

                const stretchNeg = point.addX(-amount);
                let clonedPoints = [...stretchedPolygon.points];
                clonedPoints.splice(index, 1, stretchNeg)
                let testPolygonStretchToNeg = new Polygon(clonedPoints);
                if (testPolygonStretchToNeg.getCircumference() < currentCircumference) {
                    const stretchPos = point.addX(amount);

                    clonedPoints = [...stretchedPolygon.points];
                    clonedPoints.splice(index, 1, stretchPos)

                    return new Polygon(clonedPoints);
                } else {
                    return testPolygonStretchToNeg;
                }
            },
            this
        );
    }

    public strechY(amount: number): Polygon {
        return this.points.reduce(
            (stretchedPolygon, point, index) => {
            const currentCircumference = stretchedPolygon.getCircumference();

                const stretchNeg = point.addY(-amount);
                let clonedPoints = [...stretchedPolygon.points];
                clonedPoints.splice(index, 1, stretchNeg)
                let testPolygonStretchToNeg = new Polygon(clonedPoints);
                if (testPolygonStretchToNeg.getCircumference() < currentCircumference) {
                    const stretchPos = point.addY(amount);

                    clonedPoints = [...stretchedPolygon.points];
                    clonedPoints.splice(index, 1, stretchPos)

                    return new Polygon(clonedPoints);
                } else {
                    return testPolygonStretchToNeg;
                }
            },
            this
        );
    }

    public stretch(xAmount: number, yAmount: number): Polygon {
        return this.strechX(xAmount).strechY(yAmount);
    }

    public equalTo(otherPolygon: Polygon): boolean {
        if (this.points.length !== otherPolygon.points.length) {
            return false;
        }

        return _.chain(this.points)
            .map((point, index) => point.equalTo(otherPolygon.points[index]))
            .every(isEqual => isEqual === true)
            .value();
    }

    private toTwoDimensionalArray(): number[][] {
        return <[][]> this.points.map(point => [point.x, point.y]);
    }

    private toLinearRing(): Polygon {
        const clone = this.clone();
        clone.points.push(clone.points[0]);
        return clone;
    }


    private getNthLine(index: number): Line {
        if (this.points.length - 1 === index) {
            return new Line(this.points[index], this.points[0]);
        }
        return new Line(this.points[index], this.points[index + 1]);
    }
}