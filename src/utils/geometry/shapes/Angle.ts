import * as linear from 'linear-solve';
import { toRadian, Measurements } from '../Measurements';
import { Line } from './Line';
import { Point } from "./Point";

/**
 * An angle is represented as the anticlockwise angle from b to a.
 */
export class Angle {
    private o: Point;
    private a: Point;
    private b: Point;

    private angle: number;

    private constructor(o: Point, a: Point, b: Point) {
        this.o = o;
        this.a = a;
        this.b = b;
        this.angle = this.normalizeAngle(Math.atan2(this.a.y - this.o.y, this.a.x - this.o.x)) - this.normalizeAngle(Math.atan2(this.b.y - this.o.y, this.b.x - this.o.x));
    }

    public getAngle(): number {
        return this.angle;
    }

    public isStraightAngle(): boolean {
        return this.getAngle() === 0 || this.getAngle() === Math.PI || this.getAngle() === -Math.PI;
    }

    public isPointInsideAngle(point: Point) {
        const equation2 = [this.a.y - this.o.y, this.b.y - this.o.y];
        const equation1 = [this.a.x - this.o.x, this.b.x - this.o.x];
        const result = [point.x - this.o.x, point.y - this.o.y];
        const res = linear.solve([equation1, equation2], result);

        return res.length === 2 && res[0] > 0 && res[1] > 0;
    }

    private normalizeAngle(angle: number) {
        return angle < 0 ? angle + 2 * Math.PI : angle;
    }

    static fromRadian(angle: number) {
        angle = angle % (Math.PI * 2);
        angle = angle < 0 ? angle + 2 * Math.PI : angle;
        const slope = Math.tan(angle);

        const line = Line.fromPointSlopeForm(new Point(0, 0), slope);

        let o = new Point(0, 0);
        let b = new Point(10, 0);

        let a: Point = null;

        if (line.isVertical()) {
            if (new Measurements().radToBe(angle, Math.PI)) {
                a = new Point(10, 0);
            } else {
                a = new Point(0, -10);
            }
        }

        if (angle <= Math.PI / 2) {
            a = new Point(10, line.getY(10));
        } else if (angle <= Math.PI) {
            a = new Point(-10, line.getY(-10));
        } else if (angle <= 3 * Math.PI / 2) {
            a = new Point(-10, line.getY(-10));
        } else {
            a = new Point(10, line.getY(10));
        }

        return new Angle(o, a, b);
    }

    static fromThreePoints(o: Point, a: Point, b: Point) {
        return new Angle(o, a, b);
    }

    static fromTwoLines(line1: Line, line2: Line): Angle {
        if (new Measurements().linesParallel(line1, line2)) {
            return undefined;
        } else if (line1.isVertical()) {
            return Angle.fromRadian(line2.slope === 0 ? toRadian(90) :  1 / line2.slope);
        } else if (line2.isVertical()) {
            return Angle.fromRadian(line1.slope === 0 ? toRadian(90) :  1 / line1.slope);
        } else {
            const angleBetweenLines = Math.atan((line1.slope - line2.slope) / (1 + line1.slope * line2.slope));
            return Angle.fromRadian(angleBetweenLines);
        }
    }
}

export function toDegree(radian: number) {
    return 180 / Math.PI * radian;
}
