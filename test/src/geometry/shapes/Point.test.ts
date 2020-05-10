import { toRadian } from "../../../../src/core/geometry/utils/Measurements";
import { Point } from "../../../../src/core/geometry/shapes/Point";

describe('`Point`', () => {
    describe('`distanceTo`', () => {
        it ('returns the x and y distance from the other `Point`', () => {
            const point = new Point(2, 3);
            const otherPoint = new Point(4, -2);

            expect(point.absoluteDistanceTo(otherPoint)).toEqual([2, 5]);
        });
    });

    describe(`subtract`, () => {
        it ('returns the difference between this `Point` and the other `Point`', () => {
            const point = new Point(5, 5);
            const otherPoint = new Point(3, 3);

            expect(point.subtract(otherPoint)).toEqual(new Point(2, 2));
        });
    });

    describe(`distanceTo`, () => {
        it ('calculates the distance to another `Point`', () => {
            const point1 = new Point(2, 2);
            const point2 = new Point(4, 4);

            expect(point1.distanceTo(point2)).toEqual(2*Math.SQRT2);
        });
    });

    describe(`distanceToOrigin`, () => {
        it ('calculates the distance to the origin', () => {
            const point = new Point(5, 3);

            expect(point.distanceToOrigin()).toEqual(Math.sqrt(25 + 9));
        });
    });

    describe(`normalize`, () => {
        it ('normalizes the `Point`', () => {
            const point = new Point(2, 0);

            expect(point.normalize()).toEqual(new Point(1, 0));
        });

        it ('works well with negative numbers', () => {
            const point = new Point(-2, 0);

            expect(point.normalize()).toEqual(new Point(-1, 0));
        });
    });

    describe(`angleTo`, () => {
        it ('calculates the angle between the two `Point`s', () => {
            const point1 = new Point(0, 3);
            const point2 = new Point(2, 0);

            expect(point1.angleTo(point2)).toEqual(toRadian(90));
        });


        it ('works well with negative angles', () => {
            const point1 = new Point(0, 3);
            const point2 = new Point(2, 0);

            expect(point2.angleTo(point1)).toEqual(toRadian(-90));
        });
    });

    describe('mul', () => {
        it ('muiltiplies the point', () => {
            const point = new Point(2, 3);
            
            expect(point.mul(3, 4)).toEqual(new Point(6, 12));
            expect(point.mul(2)).toEqual(new Point(4, 6));
        });
    });

    describe('limit', () => {
        it ('limits the len of the vector', () => {
            const vec = new Point(5, 0);
            vec.limit(4);
            expect(vec.len()).toEqual(4);
        });

        it ('does nothing if the length is smaller than the limit', () => {
            const vec = new Point(3, 0);
            vec.limit(5);
            expect(vec.len()).toEqual(3);
        });
    });
});