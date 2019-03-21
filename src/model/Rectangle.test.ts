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
});