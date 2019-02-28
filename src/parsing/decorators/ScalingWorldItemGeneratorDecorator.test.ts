import * as sinon from 'sinon';
import { WorldItemGenerator } from '../WorldItemGenerator';
import { Rectangle } from '../../model/Rectangle';
import { WorldItem } from '../..';
import { ScalingWorldItemGeneratorDecorator } from './ScalingWorldItemGeneratorDecorator';
import { MatrixGraph } from '../../matrix_graph/MatrixGraph';
import { expect } from 'chai';

describe ('ScalingWorldItemGeneratorDecorator', () => {
    describe ('generate', () => {
        it ('gets the `WorldItem`s from the decorated generator and scales them', () => {
            const graph: Partial<MatrixGraph> = {}

            const worldItem1 = new WorldItem(null, new Rectangle(1, 2, 3, 4), 'item1');
            const worldItem2 = new WorldItem(null, new Rectangle(4, 5, 6, 7), 'item2');

            const generateStub = sinon.stub().withArgs(graph).returns([worldItem1, worldItem2]);
            const decoratedWorldItemGenerator: Partial<WorldItemGenerator> = {
                generate: generateStub
            };

            const scalingWorldItemGenerator = new ScalingWorldItemGeneratorDecorator(<WorldItemGenerator> decoratedWorldItemGenerator, {x: 2, y: 3});
            scalingWorldItemGenerator.generate(<MatrixGraph> graph);

            expect(worldItem1.dimensions).to.eql(new Rectangle(2, 6, 6, 12));
            expect(worldItem2.dimensions).to.eql(new Rectangle(8, 15, 12, 21));
        });
    });
});