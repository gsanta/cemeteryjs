import { Direction, PolygonVertexListFinder } from '../../../../../../src/world_generator/importers/builders/polygon/PolygonVertexListFinder';
import { TextWorldMapReader } from '../../../../../../src/world_generator/importers/text/TextWorldMapReader';
import { FileFormat } from '../../../../../../src/WorldGenerator';
import { setup } from '../../../../../testUtils';
import { Point } from '../../../../../../src/model/geometry/shapes/Point';

describe('Find the vertices of a polygon in the graph', () => {
    function getVertices(worldMap: string): [{x: number, y: number}[], Direction[], boolean[]] {
        const services = setup(worldMap, FileFormat.TEXT);
        const worldMapReader = new TextWorldMapReader(services);
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
            new Point(1, 1),
            new Point(7, 1),
            new Point(7, 2),
            new Point(5, 2),
            new Point(5, 5),
            new Point(7, 5),
            new Point(7, 6),
            new Point(1, 6)
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
            new Point(1, 1),
            new Point(2, 1),
            new Point(2, 1),
            new Point(1, 1)
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
            new Point(1, 1),
            new Point(4, 1),
            new Point(4, 1),
            new Point(1, 1)
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
            new Point(1, 1),
            new Point(1, 1),
            new Point(1, 2),
            new Point(1, 2)
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
            new Point(1, 1),
            new Point(1, 1),
            new Point(1, 4),
            new Point(1, 4)
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
            new Point(1, 1),
            new Point(1, 1),
            new Point(1, 1),
            new Point(1, 1)
        ]);

        expect(directions).toEqual(['up', 'right', 'down', 'left']);
        expect(convexness).toEqual([true, true, true, true]);
    });

    it ('when the polygon is "stair" shaped', () => {
        const worldMap = `
        map \`
    
        ----------
        ---WWWW---
        --WW------
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
            new Point(3, 1),
            new Point(6, 1),
            new Point(6, 1),
            new Point(3, 1),
            new Point(3, 2),
            new Point(2, 2),
            new Point(2, 3),
            new Point(1, 3),
            new Point(1, 3),
            new Point(2, 3),
            new Point(2, 2),
            new Point(3, 2)
        ]);

        expect(directions).toEqual(['up', 'right', 'down', 'left', 'down', 'left', 'down', 'left', 'up', 'right', 'up', 'right']);
        expect(convexness).toEqual([true, true, true, false, true, false, true, true, true, false, true, false]);
    });
});