import { Point } from "../../../utils/geometry/shapes/Point";
import Bezier from 'bezier-js';

export class BezierCurve {
    private curve: Bezier;
    private distance: number;
    private dots: Point[];
    private derivatives: Point[];
    private normals: Point[];

    constructor(points: Point[], distance: number) {
        this.distance = distance;

        const flatPoints: number[] = [];
        points.forEach(point => flatPoints.push(point.x, point.y));
        this.curve = new Bezier(flatPoints);
    }

    getPoints(): Point[] {
        if (!this.dots) {
            this.createDots();
        }

        return this.dots;
    }

    getNormalizedDerivatives(): Point[] {
        if (!this.derivatives) {
            this.createDerivatives();
        }

        return this.derivatives;
    }

    getNormals(): Point[] {
        if (!this.normals) {
            this.createNormals();
        }

        return this.normals;
    }

    private createDots() {
        this.dots = [];
        this.iteratePoints((t: number) => {
            const nextDot = this.curve.get(t);
            this.dots.push(new Point(nextDot.x, nextDot.y));
        });
    }

    private createDerivatives() {
        this.derivatives = [];
        this.iteratePoints((t: number) => {
            const nextDerivative = this.curve.derivative(t);
            const magnitude = Math.sqrt(nextDerivative.x ** 2 + nextDerivative.y ** 2);
            this.derivatives.push(new Point(nextDerivative.x / magnitude, nextDerivative.y / magnitude));
        });
    }

    private createNormals() {
        this.normals = [];
        this.iteratePoints((t: number) => {
            const nextNormal = this.curve.normal(t);
            this.normals.push(new Point(nextNormal.x, nextNormal.y));
        });
    }

    private iteratePoints(callback: (t: number) => void) {
        const dotNum = this.curve.length() / this.distance;

        for (let i = 0; i < dotNum; i++) {
            callback(this.distance * i / this.curve.length());
        }
    }
}