import { minBy, arraysEqual } from '../../../../src/core/geometry/Functions';
import { Point } from '../../../../src/core/geometry/shapes/Point';


describe('minBy', () => {
    it ('returns the minimum value from a collection', () => {
        const collection = [11, 8, 2, 4, 3, 3, 5];

        const min = minBy<number>(collection, (a, b) => a - b);

        expect(min).toEqual(2);
    });
});

describe('arraysEqual', () => {

    it ('returns undefined if the two arrays are equal', () => {
        const points1 = [new Point(2, 1), new Point(1, 3)];
        const points2 = [new Point(1, 3), new Point(2, 1)];

        expect(arraysEqual(points1, points2)).toBeTruthy();
    });

    it ('returns the first item in arrary1 which is not found in array2', () => {
        const points1 = [new Point(2, 1), new Point(5, 6), new Point(1, 3)];
        const points2 = [new Point(1, 3), new Point(2, 1), new Point(3, 5)];

        expect(arraysEqual(points1, points2)).toBeFalsy();
    });
});