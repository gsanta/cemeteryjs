import { Point } from "./Point";
import { Angle } from "./Angle";

export class Line {
    slope: number;
    yIntercept: number;
    xIntercept: number;

    private constructor(slope: number, yIntercept: number, xIntercept: number) {
        this.slope = slope;
        this.yIntercept = yIntercept;
        this.xIntercept = xIntercept;
    }

    public getSegmentWithCenterPointAndDistance(centerPoint: Point, d: number): [Point, Point] {
        if (this.isHorizontal()) {
            return [
                new Point(centerPoint.x - d, centerPoint.y),
                new Point(centerPoint.x + d, centerPoint.y)
            ];
        } else if (this.isVertical()) {
            return [
                new Point(centerPoint.x, centerPoint.y - d),
                new Point(centerPoint.x, centerPoint.y + d)
            ];
        } else {
            const x1 = centerPoint.x + d / (Math.sqrt(1 + Math.pow(this.slope, 2)));
            const x2 = centerPoint.x - d / (Math.sqrt(1 + Math.pow(this.slope, 2)));

            const y1 = this.getY(x1);
            const y2 = this.getY(x2);

            return [
                new Point(x1, y1),
                new Point(x2, y2)
            ];
        }
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

    public hasEqualSlope(otherLine: Line): boolean {
        const thisM = this.slope === undefined ? Number.MAX_VALUE : this.slope;
        const thatM = otherLine.slope === undefined ? Number.MAX_VALUE: otherLine.slope;

        return Math.abs(thisM - thatM) < 0.1;
    }

    public intersection(otherLine: Line): Point {
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

        const xAxis = Line.createHorizontalLine(0);
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

    static fromTwoPoints(point1: Point, point2: Point): Line {
        const slope = point1.x === point2.x ? undefined : (point1.y - point2.y) / (point1.x - point2.x);

        return Line.fromPointSlopeForm(point1, slope);
    }

    static fromPointSlopeForm(point: Point, slope: number): Line {
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

        return new Line(slope, yIntercept, xIntercept);
    }

    public static createVerticalLine(x: number) {
        return new Line(undefined, undefined, x);
    }

    public static createHorizontalLine(y: number) {
        return new Line(0, y, undefined);
    }
}