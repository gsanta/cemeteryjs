import { TextWorldMapReader } from '../../../../src/model/readers/text/TextWorldMapReader';
import { setup } from '../../testUtils';
import { FileFormat } from '../../../../src/WorldGenerator';
import { PolygonVertexListFinder } from '../../../../src/model/builders/polygon/PolygonVertexListFinder';


it ('Find a polygon in the graph', () => {

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

    const polygonFinder = new PolygonVertexListFinder(graph);
    
    const polygon = polygonFinder.findAPolygon();
    const positions = polygon.map(vertex => graph.getVertexPositionInMatrix(vertex));
    1;
});