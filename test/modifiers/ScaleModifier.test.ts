import { ScaleModifier } from '../../src/modifiers/ScaleModifier';
import { WorldItem } from '../../src/WorldItem';
import { Polygon } from '@nightshifts.inc/geometry';
import { ConfigService } from '../../src/services/ConfigService';

describe ('ScaleModifier', () => {
    describe ('`apply`', () => {
        it ('scales the items', () => {
            const worldItem1 = new WorldItem('1', null, Polygon.createRectangle(1, 2, 3, 4), 'item1');
            const worldItem2 = new WorldItem('2', null, Polygon.createRectangle(4, 5, 6, 7), 'item2');

            const scalingWorldItemGenerator = new ScaleModifier(<ConfigService> {scaling: {x: 2, y: 3}});
            scalingWorldItemGenerator.apply([worldItem1, worldItem2]);

            expect(worldItem1.dimensions).toEqual(Polygon.createRectangle(2, 6, 6, 12));
            expect(worldItem2.dimensions).toEqual(Polygon.createRectangle(8, 15, 12, 21));
        });
    });
});