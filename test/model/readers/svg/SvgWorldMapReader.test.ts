import { SvgWorldMapReader } from '../../../../src/model/readers/svg/SvgWorldMapReader';
import { Point } from '@nightshifts.inc/geometry';

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

    const vertex1 = graph.getNodeAtPosition(new Point(1, 1));
    expect(graph.getNodeValue(vertex1)).toEqual('wall');

    const vertex2 = graph.getNodeAtPosition(new Point(2, 1));
    expect(graph.getNodeValue(vertex2)).toEqual('door');

    const vertex3 = graph.getNodeAtPosition(new Point(3, 1));
    expect(graph.getNodeValue(vertex3)).toEqual('wall');
});


it ('Configure to remove empty frame', () => {
    var worldMap =
    `<svg data-wg-width="100" data-wg-height="50" data-wg-pixel-size="10">
        <rect width="10px" height="10px" x="410px" y="120px" fill="red" data-wg-x="50" data-wg-y="40" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="420px" y="120px" fill="red" data-wg-x="60" data-wg-y="40" data-wg-type="door"></rect>
        <rect width="10px" height="10px" x="420px" y="120px" fill="red" data-wg-x="70" data-wg-y="40" data-wg-type="wall"></rect>
    </svg>`;
    

    const reader = new SvgWorldMapReader(true);

    const graph = reader.read(worldMap);

    expect(graph.size()).toEqual(3);
    expect(graph.getRows()).toEqual(1);
    expect(graph.getColumns()).toEqual(3);

    const vertex1 = graph.getNodeAtPosition(new Point(0, 0));
    expect(graph.getNodeValue(vertex1)).toEqual('wall');

    const vertex2 = graph.getNodeAtPosition(new Point(1, 0));
    expect(graph.getNodeValue(vertex2)).toEqual('door');

    const vertex3 = graph.getNodeAtPosition(new Point(2, 0));
    expect(graph.getNodeValue(vertex3)).toEqual('wall');
});

