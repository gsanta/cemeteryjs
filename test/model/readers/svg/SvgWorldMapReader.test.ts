import { SvgWorldMapReader } from '../../../../src/model/readers/svg/SvgWorldMapReader';

it ('Parse an svg world map and generate the corresponding world map graph', () => {
    var worldMap =
    `<svg data-wg-width="100" data-wg-height="50" data-wg-pixel-size="10">
        <rect width="10px" height="10px" x="410px" y="120px" fill="red" data-wg-x="10" data-wg-y="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="420px" y="120px" fill="red" data-wg-x="20" data-wg-y="10" data-wg-type="door"></rect>
        <rect width="10px" height="10px" x="420px" y="120px" fill="red" data-wg-x="30" data-wg-y="10" data-wg-type="wall"></rect>
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