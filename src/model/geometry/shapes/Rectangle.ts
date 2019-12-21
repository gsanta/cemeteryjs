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

    private initPoints() {
        this.points = [
            this.topLeft,
            new Point(this.bottomRight.x, this.topLeft.y),
            this.bottomRight,
            new Point(this.topLeft.x, this.bottomRight.y)
        ];
        this.orederedPoints= this.points;
    }
}