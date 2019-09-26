import { minBy } from '../../../src/model/utils/Functions';


describe('minBy', () => {
    it ('returns the minimum value from a collection', () => {
        const collection = [11, 8, 2, 4, 3, 3, 5];

        const min = minBy<number>(collection, (a, b) => a - b);

        expect(min).toEqual(2);
    });
});