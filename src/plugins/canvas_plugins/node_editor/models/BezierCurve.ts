import { Point } from "../../../../utils/geometry/shapes/Point";
import Bezier from 'bezier-js';

export class BezierCurve {
    private curve: Bezier;
    private distance: number;
    private discretePoints: Point[];

    constructor(points: Point[], distance: number = 3) {
        this.checkPoints(points);

        this.distance = distance;
        this.curve = new Bezier(points);
    }

    getPoints(): Point[] {
        if (!this.discretePoints) { this.createDiscretePoints(); }

        return this.discretePoints;
    }

    private checkPoints(points: Point[]) {
        if (points.length !== 3) { throw new Error(`Only quadratic bezier curves are supported, which needs three points, not ${points.length}.`) }
    }

    private createDiscretePoints() {
        this.discretePoints = [];
        this.iteratePoints((t: number) => {
            const nextPoint = this.curve.get(t);
            this.discretePoints.push(new Point(nextPoint.x, nextPoint.y));
        });
    }

    private iteratePoints(callback: (t: number) => void) {
        const dotNum = this.curve.length() / this.distance;

        for (let i = 0; i < dotNum; i++) {
            callback(this.distance * i / this.curve.length());
        }
    }
}