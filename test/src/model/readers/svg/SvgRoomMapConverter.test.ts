import { SvgRoomMapConverter } from '../../../../../src/model/readers/svg/SvgRoomMapConverter';
import { WorldItemStore } from '../../../../../src/model/services/WorldItemStore';
import { SvgConfigReader } from '../../../../../src/model/readers/svg/SvgConfigReader';
import { RawWorldMapJson } from '../../../../../src/model/readers/svg/WorldMapJson';
import * as convert from 'xml-js';

it ('Convert a normal worldmap svg to an svg that only contains wall and room types', () => {
    const inputWorldMap = `
    <svg data-wg-pixel-size="10" data-wg-width="1500" data-wg-height="1000">
        <metadata>
            <wg-type color="#7B7982" roles="border" scale="1" translate-y="0" type-name="wall"></wg-type>
            <wg-type color="#BFA85C" roles="border" scale="3" translate-y="-4" type-name="door"></wg-type>
            <wg-type scale="1" translate-y="0" type-name="table" color="#5f47d3"></wg-type>
            <wg-type color="#70C0CF" roles="border" scale="3" translate-y="0" type-name="window"></wg-type>
            <wg-type color="#9894eb" scale="3" translate-y="0" type-name="chair"></wg-type>
            <wg-type color="#8c7f6f" scale="3" translate-y="1" type-name="shelves"></wg-type>
            <wg-type color="#66553f" scale="3" translate-y="2" type-name="stairs"></wg-type>
            <wg-type roles="container" scale="1" translate-y="0" type-name="outdoors"></wg-type>
            <wg-type roles="room" scale="1" translate-y="0" type-name="room"></wg-type>
            <wg-type scale="1" translate-y="0" type-name="player"></wg-type>
        </metadata>
        <rect width="10px" height="10px" x="40px" y="20px" fill="#7B7982" data-wg-x="40" data-wg-y="20" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="50px" y="20px" fill="#7B7982" data-wg-x="50" data-wg-y="20" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="80px" y="20px" fill="#7B7982" data-wg-x="80" data-wg-y="20" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="90px" y="20px" fill="#7B7982" data-wg-x="90" data-wg-y="20" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="120px" y="20px" fill="#7B7982" data-wg-x="120" data-wg-y="20" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="130px" y="20px" fill="#7B7982" data-wg-x="130" data-wg-y="20" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="40px" y="30px" fill="#7B7982" data-wg-x="40" data-wg-y="30" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="40px" y="40px" fill="#7B7982" data-wg-x="40" data-wg-y="40" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="40px" y="50px" fill="#7B7982" data-wg-x="40" data-wg-y="50" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="40px" y="60px" fill="#7B7982" data-wg-x="40" data-wg-y="60" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="40px" y="70px" fill="#7B7982" data-wg-x="40" data-wg-y="70" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="40px" y="80px" fill="#7B7982" data-wg-x="40" data-wg-y="80" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="40px" y="90px" fill="#7B7982" data-wg-x="40" data-wg-y="90" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="40px" y="100px" fill="#7B7982" data-wg-x="40" data-wg-y="100" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="50px" y="100px" fill="#7B7982" data-wg-x="50" data-wg-y="100" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="60px" y="100px" fill="#7B7982" data-wg-x="60" data-wg-y="100" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="70px" y="100px" fill="#7B7982" data-wg-x="70" data-wg-y="100" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="80px" y="100px" fill="#7B7982" data-wg-x="80" data-wg-y="100" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="90px" y="100px" fill="#7B7982" data-wg-x="90" data-wg-y="100" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="100px" y="100px" fill="#7B7982" data-wg-x="100" data-wg-y="100" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="110px" y="100px" fill="#7B7982" data-wg-x="110" data-wg-y="100" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="120px" y="100px" fill="#7B7982" data-wg-x="120" data-wg-y="100" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="130px" y="100px" fill="#7B7982" data-wg-x="130" data-wg-y="100" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="130px" y="30px" fill="#7B7982" data-wg-x="130" data-wg-y="30" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="130px" y="40px" fill="#7B7982" data-wg-x="130" data-wg-y="40" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="130px" y="90px" fill="#7B7982" data-wg-x="130" data-wg-y="90" data-wg-width="10" data-wg-height="10" data-wg-type="wall"></rect>
        <rect width="10px" height="10px" x="60px" y="20px" fill="#BFA85C" data-wg-x="60" data-wg-y="20" data-wg-width="10" data-wg-height="10" data-wg-type="door"></rect>
        <rect width="10px" height="10px" x="70px" y="20px" fill="#BFA85C" data-wg-x="70" data-wg-y="20" data-wg-width="10" data-wg-height="10" data-wg-type="door"></rect>
        <rect width="10px" height="10px" x="100px" y="20px" fill="#70C0CF" data-wg-x="100" data-wg-y="20" data-wg-width="10" data-wg-height="10" data-wg-type="window"></rect>
        <rect width="10px" height="10px" x="110px" y="20px" fill="#70C0CF" data-wg-x="110" data-wg-y="20" data-wg-width="10" data-wg-height="10" data-wg-type="window"></rect>
        <rect width="10px" height="10px" x="130px" y="50px" fill="#70C0CF" data-wg-x="130" data-wg-y="50" data-wg-width="10" data-wg-height="10" data-wg-type="window"></rect>
        <rect width="10px" height="10px" x="130px" y="60px" fill="#70C0CF" data-wg-x="130" data-wg-y="60" data-wg-width="10" data-wg-height="10" data-wg-type="window"></rect>
        <rect width="10px" height="10px" x="130px" y="80px" fill="#70C0CF" data-wg-x="130" data-wg-y="80" data-wg-width="10" data-wg-height="10" data-wg-type="window"></rect>
        <rect width="10px" height="10px" x="130px" y="70px" fill="#70C0CF" data-wg-x="130" data-wg-y="70" data-wg-width="10" data-wg-height="10" data-wg-type="window"></rect>
        <rect width="10px" height="10px" x="50px" y="30px" data-wg-x="50" data-wg-y="30" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="50px" y="40px" data-wg-x="50" data-wg-y="40" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="50px" y="50px" data-wg-x="50" data-wg-y="50" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="50px" y="60px" data-wg-x="50" data-wg-y="60" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="60px" y="30px" data-wg-x="60" data-wg-y="30" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="60px" y="40px" data-wg-x="60" data-wg-y="40" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="60px" y="50px" data-wg-x="60" data-wg-y="50" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="60px" y="60px" data-wg-x="60" data-wg-y="60" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="70px" y="30px" data-wg-x="70" data-wg-y="30" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="70px" y="40px" data-wg-x="70" data-wg-y="40" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="70px" y="50px" data-wg-x="70" data-wg-y="50" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="70px" y="60px" data-wg-x="70" data-wg-y="60" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="80px" y="30px" data-wg-x="80" data-wg-y="30" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="80px" y="40px" data-wg-x="80" data-wg-y="40" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="80px" y="50px" data-wg-x="80" data-wg-y="50" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="80px" y="60px" data-wg-x="80" data-wg-y="60" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="80px" y="70px" data-wg-x="80" data-wg-y="70" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="80px" y="80px" data-wg-x="80" data-wg-y="80" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="90px" y="30px" data-wg-x="90" data-wg-y="30" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="90px" y="40px" data-wg-x="90" data-wg-y="40" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="90px" y="50px" data-wg-x="90" data-wg-y="50" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="90px" y="60px" data-wg-x="90" data-wg-y="60" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="90px" y="70px" data-wg-x="90" data-wg-y="70" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="90px" y="80px" data-wg-x="90" data-wg-y="80" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="100px" y="30px" data-wg-x="100" data-wg-y="30" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="100px" y="60px" data-wg-x="100" data-wg-y="60" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="100px" y="70px" data-wg-x="100" data-wg-y="70" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="100px" y="80px" data-wg-x="100" data-wg-y="80" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="90px" y="90px" data-wg-x="90" data-wg-y="90" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="80px" y="90px" data-wg-x="80" data-wg-y="90" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="100px" y="90px" data-wg-x="100" data-wg-y="90" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="110px" y="30px" data-wg-x="110" data-wg-y="30" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="120px" y="30px" data-wg-x="120" data-wg-y="30" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="110px" y="60px" data-wg-x="110" data-wg-y="60" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="110px" y="70px" data-wg-x="110" data-wg-y="70" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="110px" y="80px" data-wg-x="110" data-wg-y="80" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="120px" y="40px" data-wg-x="120" data-wg-y="40" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="120px" y="50px" data-wg-x="120" data-wg-y="50" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="120px" y="60px" data-wg-x="120" data-wg-y="60" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="120px" y="70px" data-wg-x="120" data-wg-y="70" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="120px" y="80px" data-wg-x="120" data-wg-y="80" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="110px" y="90px" data-wg-x="110" data-wg-y="90" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="120px" y="90px" data-wg-x="120" data-wg-y="90" data-wg-width="10" data-wg-height="10" data-wg-type="room"></rect>
        <rect width="10px" height="10px" x="50px" y="70px" data-wg-x="50" data-wg-y="70" data-wg-width="10" data-wg-height="10" data-wg-type="table" fill="#5f47d3"></rect>
        <rect width="10px" height="10px" x="50px" y="80px" data-wg-x="50" data-wg-y="80" data-wg-width="10" data-wg-height="10" data-wg-type="table" fill="#5f47d3"></rect>
        <rect width="10px" height="10px" x="50px" y="90px" data-wg-x="50" data-wg-y="90" data-wg-width="10" data-wg-height="10" data-wg-type="table" fill="#5f47d3"></rect>
        <rect width="10px" height="10px" x="60px" y="70px" data-wg-x="60" data-wg-y="70" data-wg-width="10" data-wg-height="10" data-wg-type="table" fill="#5f47d3"></rect>
        <rect width="10px" height="10px" x="60px" y="80px" data-wg-x="60" data-wg-y="80" data-wg-width="10" data-wg-height="10" data-wg-type="table" fill="#5f47d3"></rect>
        <rect width="10px" height="10px" x="60px" y="90px" data-wg-x="60" data-wg-y="90" data-wg-width="10" data-wg-height="10" data-wg-type="table" fill="#5f47d3"></rect>
        <rect width="10px" height="10px" x="70px" y="70px" data-wg-x="70" data-wg-y="70" data-wg-width="10" data-wg-height="10" data-wg-type="table" fill="#5f47d3"></rect>
        <rect width="10px" height="10px" x="70px" y="80px" data-wg-x="70" data-wg-y="80" data-wg-width="10" data-wg-height="10" data-wg-type="table" fill="#5f47d3"></rect>
        <rect width="10px" height="10px" x="70px" y="90px" data-wg-x="70" data-wg-y="90" data-wg-width="10" data-wg-height="10" data-wg-type="table" fill="#5f47d3"></rect>
        <rect width="10px" height="10px" x="100px" y="40px" data-wg-x="100" data-wg-y="40" data-wg-width="10" data-wg-height="10" data-wg-type="chair" fill="#9894eb"></rect>
        <rect width="10px" height="10px" x="100px" y="50px" data-wg-x="100" data-wg-y="50" data-wg-width="10" data-wg-height="10" data-wg-type="chair" fill="#9894eb"></rect>
        <rect width="10px" height="10px" x="110px" y="40px" data-wg-x="110" data-wg-y="40" data-wg-width="10" data-wg-height="10" data-wg-type="chair" fill="#9894eb"></rect>
        <rect width="10px" height="10px" x="110px" y="50px" data-wg-x="110" data-wg-y="50" data-wg-width="10" data-wg-height="10" data-wg-type="chair" fill="#9894eb"></rect>
    </svg>
    `;

    const {worldItemTemplates, globalConfig} = new SvgConfigReader().read(inputWorldMap);
    const configService = new WorldItemStore(worldItemTemplates, globalConfig);

    const svgRoomMapConverter = new SvgRoomMapConverter();
    const outputWorldMap = svgRoomMapConverter.convert(inputWorldMap);
    
    const rawJson: RawWorldMapJson = JSON.parse(convert.xml2json(outputWorldMap, {compact: true, spaces: 4}));

    rawJson.svg.rect.forEach(rect => {
        const type = rect._attributes['data-wg-type'];
        expect(type === 'wall' || type === 'room');
    });

    const walls = rawJson.svg.rect.filter(rect => rect._attributes['data-wg-type'] === 'wall');
    expect(walls.length).toEqual(34);
});