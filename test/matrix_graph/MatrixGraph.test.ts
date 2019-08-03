import { LinesToGraphConverter } from '../../src/matrix_graph/conversion/LinesToGraphConverter';


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
});
