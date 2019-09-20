import { LinesToGraphConverter } from '../../../src/model/parsers/reader/LinesToGraphConverter';


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
                },
                {}
            );

            const reducedGraph = graph.getGraphForVertexValue('W');

            expect(reducedGraph.size()).toEqual(6);
        });
    });

    describe('createConnectedComponentGraphsForCharacter', () => {
        it ('separates the graph into multiple sub-graphs where each graph contains only' +
         'the given characters, and are all `connected-component`s', () => {
            const input = [
                '--------',
                '-RRR-RR-',
                '-RRR-RR-',
                '-RRR----',
                '--------',
            ];

            const linesToGraphConverter = new LinesToGraphConverter();
            const graph = linesToGraphConverter.parse(
                input,
                {
                    R: 'room',
                    '-': 'wall'
                },
                {}
            );

            const connectedComponentGraphs = graph.createConnectedComponentGraphsForCharacter('R');

            expect(connectedComponentGraphs.length).toEqual(2);
            expect(connectedComponentGraphs[0].getAllVertices().length).toEqual(9)
            expect(connectedComponentGraphs[1].getAllVertices().length).toEqual(4)
         });
    });

    describe('getReducedGraphForCharacters', () => {
        it ('returns a reduced graph that contains only the provided characters', () => {
            const input = [
                '##DDD########',
                '#------#----#',
                'D------#----#',
                'D------#----#',
                '#############',
            ];

            const linesToGraphConverter = new LinesToGraphConverter();
            const graph = linesToGraphConverter.parse(
                input,
                {
                    '-': 'room',
                    '#': 'wall',
                    D: 'door'
                },
                {}
            );

            const reducedGraph = graph.getReducedGraphForCharacters(['#', 'D']);

            expect(reducedGraph.getVertexAtPosition({x: 0, y: 0})).not.toBeNull();
            expect(reducedGraph.getVertexAtPosition({x: 2, y: 0})).not.toBeNull();
            expect(reducedGraph.getVertexAtPosition({x: 12, y: 0})).not.toBeNull();
            expect(reducedGraph.getVertexAtPosition({x: 12, y: 1})).not.toBeNull();
            expect(reducedGraph.getVertexAtPosition({x: 12, y: 4})).not.toBeNull();
            expect(reducedGraph.getVertexAtPosition({x: 0, y: 4})).not.toBeNull();
            expect(reducedGraph.getVertexAtPosition({x: 7, y: 1})).not.toBeNull();

            expect(reducedGraph.getVertexAtPosition({x: 1, y: 1})).toBeNull();
            expect(reducedGraph.getVertexAtPosition({x: 11, y: 1})).toBeNull();
            expect(reducedGraph.getVertexAtPosition({x: 1, y: 3})).toBeNull();
            expect(reducedGraph.getVertexAtPosition({x: 11, y: 3})).toBeNull();
        });
    });
});
