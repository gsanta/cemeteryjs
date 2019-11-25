import { setup } from "../../testUtils";
import { FileFormat } from "../../../../src/WorldGenerator";
import { TextWorldMapReader } from "../../../../src/model/readers/text/TextWorldMapReader";
import { PolygonVertexListFinder } from "../../../../src/model/builders/polygon/PolygonVertexListFinder";
import { VertexListToPolygonConverter } from '../../../../src/model/builders/polygon/VertexListToPolygonConverter';
import { Polygon, Point } from "@nightshifts.inc/geometry";


it ('Convert a list of graph vertexes to a polygon', () => {
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

    const services = setup(worldMap, FileFormat.TEXT);

    const worldMapReader = new TextWorldMapReader(services.configService);
    const graph = worldMapReader.read(worldMap).getReducedGraphForTypes(['building']);

    const polygonFinder = new PolygonVertexListFinder();
    
    const vertexes = polygonFinder.findVertexes(graph);

    const polygon = new VertexListToPolygonConverter().convert(vertexes, graph);

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

it ('Convert a list of graph vertexes to a polygon', () => {
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

    const services = setup(worldMap, FileFormat.TEXT);

    const worldMapReader = new TextWorldMapReader(services.configService);
    const graph = worldMapReader.read(worldMap).getReducedGraphForTypes(['building']);

    const polygonFinder = new PolygonVertexListFinder();
    
    const vertexes = polygonFinder.findVertexes(graph);

    const polygon = new VertexListToPolygonConverter().convert(vertexes, graph);

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



it ('Convert a list of graph vertexes to a polygon', () => {
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

    const services = setup(worldMap, FileFormat.TEXT);

    const worldMapReader = new TextWorldMapReader(services.configService);
    const graph = worldMapReader.read(worldMap).getReducedGraphForTypes(['building']);

    const polygonFinder = new PolygonVertexListFinder();
    
    const vertexes = polygonFinder.findVertexes(graph);

    const polygon = new VertexListToPolygonConverter().convert(vertexes, graph);

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