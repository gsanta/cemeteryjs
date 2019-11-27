import { Direction, PolygonVertexListFinder } from '../../../../src/model/builders/polygon/PolygonVertexListFinder';
import { TextWorldMapReader } from '../../../../src/model/readers/text/TextWorldMapReader';
import { FileFormat } from '../../../../src/WorldGenerator';
import { setup } from '../../testUtils';

describe('Find the vertices of a polygon in the graph', () => {
    function getVertices(worldMap: string): [{x: number, y: number}[], Direction[], boolean[]] {
        const services = setup(worldMap, FileFormat.TEXT);
        const worldMapReader = new TextWorldMapReader(services.configService);
        const graph = worldMapReader.read(worldMap).getReducedGraphForTypes(['building']);
    
        const vertices = new PolygonVertexListFinder().findVertexes(graph);

        const positions = vertices.map(vertex => graph.getNodePositionInMatrix(vertex.nodeIndex));
        const directions = vertices.map(vertex => vertex.direction);
        const convexness = vertices.map(vertex => vertex.isConvex);

        return [positions, directions, convexness];

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

        const [positions, directions, convexness] = getVertices(worldMap);

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

    it ('when the polygon is one row (length of 2)', () => {
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

        const [positions, directions, convexness] = getVertices(worldMap);

        expect(positions).toEqual([
            {x: 1, y: 1},
            {x: 2, y: 1},
            {x: 2, y: 1},
            {x: 1, y: 1}
        ]);

        expect(directions).toEqual(['up', 'right', 'down', 'left']);
        expect(convexness).toEqual([true, true, true, true]);
    });

    it ('when the polygon is one row (length of 4)', () => {
        const worldMap = `
        map \`
    
        ------
        -WWWW-
        ------
        ------
    
        \`
    
        definitions \`
    
        - = empty
        W = building
    
        \`
        `;

        const [positions, directions, convexness] = getVertices(worldMap);

        expect(positions).toEqual([
            {x: 1, y: 1},
            {x: 4, y: 1},
            {x: 4, y: 1},
            {x: 1, y: 1}
        ]);

        expect(directions).toEqual(['up', 'right', 'down', 'left']);
        expect(convexness).toEqual([true, true, true, true]);
    });

    it ('when the polygon is one column (length of 2)', () => {
        const worldMap = `
        map \`
    
        ------
        -W----
        -W----
        ------
    
        \`
    
        definitions \`
    
        - = empty
        W = building
    
        \`
        `;

        const [positions, directions, convexness] = getVertices(worldMap);

        expect(positions).toEqual([
            {x: 1, y: 1},
            {x: 1, y: 1},
            {x: 1, y: 2},
            {x: 1, y: 2}
        ]);

        expect(directions).toEqual(['up', 'right', 'down', 'left']);
        expect(convexness).toEqual([true, true, true, true]);
    });

    it ('when the polygon is one column (length of 4)', () => {
        const worldMap = `
        map \`
    
        ------
        -W----
        -W----
        -W----
        -W----
        ------
    
        \`
    
        definitions \`
    
        - = empty
        W = building
    
        \`
        `;

        const [positions, directions, convexness] = getVertices(worldMap);

        expect(positions).toEqual([
            {x: 1, y: 1},
            {x: 1, y: 1},
            {x: 1, y: 4},
            {x: 1, y: 4}
        ]);

        expect(directions).toEqual(['up', 'right', 'down', 'left']);
        expect(convexness).toEqual([true, true, true, true]);
    });

    it ('when the polygon is one character', () => {
        const worldMap = `
        map \`
    
        ------
        -W----
        ------
        ------
    
        \`
    
        definitions \`
    
        - = empty
        W = building
    
        \`
        `;

        const [positions, directions, convexness] = getVertices(worldMap);

        expect(positions).toEqual([
            {x: 1, y: 1},
            {x: 1, y: 1},
            {x: 1, y: 1},
            {x: 1, y: 1}
        ]);

        expect(directions).toEqual(['up', 'right', 'down', 'left']);
        expect(convexness).toEqual([true, true, true, true]);
    });

    it ('when the polygon is "stair" shaped', () => {
        const worldMap = `
        map \`
    
        ----------
        ---WWWW---
        --WW-----
        -WW-------
        ----------
    
        \`
    
        definitions \`
    
        - = empty
        W = building
    
        \`
        `;

        const [positions, directions, convexness] = getVertices(worldMap);

        expect(positions).toEqual([
            {x: 3, y: 1},
            {x: 6, y: 1},
            {x: 6, y: 1},
            {x: 3, y: 1},
            {x: 3, y: 2},
            {x: 2, y: 2},
            {x: 2, y: 3},
            {x: 1, y: 3},
            {x: 1, y: 3},
            {x: 2, y: 3},
            {x: 2, y: 2},
            {x: 3, y: 2}
        ]);

        expect(directions).toEqual(['up', 'right', 'down', 'left', 'down', 'left', 'down', 'left', 'up', 'right', 'up', 'right']);
        expect(convexness).toEqual([true, true, true, false, true, false, true, true, true, false, true, false]);
    });
});