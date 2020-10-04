import { toRadian } from "../../../../src/utils/geometry/Measurements";
import { Point } from "../../../../src/utils/geometry/shapes/Point";

describe('`Point`', () => {

    describe(`subtract`, () => {
        it ('returns the difference between this `Point` and the other `Point`', () => {
            const point = new Point(5, 5);
            const otherPoint = new Point(3, 3);

            expect(point.subtract(otherPoint)).toEqual(new Point(2, 2));
        });
    });

    describe('mul', () => {
        it ('muiltiplies the point', () => {
            const point = new Point(2, 3);
            
            expect(point.mul(3, 4)).toEqual(new Point(6, 12));
            expect(point.mul(2)).toEqual(new Point(4, 6));
        });
    });
});