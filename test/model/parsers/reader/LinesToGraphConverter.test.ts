import { LinesToGraphConverter } from '../../../../src/model/parsers/reader/LinesToGraphConverter';

describe('LinesToGraphConverter', () => {
    describe('parse', () => {
        it('creates a graph which describes the map represented by the input string', () => {
            const linesToGraphConverter = new LinesToGraphConverter();
            const graph = linesToGraphConverter.parse(
                [
                    '######',
                    '#WWWW#',
                    '#W####',
                    '######'
                ],
                {
                    W: 'wall',
                    '#': 'empty'
                },
                {}
            );
            expect(graph.size()).toEqual(24);
            expect(graph.getAjacentEdges(0)).toEqual(expect.arrayContaining([1, 6]));
            expect(graph.getAjacentEdges(1)).toEqual(expect.arrayContaining([0, 2]));
            expect(graph.getAjacentEdges(8)).toEqual(expect.arrayContaining([7, 9]));
            expect(graph.getAjacentEdges(23)).toEqual(expect.arrayContaining([17, 22]));
        });
    });
});
