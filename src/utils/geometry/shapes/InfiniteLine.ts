import { Point } from "./Point";
import { Angle } from "./Angle";

export class InfiniteLine {
    slope: number;
    yIntercept: number;
    xIntercept: number;

    private constructor(slope: number, yIntercept: number, xIntercept: number) {
        this.slope = slope;
        this.yIntercept = yIntercept;
        this.xIntercept = xIntercept;
    }

    public getX(y: number): number {
        if (this.isHorizontal()) {
            throw new Error('`getX` not supported for horizontal lines.')
        }
        return (y - this.yIntercept) / this.slope;
    }

    public getY(x: number): number {
        if (this.isVertical()) {
            throw new Error('`getY` not supported for vertical lines.')
        }
        return this.slope * x + this.yIntercept;
    }

    public isVertical(): boolean {
        return this.slope === undefined;
    }

    public isHorizontal(): boolean {
        return this.slope === 0;
    }

    public hasEqualSlope(otherLine: InfiniteLine): boolean {
        const thisM = this.slope === undefined ? Number.MAX_VALUE : this.slope;
        const thatM = otherLine.slope === undefined ? Number.MAX_VALUE: otherLine.slope;

        return Math.abs(thisM - thatM) < 0.1;
    }

    public intersection(otherLine: InfiniteLine): Point {
        if (this.slope === otherLine.slope) {
            return undefined;
        }

        let x: number;

        if (this.slope === undefined) {
            x = this.xIntercept;
        } else if (otherLine.slope === undefined) {
            x = otherLine.xIntercept;
        } else {
            x = (otherLine.yIntercept - this.yIntercept) / (this.slope - otherLine.slope);
        }

        let y: number;
        if (this.slope === undefined) {
            y = otherLine.getY(x);
        } else {
            y = this.getY(x);
        }

        return new Point(x, y);
    }

    getAngleToXAxis(): Angle {
        if (this.isVertical()) {
            return Angle.fromRadian(Math.PI / 2);
        }

        const xAxis = InfiniteLine.createHorizontalLine(0);
        const o = xAxis.intersection(this);

        if (o !== undefined) {
            const a = new Point(o.x + 10, this.getY(o.x + 10));
            const b = new Point(o.x + 10, 0);

            return Angle.fromThreePoints(o, a, b);

        }

        return Angle.fromThreePoints(
            new Point(0, 0),
            new Point(0, 0),
            new Point(0, 0)
        );
    }

    static fromTwoPoints(point1: Point, point2: Point): InfiniteLine {
        const slope = point1.x === point2.x ? undefined : (point1.y - point2.y) / (point1.x - point2.x);

        return InfiniteLine.fromPointSlopeForm(point1, slope);
    }

    static fromPointSlopeForm(point: Point, slope: number): InfiniteLine {
        let yIntercept: number;
        let xIntercept: number;

        if (slope === undefined) {
            yIntercept = undefined;
            xIntercept = point.x;
        } else if (slope === 0) {
            yIntercept = point.y;
            xIntercept = undefined;
        } else {
            yIntercept = -1 * (slope * point.x) + point.y;
            xIntercept = (-1 * yIntercept) / slope;
        }

        return new InfiniteLine(slope, yIntercept, xIntercept);
    }

    public static createVerticalLine(x: number) {
        return new InfiniteLine(undefined, undefined, x);
    }

    public static createHorizontalLine(y: number) {
        return new InfiniteLine(0, y, undefined);
    }
}