import { Rectangle } from "./Rectangle";
import { expect } from "chai";
import { Line } from "./Line";
import { Point } from "./Point";
import _ = require("lodash");

describe('Rectangle', () => {
    describe ('getNarrowSides', () => {
        it ('returns with the two narrower sides out of the four sides of the rectangle [WIDTH is bigger]', () => {
            const rectangle = new Rectangle(0, 0, 5, 2);

            const narrowSides = rectangle.getNarrowSides();

            expect(_.some(narrowSides, new Line(new Point(5, 0), new Point(5, 2))), 'Point(5, 0), Point(5, 2) not found').to.be.true;
            expect(_.some(narrowSides, new Line(new Point(0, 0), new Point(0, 2))), 'Point(0, 0), Point(0, 2) not found').to.be.true;
        });

        it ('returns with the two narrower sides out of the four sides of the rectangle [HEIGHT is bigger]', () => {
            const rectangle = new Rectangle(0, 0, 2, 5);

            const narrowSides = rectangle.getNarrowSides();

            expect(narrowSides.length).to.eql(2);
            expect(_.some(narrowSides, new Line(new Point(0, 0), new Point(2, 0))), 'Point(0, 0), Point(2, 0) not found').to.be.true;
            expect(_.some(narrowSides, new Line(new Point(0, 5), new Point(2, 5))), 'Point(0, 5), Point(2, 5) not found').to.be.true;
        });

        it ('returns null if it is a square', () => {
            const square = new Rectangle(0, 0, 3, 3);

            const narrowSides = square.getNarrowSides();

            expect(narrowSides).to.eql(null);
        });
    });

    describe('`negateX`', () => {
        it ('negates the x coordinates of the `Rectangle`', () => {
            const rectangle = new Rectangle(5, 6, 4, 4);

            expect(rectangle.negateX()).to.eql(new Rectangle(-5, 6, 4, 4));
        });
    });

    describe('`negateY`', () => {
        it ('negates the x coordinates of the `Rectangle`', () => {
            const rectangle = new Rectangle(5, 6, 4, 4);

            expect(rectangle.negateY()).to.eql(new Rectangle(5, -6, 4, 4));
        });
    });

    describe('`addX`', () => {
        it ('adds the speficied amount to the x coordinates of the `Rectangle`', () => {
            const rectangle = new Rectangle(5, 6, 4, 4);

            expect(rectangle.addX(4)).to.eql(new Rectangle(9, 6, 4, 4));
        });
    });

    describe('`addY`', () => {
        it ('adds the speficied amount to the y coordinates of the `Rectangle`', () => {
            const rectangle = new Rectangle(5, 6, 4, 4);

            expect(rectangle.addY(4)).to.eql(new Rectangle(5, 10, 4, 4));
        });
    });

    describe('`cutToEqualHorizontalSlices`', () => {
        it ('cuts the `Rectangle` into two slices without any parameters', () => {
            const rectangle = new Rectangle(1, 3, 4, 2);

            const cuts = rectangle.cutToEqualHorizontalSlices();

            expect(cuts[0]).to.eql(new Rectangle(1, 3, 4, 1));
            expect(cuts[1]).to.eql(new Rectangle(1, 4, 4, 1));
        });

        it ('cuts the `Rectangle` into three slices when `numberOfCuts` parameter equals to 2', () => {
            const rectangle = new Rectangle(1, -2, 4, 6);

            const cuts = rectangle.cutToEqualHorizontalSlices(2);

            expect(cuts[0]).to.eql(new Rectangle(1, -2, 4, 2));
            expect(cuts[1]).to.eql(new Rectangle(1, 0, 4, 2));
            expect(cuts[2]).to.eql(new Rectangle(1, 2, 4, 2));
        });

        it ('makes the cuts\' coordinates relative to the `Rectangle` they were cut from if `areCoordinatesRelativeToTheCuttingRectangle` is set to true ', () => {
            const rectangle = new Rectangle(1, 3, 4, 2);

            const cuts = rectangle.cutToEqualHorizontalSlices(1, true);

            expect(cuts[0]).to.eql(new Rectangle(0, -0.5, 4, 1));
            expect(cuts[1]).to.eql(new Rectangle(0, 0.5, 4, 1));
        });
    });

    describe('`stretchX`', () => {
        it ('stretches the `Rectangle` in the x direction', () => {
            const rectangle = new Rectangle(0, 2, 2, 3);

            expect(rectangle.stretchX(2)).to.eql(new Rectangle(-2, 2, 6, 3));
        });
    });

    describe('`stretchY`', () => {
        it ('stretches the `Rectangle` in the y direction', () => {
            const rectangle = new Rectangle(0, 2, 2, 3);

            expect(rectangle.stretchY(1)).to.eql(new Rectangle(0, 1, 2, 5));
        });
    });

    describe('`cutToEqualVerticalSlices`', () => {
        it ('cuts the `Rectangle` into two slices without any parameters', () => {
            const rectangle = new Rectangle(1, 3, 4, 2);

            const cuts = rectangle.cutToEqualVerticalSlices();

            expect(cuts[0]).to.eql(new Rectangle(1, 3, 2, 2));
            expect(cuts[1]).to.eql(new Rectangle(3, 3, 2, 2));
        });

        it ('cuts the `Rectangle` into three slices when `numberOfCuts` parameter equals to 2', () => {
            const rectangle = new Rectangle(-2, 1, 6, 2);

            const cuts = rectangle.cutToEqualVerticalSlices(2);

            expect(cuts[0]).to.eql(new Rectangle(-2, 1, 2, 2));
            expect(cuts[1]).to.eql(new Rectangle(0, 1, 2, 2));
            expect(cuts[2]).to.eql(new Rectangle(2, 1, 2, 2));
        });

        it ('makes the cuts\' coordinates relative to the `Rectangle` they were cut from if `areCoordinatesRelativeToTheCuttingRectangle` is set to true ', () => {
            const rectangle = new Rectangle(1, 3, 4, 2);

            const cuts = rectangle.cutToEqualVerticalSlices(1, true);

            expect(cuts[0]).to.eql(new Rectangle(-1, 0, 2, 2));
            expect(cuts[1]).to.eql(new Rectangle(1, 0, 2, 2));
        });
    });
});