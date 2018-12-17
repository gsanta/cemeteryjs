import { LinesToGraphConverter } from './LinesToGraphConverter';
import { expect } from 'chai';


describe('MatrixGraph', () => {
    describe('getGraphForVertexValue', () => {
        it('returns a graph where all the vertices contain the given value', () => {

            const input = [
                '##WW##',
                '######',
                '##W###',
                '##W###',
                '##WW##',
            ];

            const linesToGraphConverter = new LinesToGraphConverter();
            const graph = linesToGraphConverter.parse(
                input,
                {
                    W: 'wall',
                    '#': 'empty'
                }
            );

            const reducedGraph = graph.getGraphForVertexValue('W');

            expect(reducedGraph.size()).to.equal(6);
        });
    });
});
