import { LinesToGraphConverter } from './LinesToGraphConverter';
import {expect} from 'chai';

describe('LinesToGraphConverter', () => {
    describe('parse', () => {
        it('creates a graph which describes the map represented by the input string', () => {
            const linesToGraphConverter = new LinesToGraphConverter();
            const graph = linesToGraphConverter.parse([
                '######',
                '#WWWW#',
                '#W####',
                '######'
            ]);

            expect(graph.size()).to.equal(24);
            expect(graph.getAjacentEdges(0)).to.have.members([1, 6]);
            expect(graph.getAjacentEdges(1)).to.have.members([0, 2]);
            expect(graph.getAjacentEdges(8)).to.have.members([7, 9]);
            expect(graph.getAjacentEdges(23)).to.have.members([17, 22]);
        });
    });
});
