import { SvgWorldMapReader } from '../../../../src/model/readers/svg/SvgWorldMapReader';

it ('Parse an svg world map and generate the corresponding world map graph', () => {
    var worldMap =
    `<svg wg:width="10" wg:height="5">
        <rect width="10px" height="10px" x="410px" y="120px" fill="red" wg:x="1" wg:y="1" wg:type="wall"></rect>
        <rect width="10px" height="10px" x="420px" y="120px" fill="red" wg:x="2" wg:y="1" wg:type="door"></rect>
        <rect width="10px" height="10px" x="420px" y="120px" fill="red" wg:x="3" wg:y="1" wg:type="wall"></rect>
    </svg>`;
    

    const reader = new SvgWorldMapReader();

    const graph = reader.read(worldMap);

    expect(graph.size()).toEqual(3);
    expect(graph.getRows()).toEqual(5);
    expect(graph.getColumns()).toEqual(10);

    const vertex1 = graph.getVertexAtPosition({x: 1, y: 1});
    expect(graph.getVertexValue(vertex1)).toEqual('wall');

    const vertex2 = graph.getVertexAtPosition({x: 2, y: 1});
    expect(graph.getVertexValue(vertex2)).toEqual('door');

    const vertex3 = graph.getVertexAtPosition({x: 3, y: 1});
    expect(graph.getVertexValue(vertex3)).toEqual('wall');
});