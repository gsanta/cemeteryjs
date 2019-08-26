import { ScalingTransformator } from '../../src/transformators/ScalingTransformator';
import { WorldItemInfo } from '../../src/WorldItemInfo';
import { Polygon } from '@nightshifts.inc/geometry';

describe ('ScalingTransformator', () => {
    describe ('`transform`', () => {
        it ('scales the items', () => {
            const worldItem1 = new WorldItemInfo('1', null, Polygon.createRectangle(1, 2, 3, 4), 'item1');
            const worldItem2 = new WorldItemInfo('2', null, Polygon.createRectangle(4, 5, 6, 7), 'item2');

            const scalingWorldItemGenerator = new ScalingTransformator({x: 2, y: 3});
            scalingWorldItemGenerator.transform([worldItem1, worldItem2]);

            expect(worldItem1.dimensions).toEqual(Polygon.createRectangle(2, 6, 6, 12));
            expect(worldItem2.dimensions).toEqual(Polygon.createRectangle(8, 15, 12, 21));
        });
    });
});