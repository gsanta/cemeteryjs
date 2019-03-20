import { Rectangle } from "./Rectangle";
import { expect } from "chai";
import { Line } from "./Line";
import { Point } from "./Point";


describe('Rectangle', () => {

    describe('getNarrowSides', () => {
        it ('returns with the two narrower sides out of the four sides of the rectangle [WIDTH is bigger]', () => {
            const rectangle = new Rectangle(0, 0, 5, 2);

            const narrowSides = rectangle.getNarrowSides();

            expect(narrowSides[0]).to.eql(new Line(new Point(5, 0), new Point(5, 2)));
            expect(narrowSides[1]).to.eql(new Line(new Point(0, 0), new Point(0, 2)));
        });

        it.only ('returns with the two narrower sides out of the four sides of the rectangle [HEIGHT is bigger]', () => {
            const rectangle = new Rectangle(0, 0, 2, 5);

            const narrowSides = rectangle.getNarrowSides();

            expect(narrowSides[0]).to.eql(new Line(new Point(0, 0), new Point(2, 0)));
            expect(narrowSides[1]).to.eql(new Line(new Point(0, 5), new Point(2, 5)));
        });
    });
});