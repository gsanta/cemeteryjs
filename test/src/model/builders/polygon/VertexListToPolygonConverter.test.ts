import { setup } from "../../../../testUtils";
import { FileFormat } from "../../../../../src/WorldGenerator";
import { TextWorldMapReader } from "../../../../../src/model/readers/text/TextWorldMapReader";
import { PolygonVertexListFinder } from "../../../../../src/model/builders/polygon/PolygonVertexListFinder";
import { VertexListToPolygonConverter } from '../../../../../src/model/builders/polygon/VertexListToPolygonConverter';
import { Polygon, Point } from "@nightshifts.inc/geometry";

describe('Convert the polygon vertices in the graph to a polygon object', () => {
    function getPolygon(worldMap: string): Polygon {
        const services = setup(worldMap, FileFormat.TEXT);
        const worldMapReader = new TextWorldMapReader(services.configService);
        const graph = worldMapReader.read(worldMap).getReducedGraphForTypes(['building']);
    
        const vertexListToPolygonConverter = new VertexListToPolygonConverter();
        const polygonVertexListFinder = new PolygonVertexListFinder();
        const vertexes = polygonVertexListFinder.findVertexes(graph);
        return vertexListToPolygonConverter.convert(vertexes, graph);
    }

    it ('when it is an U shaped polygon rotated to the right', () => {
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
    
        const polygon = getPolygon(worldMap);
    
        expect(polygon.equalTo(new Polygon(
            [
                new Point(1, 1),
                new Point(1, 7),
                new Point(8, 7),
                new Point(8, 5),
                new Point(6, 5),
                new Point(6, 3),
                new Point(8, 3),
                new Point(8, 1)
            ]
        ))).toBeTruthy();
    });

    it ('when it is a T shaped polygon upside down', () => {
        const worldMap = `
            map \`
        
            -------------
            ---WWW-------
            ---WWW-------
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
    
        const polygon = getPolygon(worldMap);
    
        expect(polygon.equalTo(new Polygon(
            [
                new Point(3, 1),
                new Point(3, 3),
                new Point(1, 3),
                new Point(1, 5),
                new Point(8, 5),
                new Point(8, 3),
                new Point(6, 3),
                new Point(6, 1)
            ]
        ))).toBeTruthy();
    });

    it ('when it is a T shaped polygon', () => {
        const worldMap = `
            map \`
        
            -------------
            -WWWWWWW-----
            -WWWWWWW-----
            ---WWW-------
            ---WWW-------
            -------------
        
            \`
        
            definitions \`
        
            - = empty
            W = building
        
            \`
        `;
    
        const polygon = getPolygon(worldMap);
    
        expect(polygon.equalTo(new Polygon(
            [
                new Point(1, 1),
                new Point(1, 3),
                new Point(3, 3),
                new Point(3, 5),
                new Point(6, 5),
                new Point(6, 3),
                new Point(8, 3),
                new Point(8, 1)
            ]
        ))).toBeTruthy();
    });

    it ('when it is a T shaped polygon rotated to the right', () => {
        const worldMap = `
            map \`
        
            -------------
            ----WWWW-----
            -WWWWWWW-----
            -WWWWWWW-----
            ----WWWW-----
            -------------
        
            \`
        
            definitions \`
        
            - = empty
            W = building
        
            \`
        `;
    
        const polygon = getPolygon(worldMap);
    
        expect(polygon.equalTo(new Polygon(
            [
                new Point(4, 1),
                new Point(4, 2),
                new Point(1, 2),
                new Point(1, 4),
                new Point(4, 4),
                new Point(4, 5),
                new Point(8, 5),
                new Point(8, 1)
            ]
        ))).toBeTruthy();
    });

    it ('when it is a T shaped polygon rotated to the left', () => {
        const worldMap = `
            map \`
        
            -----------
            --WWWW-----
            --WWWWWWW--
            --WWWWWWW--
            --WWWW-----
            -----------
        
            \`
        
            definitions \`
        
            - = empty
            W = building
        
            \`
        `;
    
        const polygon = getPolygon(worldMap);
    
        expect(polygon.equalTo(new Polygon(
            [
                new Point(2, 1),
                new Point(2, 5),
                new Point(6, 5),
                new Point(6, 4),
                new Point(9, 4),
                new Point(9, 2),
                new Point(6, 2),
                new Point(6, 1)
            ]
        ))).toBeTruthy();
    });
    
    it ('when it is an L shaped polygon', () => {
        const worldMap = `
            map \`
        
            -------------
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
    
        const polygon = getPolygon(worldMap);

        expect(polygon.equalTo(new Polygon(
            [
                new Point(1, 1),
                new Point(1, 5),
                new Point(8, 5),
                new Point(8, 3),
                new Point(6, 3),
                new Point(6, 1)
            ]
        ))).toBeTruthy();
    });
});


