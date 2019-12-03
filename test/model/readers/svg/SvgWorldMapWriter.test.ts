import { SvgWorldMapReader } from '../../../../src/model/readers/svg/SvgWorldMapReader';
import { SvgConfigReader } from '../../../../src/model/readers/svg/SvgConfigReader';
import { SvgWorldMapWriter } from '../../../../src/model/readers/svg/SvgWorldMapWriter';
import * as convert from 'xml-js';
import { RawWorldMapJson } from '../../../../src/model/readers/svg/WorldMapJson';

it ('Write an svg from the internal worldmap representation', () => {
    const inputWorldMap = `
    <svg data-wg-pixel-size="10" data-wg-width="1500" data-wg-height="1000">
        <metadata>
            <wg-type color="#7B7982" roles="border" is-border="true" scale="1" translate-y="0" type-name="wall"></wg-type>
            <wg-type color="#BFA85C" roles="border" scale="3" translate-y="-4" type-name="door"></wg-type>
            <wg-type is-border="false" scale="1" translate-y="0" type-name="table" color="#c5541b"></wg-type>
            <wg-type color="#70C0CF" roles="border" scale="3" translate-y="0" type-name="window"></wg-type>
            <wg-type color="#9894eb" scale="3" translate-y="0" type-name="chair"></wg-type>
            <wg-type color="#8c7f6f" scale="3" translate-y="1" type-name="shelves"></wg-type>
            <wg-type color="#66553f" scale="3" translate-y="2" type-name="stairs"></wg-type>
            <wg-type scale="1" translate-y="0" type-name="outdoors"></wg-type>
            <wg-type scale="1" roles="container" translate-y="0" type-name="room"></wg-type>
            <wg-type scale="1" translate-y="0" type-name="player"></wg-type>
        </metadata>
        <rect width="10px" height="10px" x="50px" y="30px" fill="#7B7982" data-wg-x="50" data-wg-y="30" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="60px" y="30px" fill="#7B7982" data-wg-x="60" data-wg-y="30" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="70px" y="30px" fill="#7B7982" data-wg-x="70" data-wg-y="30" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="80px" y="30px" fill="#7B7982" data-wg-x="80" data-wg-y="30" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="90px" y="30px" fill="#7B7982" data-wg-x="90" data-wg-y="30" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="100px" y="30px" fill="#7B7982" data-wg-x="100" data-wg-y="30" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="110px" y="30px" fill="#7B7982" data-wg-x="110" data-wg-y="30" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="120px" y="30px" fill="#7B7982" data-wg-x="120" data-wg-y="30" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="50px" y="40px" fill="#7B7982" data-wg-x="50" data-wg-y="40" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="50px" y="50px" fill="#7B7982" data-wg-x="50" data-wg-y="50" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="50px" y="60px" fill="#7B7982" data-wg-x="50" data-wg-y="60" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="50px" y="70px" fill="#7B7982" data-wg-x="50" data-wg-y="70" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="50px" y="80px" fill="#7B7982" data-wg-x="50" data-wg-y="80" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="50px" y="90px" fill="#7B7982" data-wg-x="50" data-wg-y="90" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="60px" y="90px" fill="#7B7982" data-wg-x="60" data-wg-y="90" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="70px" y="90px" fill="#7B7982" data-wg-x="70" data-wg-y="90" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="80px" y="90px" fill="#7B7982" data-wg-x="80" data-wg-y="90" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="90px" y="90px" fill="#7B7982" data-wg-x="90" data-wg-y="90" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="100px" y="90px" fill="#7B7982" data-wg-x="100" data-wg-y="90" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="110px" y="90px" fill="#7B7982" data-wg-x="110" data-wg-y="90" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="120px" y="90px" fill="#7B7982" data-wg-x="120" data-wg-y="90" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="130px" y="30px" fill="#7B7982" data-wg-x="130" data-wg-y="30" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="130px" y="40px" fill="#7B7982" data-wg-x="130" data-wg-y="40" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="130px" y="50px" fill="#7B7982" data-wg-x="130" data-wg-y="50" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="130px" y="60px" fill="#7B7982" data-wg-x="130" data-wg-y="60" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="130px" y="70px" fill="#7B7982" data-wg-x="130" data-wg-y="70" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="130px" y="80px" fill="#7B7982" data-wg-x="130" data-wg-y="80" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="130px" y="90px" fill="#7B7982" data-wg-x="130" data-wg-y="90" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="100px" y="40px" data-wg-x="100" data-wg-y="40" data-wg-width="10" data-wg-height="10" data-wg-type="table" fill="#c5541b"></rect>
        <rect width="10px" height="10px" x="100px" y="50px" data-wg-x="100" data-wg-y="50" data-wg-width="10" data-wg-height="10" data-wg-type="table" fill="#c5541b"></rect>
        <rect width="10px" height="10px" x="100px" y="60px" data-wg-x="100" data-wg-y="60" data-wg-width="10" data-wg-height="10" data-wg-type="table" fill="#c5541b"></rect>
        <rect width="10px" height="10px" x="110px" y="40px" data-wg-x="110" data-wg-y="40" data-wg-width="10" data-wg-height="10" data-wg-type="table" fill="#c5541b"></rect>
        <rect width="10px" height="10px" x="110px" y="50px" data-wg-x="110" data-wg-y="50" data-wg-width="10" data-wg-height="10" data-wg-type="table" fill="#c5541b"></rect>
        <rect width="10px" height="10px" x="110px" y="60px" data-wg-x="110" data-wg-y="60" data-wg-width="10" data-wg-height="10" data-wg-type="table" fill="#c5541b"></rect>
        <rect width="10px" height="10px" x="120px" y="40px" data-wg-x="120" data-wg-y="40" data-wg-width="10" data-wg-height="10" data-wg-type="table" fill="#c5541b"></rect>
        <rect width="10px" height="10px" x="120px" y="50px" data-wg-x="120" data-wg-y="50" data-wg-width="10" data-wg-height="10" data-wg-type="table" fill="#c5541b"></rect>
        <rect width="10px" height="10px" x="120px" y="60px" data-wg-x="120" data-wg-y="60" data-wg-width="10" data-wg-height="10" data-wg-type="table" fill="#c5541b"></rect>
        <rect width="10px" height="10px" x="60px" y="40px" data-wg-x="60" data-wg-y="40" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="60px" y="50px" data-wg-x="60" data-wg-y="50" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="60px" y="60px" data-wg-x="60" data-wg-y="60" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="60px" y="70px" data-wg-x="60" data-wg-y="70" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="60px" y="80px" data-wg-x="60" data-wg-y="80" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="70px" y="40px" data-wg-x="70" data-wg-y="40" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="70px" y="50px" data-wg-x="70" data-wg-y="50" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="70px" y="60px" data-wg-x="70" data-wg-y="60" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="70px" y="70px" data-wg-x="70" data-wg-y="70" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="70px" y="80px" data-wg-x="70" data-wg-y="80" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="80px" y="40px" data-wg-x="80" data-wg-y="40" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="80px" y="50px" data-wg-x="80" data-wg-y="50" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="80px" y="60px" data-wg-x="80" data-wg-y="60" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="80px" y="70px" data-wg-x="80" data-wg-y="70" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="80px" y="80px" data-wg-x="80" data-wg-y="80" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="90px" y="40px" data-wg-x="90" data-wg-y="40" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="90px" y="50px" data-wg-x="90" data-wg-y="50" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="90px" y="60px" data-wg-x="90" data-wg-y="60" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="90px" y="70px" data-wg-x="90" data-wg-y="70" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="90px" y="80px" data-wg-x="90" data-wg-y="80" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="100px" y="70px" data-wg-x="100" data-wg-y="70" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="100px" y="80px" data-wg-x="100" data-wg-y="80" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="110px" y="70px" data-wg-x="110" data-wg-y="70" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="110px" y="80px" data-wg-x="110" data-wg-y="80" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="120px" y="70px" data-wg-x="120" data-wg-y="70" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="120px" y="80px" data-wg-x="120" data-wg-y="80" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
    </svg>
    `;

    const svgReader = new SvgWorldMapReader();
    const graph = svgReader.read(inputWorldMap);
    const {worldItemTypes, globalConfig} = new SvgConfigReader().read(inputWorldMap);

    const outputWorldMap = new SvgWorldMapWriter().write(graph, worldItemTypes, globalConfig);
    const rawJson: RawWorldMapJson = JSON.parse(convert.xml2json(outputWorldMap, {compact: true, spaces: 4}));

    expect(rawJson.svg.metadata["wg-type"].length).toEqual(10);

    const wallType = rawJson.svg.metadata["wg-type"].find(type => type._attributes['type-name'] === 'wall');
    expect(wallType._attributes).toEqual({
        color: "#7B7982",
        roles: "border",
        materials: "",
        scale: "1",
        shape: "undefined",
        "translate-y": "0",
        "type-name": "wall"
    });

    const tableType = rawJson.svg.metadata["wg-type"].find(type => type._attributes['type-name'] === 'table');

    expect(tableType._attributes).toEqual({
        color: "#c5541b",
        materials: "",
        scale: "1",
        shape: "undefined",
        "translate-y": "0",
        "type-name": "table"
    });

    expect(rawJson.svg.rect.length).toEqual(63);
});