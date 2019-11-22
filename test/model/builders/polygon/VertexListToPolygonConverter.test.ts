import { setup } from "../../testUtils";
import { FileFormat } from "../../../../src/WorldGenerator";
import { TextWorldMapReader } from "../../../../src/model/readers/text/TextWorldMapReader";
import { PolygonFinderInGraph } from "../../../../src/model/builders/polygon/PolygonFinderInGraph";
import { VertexListToPolygonConverter } from '../../../../src/model/builders/polygon/VertexListToPolygonConverter';
import { Polygon, Point } from "@nightshifts.inc/geometry";


it ('Convert a list of graph vertexes to a polygon', () => {
    const worldMap = `
    map \`

    -------------
    -WWW---------
    -WW----------
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

    const polygonFinder = new PolygonFinderInGraph(graph);
    
    const vertexes = polygonFinder.findAPolygon();

    const polygon = new VertexListToPolygonConverter(graph).convert(vertexes);

    expect(polygon.equalTo(new Polygon(
        [
            new Point(1, 1),
            new Point(4, 1),
            new Point(3, 2),
            new Point(1, 2)
        ]
    ))).toBeTruthy();
});