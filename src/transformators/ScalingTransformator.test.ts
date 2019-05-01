import { expect } from 'chai';
import { GwmWorldItem } from '..';
import { ScalingTransformator } from './ScalingTransformator';
import { Rectangle } from '@nightshifts.inc/geometry';

describe ('ScalingTransformator', () => {
    describe ('`transform`', () => {
        it ('scales the items', () => {
            const worldItem1 = new GwmWorldItem(null, new Rectangle(1, 2, 3, 4), 'item1');
            const worldItem2 = new GwmWorldItem(null, new Rectangle(4, 5, 6, 7), 'item2');

            const scalingWorldItemGenerator = new ScalingTransformator({x: 2, y: 3});
            scalingWorldItemGenerator.transform([worldItem1, worldItem2]);

            expect(worldItem1.dimensions).to.eql(new Rectangle(2, 6, 6, 12));
            expect(worldItem2.dimensions).to.eql(new Rectangle(8, 15, 12, 21));
        });
    });
});