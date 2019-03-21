import { Line } from "./Line";
import { Point } from "./Point";
import { expect } from "chai";


describe('Line', () => {
    describe ('equalTo', () => {
        it ('returns true if the two lines have equal endpoints', () => {
            const line1 = new Line(new Point(1, 2), new Point(3, 4));
            const line2 = new Line(new Point(1, 2), new Point(3, 4));

            expect(line1.equalTo(line2)).to.be.true;
        });

        it ('returns true if the two lines are equal but the endpoints are given in reverse order', () => {
            const line1 = new Line(new Point(1, 2), new Point(3, 4));
            const line2 = new Line(new Point(3, 4), new Point(1, 2));

            expect(line1.equalTo(line2)).to.be.true;
        });
    });
});