it ('Parse a real world svg example', () => {
    const worldMap = 
    `
    <svg data-wg-pixel-size="10" data-wg-width="1500" data-wg-height="1000" class="sc-bxivhb eycvSb">
    <line x1="0" y1="0" x2="1500" y2="0" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="10" x2="1500" y2="10" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="20" x2="1500" y2="20" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="30" x2="1500" y2="30" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="40" x2="1500" y2="40" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="50" x2="1500" y2="50" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="60" x2="1500" y2="60" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="70" x2="1500" y2="70" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="80" x2="1500" y2="80" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="90" x2="1500" y2="90" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="100" x2="1500" y2="100" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="110" x2="1500" y2="110" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="120" x2="1500" y2="120" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="130" x2="1500" y2="130" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="140" x2="1500" y2="140" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="150" x2="1500" y2="150" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="160" x2="1500" y2="160" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="170" x2="1500" y2="170" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="180" x2="1500" y2="180" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="190" x2="1500" y2="190" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="200" x2="1500" y2="200" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="210" x2="1500" y2="210" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="220" x2="1500" y2="220" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="230" x2="1500" y2="230" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="240" x2="1500" y2="240" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="250" x2="1500" y2="250" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="260" x2="1500" y2="260" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="270" x2="1500" y2="270" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="280" x2="1500" y2="280" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="290" x2="1500" y2="290" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="300" x2="1500" y2="300" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="310" x2="1500" y2="310" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="320" x2="1500" y2="320" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="330" x2="1500" y2="330" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="340" x2="1500" y2="340" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="350" x2="1500" y2="350" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="360" x2="1500" y2="360" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="370" x2="1500" y2="370" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="380" x2="1500" y2="380" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="390" x2="1500" y2="390" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="400" x2="1500" y2="400" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="410" x2="1500" y2="410" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="420" x2="1500" y2="420" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="430" x2="1500" y2="430" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="440" x2="1500" y2="440" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="450" x2="1500" y2="450" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="460" x2="1500" y2="460" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="470" x2="1500" y2="470" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="480" x2="1500" y2="480" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="490" x2="1500" y2="490" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="500" x2="1500" y2="500" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="510" x2="1500" y2="510" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="520" x2="1500" y2="520" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="530" x2="1500" y2="530" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="540" x2="1500" y2="540" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="550" x2="1500" y2="550" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="560" x2="1500" y2="560" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="570" x2="1500" y2="570" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="580" x2="1500" y2="580" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="590" x2="1500" y2="590" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="600" x2="1500" y2="600" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="610" x2="1500" y2="610" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="620" x2="1500" y2="620" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="630" x2="1500" y2="630" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="640" x2="1500" y2="640" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="650" x2="1500" y2="650" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="660" x2="1500" y2="660" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="670" x2="1500" y2="670" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="680" x2="1500" y2="680" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="690" x2="1500" y2="690" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="700" x2="1500" y2="700" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="710" x2="1500" y2="710" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="720" x2="1500" y2="720" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="730" x2="1500" y2="730" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="740" x2="1500" y2="740" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="750" x2="1500" y2="750" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="760" x2="1500" y2="760" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="770" x2="1500" y2="770" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="780" x2="1500" y2="780" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="790" x2="1500" y2="790" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="800" x2="1500" y2="800" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="810" x2="1500" y2="810" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="820" x2="1500" y2="820" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="830" x2="1500" y2="830" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="840" x2="1500" y2="840" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="850" x2="1500" y2="850" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="860" x2="1500" y2="860" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="870" x2="1500" y2="870" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="880" x2="1500" y2="880" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="890" x2="1500" y2="890" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="900" x2="1500" y2="900" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="910" x2="1500" y2="910" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="920" x2="1500" y2="920" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="930" x2="1500" y2="930" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="940" x2="1500" y2="940" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="950" x2="1500" y2="950" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="960" x2="1500" y2="960" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="970" x2="1500" y2="970" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="980" x2="1500" y2="980" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="990" x2="1500" y2="990" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="0" y1="0" x2="0" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="10" y1="0" x2="10" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="20" y1="0" x2="20" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="30" y1="0" x2="30" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="40" y1="0" x2="40" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="50" y1="0" x2="50" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="60" y1="0" x2="60" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="70" y1="0" x2="70" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="80" y1="0" x2="80" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="90" y1="0" x2="90" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="100" y1="0" x2="100" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="110" y1="0" x2="110" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="120" y1="0" x2="120" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="130" y1="0" x2="130" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="140" y1="0" x2="140" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="150" y1="0" x2="150" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="160" y1="0" x2="160" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="170" y1="0" x2="170" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="180" y1="0" x2="180" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="190" y1="0" x2="190" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="200" y1="0" x2="200" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="210" y1="0" x2="210" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="220" y1="0" x2="220" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="230" y1="0" x2="230" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="240" y1="0" x2="240" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="250" y1="0" x2="250" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="260" y1="0" x2="260" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="270" y1="0" x2="270" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="280" y1="0" x2="280" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="290" y1="0" x2="290" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="300" y1="0" x2="300" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="310" y1="0" x2="310" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="320" y1="0" x2="320" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="330" y1="0" x2="330" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="340" y1="0" x2="340" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="350" y1="0" x2="350" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="360" y1="0" x2="360" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="370" y1="0" x2="370" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="380" y1="0" x2="380" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="390" y1="0" x2="390" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="400" y1="0" x2="400" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="410" y1="0" x2="410" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="420" y1="0" x2="420" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="430" y1="0" x2="430" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="440" y1="0" x2="440" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="450" y1="0" x2="450" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="460" y1="0" x2="460" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="470" y1="0" x2="470" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="480" y1="0" x2="480" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="490" y1="0" x2="490" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="500" y1="0" x2="500" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="510" y1="0" x2="510" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="520" y1="0" x2="520" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="530" y1="0" x2="530" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="540" y1="0" x2="540" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="550" y1="0" x2="550" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="560" y1="0" x2="560" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="570" y1="0" x2="570" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="580" y1="0" x2="580" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="590" y1="0" x2="590" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="600" y1="0" x2="600" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="610" y1="0" x2="610" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="620" y1="0" x2="620" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="630" y1="0" x2="630" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="640" y1="0" x2="640" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="650" y1="0" x2="650" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="660" y1="0" x2="660" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="670" y1="0" x2="670" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="680" y1="0" x2="680" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="690" y1="0" x2="690" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="700" y1="0" x2="700" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="710" y1="0" x2="710" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="720" y1="0" x2="720" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="730" y1="0" x2="730" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="740" y1="0" x2="740" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="750" y1="0" x2="750" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="760" y1="0" x2="760" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="770" y1="0" x2="770" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="780" y1="0" x2="780" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="790" y1="0" x2="790" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="800" y1="0" x2="800" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="810" y1="0" x2="810" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="820" y1="0" x2="820" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="830" y1="0" x2="830" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="840" y1="0" x2="840" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="850" y1="0" x2="850" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="860" y1="0" x2="860" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="870" y1="0" x2="870" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="880" y1="0" x2="880" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="890" y1="0" x2="890" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="900" y1="0" x2="900" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="910" y1="0" x2="910" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="920" y1="0" x2="920" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="930" y1="0" x2="930" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="940" y1="0" x2="940" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="950" y1="0" x2="950" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="960" y1="0" x2="960" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="970" y1="0" x2="970" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="980" y1="0" x2="980" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="990" y1="0" x2="990" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1000" y1="0" x2="1000" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1010" y1="0" x2="1010" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1020" y1="0" x2="1020" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1030" y1="0" x2="1030" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1040" y1="0" x2="1040" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1050" y1="0" x2="1050" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1060" y1="0" x2="1060" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1070" y1="0" x2="1070" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1080" y1="0" x2="1080" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1090" y1="0" x2="1090" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1100" y1="0" x2="1100" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1110" y1="0" x2="1110" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1120" y1="0" x2="1120" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1130" y1="0" x2="1130" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1140" y1="0" x2="1140" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1150" y1="0" x2="1150" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1160" y1="0" x2="1160" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1170" y1="0" x2="1170" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1180" y1="0" x2="1180" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1190" y1="0" x2="1190" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1200" y1="0" x2="1200" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1210" y1="0" x2="1210" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1220" y1="0" x2="1220" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1230" y1="0" x2="1230" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1240" y1="0" x2="1240" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1250" y1="0" x2="1250" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1260" y1="0" x2="1260" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1270" y1="0" x2="1270" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1280" y1="0" x2="1280" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1290" y1="0" x2="1290" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1300" y1="0" x2="1300" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1310" y1="0" x2="1310" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1320" y1="0" x2="1320" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1330" y1="0" x2="1330" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1340" y1="0" x2="1340" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1350" y1="0" x2="1350" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1360" y1="0" x2="1360" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1370" y1="0" x2="1370" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1380" y1="0" x2="1380" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1390" y1="0" x2="1390" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1400" y1="0" x2="1400" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1410" y1="0" x2="1410" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1420" y1="0" x2="1420" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1430" y1="0" x2="1430" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1440" y1="0" x2="1440" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1450" y1="0" x2="1450" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1460" y1="0" x2="1460" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1470" y1="0" x2="1470" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1480" y1="0" x2="1480" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <line x1="1490" y1="0" x2="1490" y2="1000" class="sc-ifAKCX gxgyhJ"></line>
    <rect width="10px" height="10px" x="400px" y="100px" fill="#7B7982" data-wg-x="400" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="410px" y="100px" fill="#7B7982" data-wg-x="410" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="420px" y="100px" fill="#7B7982" data-wg-x="420" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="430px" y="100px" fill="#7B7982" data-wg-x="430" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="440px" y="100px" fill="#7B7982" data-wg-x="440" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="450px" y="100px" fill="#7B7982" data-wg-x="450" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="460px" y="100px" fill="#7B7982" data-wg-x="460" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="460px" y="110px" fill="#7B7982" data-wg-x="460" data-wg-y="110" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="460px" y="120px" fill="#7B7982" data-wg-x="460" data-wg-y="120" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="460px" y="130px" fill="#7B7982" data-wg-x="460" data-wg-y="130" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="460px" y="140px" fill="#7B7982" data-wg-x="460" data-wg-y="140" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="460px" y="150px" fill="#7B7982" data-wg-x="460" data-wg-y="150" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="450px" y="150px" fill="#7B7982" data-wg-x="450" data-wg-y="150" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="440px" y="150px" fill="#7B7982" data-wg-x="440" data-wg-y="150" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="430px" y="150px" fill="#7B7982" data-wg-x="430" data-wg-y="150" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="420px" y="150px" fill="#7B7982" data-wg-x="420" data-wg-y="150" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="410px" y="150px" fill="#7B7982" data-wg-x="410" data-wg-y="150" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="400px" y="150px" fill="#7B7982" data-wg-x="400" data-wg-y="150" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="390px" y="150px" fill="#7B7982" data-wg-x="390" data-wg-y="150" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="390px" y="140px" fill="#7B7982" data-wg-x="390" data-wg-y="140" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="390px" y="130px" fill="#7B7982" data-wg-x="390" data-wg-y="130" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="390px" y="120px" fill="#7B7982" data-wg-x="390" data-wg-y="120" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="390px" y="110px" fill="#7B7982" data-wg-x="390" data-wg-y="110" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="390px" y="100px" fill="#7B7982" data-wg-x="390" data-wg-y="100" data-wg-type="wall"></rect>
</svg>
    `;

    const reader = new SvgWorldMapReader(true);

    const graph = reader.read(worldMap);

    expect(graph.size()).toEqual(24);
    expect(graph.getRows()).toEqual(6);
    expect(graph.getColumns()).toEqual(8);
});