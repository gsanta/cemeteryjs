import * as sinon from 'sinon';
import { GwmWorldItemGenerator } from '../GwmWorldItemGenerator';
import { Rectangle } from '../../model/Rectangle';
import { ScalingWorldItemGeneratorDecorator } from './ScalingWorldItemGeneratorDecorator';
import { MatrixGraph } from '../../matrix_graph/MatrixGraph';
import { expect } from 'chai';
import { GwmWorldItem } from '../..';

describe ('ScalingWorldItemGeneratorDecorator', () => {
    describe ('generate', () => {
        it ('gets the `GwmWorldItem`s from the decorated generator and scales them', () => {
            const graph: Partial<MatrixGraph> = {}

            const worldItem1 = new GwmWorldItem(null, new Rectangle(1, 2, 3, 4), 'item1');
            const worldItem2 = new GwmWorldItem(null, new Rectangle(4, 5, 6, 7), 'item2');

            const generateStub = sinon.stub().withArgs(graph).returns([worldItem1, worldItem2]);
            const decoratedWorldItemGenerator: Partial<GwmWorldItemGenerator> = {
                generate: generateStub
            };

            const scalingWorldItemGenerator = new ScalingWorldItemGeneratorDecorator(<GwmWorldItemGenerator> decoratedWorldItemGenerator, {x: 2, y: 3});
            scalingWorldItemGenerator.generate(<MatrixGraph> graph);

            expect(worldItem1.dimensions).to.eql(new Rectangle(2, 6, 6, 12));
            expect(worldItem2.dimensions).to.eql(new Rectangle(8, 15, 12, 21));
        });
    });
});