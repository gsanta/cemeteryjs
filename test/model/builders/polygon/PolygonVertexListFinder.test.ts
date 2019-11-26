import { TextWorldMapReader } from '../../../../src/model/readers/text/TextWorldMapReader';
import { setup } from '../../testUtils';
import { FileFormat } from '../../../../src/WorldGenerator';
import { PolygonVertexListFinder, PolygonVertex } from '../../../../src/model/builders/polygon/PolygonVertexListFinder';
import { WorldMapGraph } from '../../../../src/WorldMapGraph';

describe('Find the vertices of a polygon in the graph', () => {
    function getVertices(worldMap: string): [PolygonVertex[], WorldMapGraph] {
        const services = setup(worldMap, FileFormat.TEXT);
        const worldMapReader = new TextWorldMapReader(services.configService);
        const graph = worldMapReader.read(worldMap).getReducedGraphForTypes(['building']);
    
        return [new PolygonVertexListFinder().findVertexes(graph), graph];

    }
    
    it ('when the polygon is concave', () => {
        const worldMap = `
        map \`
    
        -------------
        -WWWWWWW-----
        -WWWWWWW-----
        -WWWWW-------
        -WWWWW-------
        -WWWWWWW-----
        -WWWWWWW-----
        -------------
        -------------
    
        \`
    
        definitions \`
    
        - = empty
        W = building
    
        \`
        `;

        const [vertices, graph] = getVertices(worldMap);

        const positions = vertices.map(vertex => graph.getNodePositionInMatrix(vertex.nodeIndex));
        const directions = vertices.map(vertex => vertex.direction);
        const convexness = vertices.map(vertex => vertex.isConvex);

        expect(positions).toEqual([
            {x: 1, y: 1},
            {x: 7, y: 1},
            {x: 7, y: 2},
            {x: 5, y: 2},
            {x: 5, y: 5},
            {x: 7, y: 5},
            {x: 7, y: 6},
            {x: 1, y: 6}
        ]);

        expect(directions).toEqual(['up', 'right', 'down', 'left', 'down', 'right', 'down', 'left']);
        expect(convexness).toEqual([true, true, true, false, false, true, true, true]);
    });

    it ('When the polygon consists of only two points', () => {
        const worldMap = `
        map \`
    
        ------
        -WW---
        ------
        ------
    
        \`
    
        definitions \`
    
        - = empty
        W = building
    
        \`
        `;

        const [vertices, graph] = getVertices(worldMap);

        const positions = vertices.map(vertex => graph.getNodePositionInMatrix(vertex.nodeIndex));
        const directions = vertices.map(vertex => vertex.direction);
        const convexness = vertices.map(vertex => vertex.isConvex);

        expect(positions).toEqual([
            {x: 1, y: 1},
            {x: 2, y: 1},
            {x: 2, y: 1},
            {x: 1, y: 1}
        ]);

        expect(directions).toEqual(['right', 'down', 'left', 'down', 'right', 'down', 'left', 'up']);
        expect(convexness).toEqual([true, true, false, false, true, true, true, true]);
    });
});