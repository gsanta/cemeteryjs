import { Point } from './Point';
import { Polygon } from './Polygon';
import { Shape } from './Shape';

export class Rectangle implements Shape {
    topLeft: Point;
    bottomRight: Point;

    private center: Point;

    constructor(topLeft: Point, bottomRight: Point) {
        this.topLeft = topLeft;
        this.bottomRight = bottomRight;
        this.recalc();
    }

    translate(point: Point): Rectangle {
        const topLeft = this.topLeft.addX(point.x).addY(point.y);
        const bottomRight = this.bottomRight.addX(point.x).addY(point.y);
        return new Rectangle(topLeft, bottomRight);
    }

    getBoundingCenter(): Point {
        return this.center;
    }

    getBoundingRectangle(): Rectangle {
        return this;
    }

    setWidth(newWidth: number): Rectangle {
        const delta = newWidth - this.getWidth();

        this.topLeft = this.topLeft.addX(-delta / 2);
        this.bottomRight = this.bottomRight.setX(this.topLeft.x + newWidth);
        this.recalc();
        return this;
    }

    setHeight(newHeight: number): Rectangle {
        const delta = newHeight - this.getHeight();

        this.topLeft = this.topLeft.addY(-delta / 2);
        this.bottomRight = this.bottomRight.setY(this.topLeft.y + newHeight);
        this.recalc();
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
        this.setWidth(this.getWidth() * amount.x);
        this.setHeight(this.getHeight() * amount.y);
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

    toPolygon(): Polygon {
        return new Polygon([this.topLeft, this.topLeft.clone().addX(this.getWidth()), this.bottomRight, this.bottomRight.clone().addX(-this.getWidth())]);
    }

    static squareFromCenterPointAndRadius(centerPoint: Point, radius: number) {
        const topLeft = centerPoint.subtract(new Point(radius, radius));
        const bottomRight = centerPoint.add(new Point(radius, radius));

        return new Rectangle(topLeft, bottomRight);
    }

    private recalc() {
        this.center = this.topLeft.clone().addX(this.getWidth() / 2).addY(this.getHeight() / 2);
    }

    toString() {
        return `${this.topLeft.toString()},${this.bottomRight.toString()}`
    }

    static fromTwoPoints(point1: Point, point2: Point) {
        const left = point1.x <= point2.x ? point1.x : point2.x;
        const right = point1.x > point2.x ? point1.x : point2.x;
        const top = point1.y <= point2.y ? point1.y : point2.y;
        const bottom = point1.y > point2.y ? point1.y : point2.y;

        return new Rectangle(new Point(left, top), new Point(right, bottom));
    }

    static fromString(str: string): Rectangle {
        const points = str.split(',');
        return new Rectangle(Point.fromString(points[0]), Point.fromString(points[1]));
    }
}