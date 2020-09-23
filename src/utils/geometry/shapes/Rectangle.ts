import { Point } from './Point';
import { Polygon } from './Polygon';

export class Rectangle extends Polygon {
    topLeft: Point;
    bottomRight: Point;

    constructor(topLeft: Point, bottomRight: Point) {
        super([
            topLeft,
            new Point(bottomRight.x, topLeft.y),
            bottomRight,
            new Point(topLeft.x, bottomRight.y)
        ]);

        this.topLeft = topLeft;
        this.bottomRight = bottomRight;
    }

    translate(point: Point): Rectangle {
        const topLeft = this.topLeft.addX(point.x).addY(point.y);
        const bottomRight = this.bottomRight.addX(point.x).addY(point.y);
        return new Rectangle(topLeft, bottomRight);
    }

    setWidth(newWidth: number): Rectangle {
        const delta = newWidth - this.getWidth();

        this.topLeft = this.topLeft.addX(-delta / 2);
        this.bottomRight = this.bottomRight.setX(this.topLeft.x + newWidth);
        this.initPoints();
        return this;
    }

    setHeight(newHeight: number): Rectangle {
        const delta = newHeight - this.getHeight();

        this.topLeft = this.topLeft.addY(-delta / 2);
        this.bottomRight = this.bottomRight.setY(this.topLeft.y + newHeight);
        this.initPoints();
        return this;
    }

    getWidth(): number {
        return this.bottomRight.x - this.topLeft.x;
    }

    getHeight(): number {
        return this.bottomRight.y - this.topLeft.y;
    }

    getSize(): Point {
        return new Point(this.getWidth(), this.getHeight());
    }

    scale(amount: Point): Rectangle {
        const center = this.getBoundingCenter();
        this.setWidth(this.getWidth() * amount.x);
        this.setHeight(this.getHeight() * amount.y);
        this.moveCenterTo(center);

        return this;
    }

    clone(): Rectangle {
        return new Rectangle(this.topLeft.clone(), this.bottomRight.clone());
    }

    moveTo(pos: Point): Rectangle {
        const diff = pos.subtract(this.topLeft);
        const topLeft = this.topLeft.add(diff);
        const bottomRight = this.bottomRight.add(diff);
        return new Rectangle(topLeft, bottomRight);
    }

    moveCenterTo(pos: Point) {
        const center = this.getBoundingCenter();
        const diff = pos.subtract(center);
        const topLeft = this.topLeft.add(diff);
        const bottomRight = this.bottomRight.add(diff);
        return new Rectangle(topLeft, bottomRight);
    }

    div(num: number): Rectangle {
        return new Rectangle(this.topLeft.div(num), this.bottomRight.div(num));
    }

    static squareFromCenterPointAndRadius(centerPoint: Point, radius: number) {
        const topLeft = centerPoint.subtract(new Point(radius, radius));
        const bottomRight = centerPoint.add(new Point(radius, radius));

        return new Rectangle(topLeft, bottomRight);
    }

    private initPoints() {
        this.points = [
            this.topLeft,
            new Point(this.bottomRight.x, this.topLeft.y),
            this.bottomRight,
            new Point(this.topLeft.x, this.bottomRight.y)
        ];
        this.orederedPoints= this.points;
    }

    toString() {
        return `${this.topLeft.toString()} ${this.bottomRight.toString()}`
    }

    static fromTwoPoints(point1: Point, point2: Point) {
        const left = point1.x <= point2.x ? point1.x : point2.x;
        const right = point1.x > point2.x ? point1.x : point2.x;
        const top = point1.y <= point2.y ? point1.y : point2.y;
        const bottom = point1.y > point2.y ? point1.y : point2.y;

        return new Rectangle(new Point(left, top), new Point(right, bottom));
    }

    static fromString(str: string): Rectangle {
        const points = str.split(' ');
        return new Rectangle(Point.fromString(points[0]), Point.fromString(points[1]));
    }
}