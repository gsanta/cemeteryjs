import { Polygon } from './Polygon';
import { Point } from './Point';
import { Line } from './Line';
import _ = require('lodash');

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
     * Stretches the `Rectangle` in the x direction by the given `amount` while keeping the center point
     */
    public stretchX(amount: number): Rectangle {
        return new Rectangle(this.left - amount, this.top, this.width + amount * 2, this.height);
    }

    /**
     * Stretches the `Rectangle` in the x direction by the given `amount` while keeping the center point
     */
    public stretchY(amount: number): Rectangle {
        return new Rectangle(this.left, this.top - amount, this.width, this.height + amount * 2);
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

    /**
     * Returns the center `Point` of the `Rectangle`
     */
    public getBoundingCenter(): Point {
        return new Point(this.left + this.width / 2, this.top + this.height / 2);
    }

    /**
     * Cuts the `Rectangle` into equal slices and returns with an array representing each slice.
     * The area of the slices adds up to the original `Rectangle`
     */
    public cutToEqualHorizontalSlices(numberOfCuts: number = 1): Rectangle[] {
        const sliceHeight = this.height / (numberOfCuts + 1);

        const cuts: Rectangle[] = [];

        _.range(0, numberOfCuts + 1).forEach(index => {
            const currentTop = this.top + index * sliceHeight;

            cuts.push(new Rectangle(this.left, currentTop, this.width, sliceHeight));
        });

        return cuts;
    }

    /**
     * Cuts the `Rectangle` into equal slices and returns with an array representing each slice.
     * The area of the slices adds up to the original `Rectangle`
     */
    public cutToEqualVerticalSlices(numberOfCuts: number = 1): Rectangle[] {
        const sliceWidth = this.width / (numberOfCuts + 1);

        const cuts: Rectangle[] = [];

        _.range(0, numberOfCuts + 1).forEach(index => {
            const currentLeft = this.left + index * sliceWidth;

            cuts.push(new Rectangle(currentLeft, this.top, sliceWidth, this.height));
        });

        return cuts;
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
     * Calculates the two sides that are narrower than the other two or null
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