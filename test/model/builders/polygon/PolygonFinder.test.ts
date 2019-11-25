import { TextWorldMapReader } from '../../../../src/model/readers/text/TextWorldMapReader';
import { setup } from '../../testUtils';
import { FileFormat } from '../../../../src/WorldGenerator';
import { PolygonVertexListFinder } from '../../../../src/model/builders/polygon/PolygonVertexListFinder';
import { ServiceFacade } from '../../../../src/model/services/ServiceFacade';
import { WorldMapGraph } from '../../../../src/WorldMapGraph';

function init(worldMap: string): [ServiceFacade<any, any, any>, WorldMapGraph] {
    const services = setup(worldMap, FileFormat.TEXT);
    const worldMapReader = new TextWorldMapReader(services.configService);
    const graph = worldMapReader.read(worldMap).getReducedGraphForTypes(['building']);

    return [services, graph];
}

describe('Find a polygon', () => {
    let polygonVertexFinder: PolygonVertexListFinder;

    beforeEach(() => {
        polygonVertexFinder = new PolygonVertexListFinder();
    });

    
    it ('When the polygon is concave', () => {
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

        const [services, graph] = init(worldMap);

        const polygon = polygonVertexFinder.findVertexes(graph);
        const points = polygon.map(vertex => graph.getNodePositionInMatrix(vertex.nodeIndex));
        
        expect(points).toEqual([
            {x: 7, y: 1},
            {x: 7, y: 2},
            {x: 5, y: 2},
            {x: 5, y: 5},
            {x: 7, y: 5},
            {x: 7, y: 6},
            {x: 1, y: 6},
            {x: 1, y: 1}
        ]);
    });
});


// it ('Find a polygon in the graph', () => {

//     const worldMap = `
//     map \`

//     -------------
//     -WWW---------
//     -WW----------
//     -------------
//     -------------

//     \`

//     definitions \`

//     - = empty
//     W = building

//     \`
// `;
    
    // const polygon = polygonFinder.findVertexes(graph);
    // const positions = polygon.map(vertex => graph.getVertexPositionInMatrix(vertex));
    // 1;
// });