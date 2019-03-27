import { Polygon } from './Polygon';
import { Point } from './Point';
import { Line } from './Line';

export class Rectangle extends Polygon {
    constructor(left: number, top: number, width: number, height: number) {
        super([
            new Point(left, top),
            new Point(left + width, top),
            new Point(left + width, top + height),
            new Point(left, top + height),
        ])
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }

    /**
     * Sets the height of the `Rectangle`, the name is general to be able to apply it
     * to other types of shapes as well.
     */
    public setBoundingHeight(newHeight: number): Rectangle {
        return new Rectangle(this.left, this.top, this.width, newHeight);
    }

    /**
     * Sets the width of the `Rectangle`, the name is general to be able to apply it
     * to other types of shapes as well.
     */
    public setBoundingWidth(newWidth: number): Rectangle {
        return new Rectangle(this.left, this.top, newWidth, this.height);
    }

    public addX(amount: number): Polygon {
        return new Rectangle(this.left + amount, this.top, this.width, this.height);
    }

    public addY(amount: number): Polygon {
        return new Rectangle(this.left, this.top + amount, this.width, this.height);
    }


    public negateX(): Polygon {
        return new Rectangle(-this.left, this.top, this.width, this.height);
    }

    public negateY(): Polygon {
        return new Rectangle(this.left, -this.top, this.width, this.height);
    }

    /**
     * Calculates the two sides that are narrower than the other two or null    public clone(): Polygon {
        const points = this.points.map(point => point.clone());

        const clone = new Polygon(points);
        clone.left = this.left;
        clone.top = this.top;
        clone.width = this.width;
        clone.height = this.height;

        return clone;
    }
     * if it is a square.
     */
    public getNarrowSides(): [Line, Line] {
        if (this.width < this.height) {
            return [
                new Line(this.points[0], this.points[1]),
                new Line(this.points[3], this.points[2])
            ]
        } else if (this.width > this.height) {
            return [
                new Line(this.points[1], this.points[2]),
                new Line(this.points[0], this.points[3])
            ]
        } else {
            return null;
        }
    }

    public clone(): Rectangle {
        return new Rectangle(this.left, this.top, this.width, this.height);
    }
}