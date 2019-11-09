import { Point, Polygon } from '@nightshifts.inc/geometry';
import * as fs from 'fs';
import { RoomBuilder } from '../../../src/model/builders/RoomBuilder';
import { setup } from '../testUtils';
import { Format } from '../../../src/model/builders/WorldItemBuilder';
import { TextWorldMapReader } from '../../../src/model/readers/text/TextWorldMapReader';
import { WorldMapToRoomMapConverter } from '../../../src/model/readers/text/WorldMapToRoomMapConverter';

describe('RoomParser', () => {
    describe ('generate', () => {
        it ('converts a complicated real-world example to the correct room Polygons.', () => {
            const worldMap = fs.readFileSync(__dirname + '/../../../assets/test/big_world.gwm', 'utf8');

            const services = setup(worldMap);
            const roomInfoParser = new RoomBuilder(services, new TextWorldMapReader(services.configService), new WorldMapToRoomMapConverter(services.configService));

            const worldItem = roomInfoParser.parse(worldMap);

            expect(worldItem[0].dimensions.equalTo(new Polygon([
                new Point(1, 1),
                new Point(1, 17),
                new Point(26, 17),
                new Point(26, 26),
                new Point(37, 26),
                new Point(37, 1)
            ]))).toBeTruthy();
        });
    });
});

it ('Parse room with empty area around the whole world map', () => {
    const worldMap = `
        map \`

        **********
        *WWWWWWWW*
        *W------W*
        *W------W*
        *WWWWWWWW*
        **********

        \`

        definitions \`
            W = wall
            - = room
            * = outdoors
        \`
    `;


    const services = setup(worldMap);
    const roomInfoParser = new RoomBuilder(services, new TextWorldMapReader(services.configService));

    const rooms = roomInfoParser.parse(worldMap);
    expect(rooms.length).toEqual(2);
    expect(rooms).toContainWorldItem({name: 'room', dimensions: services.geometryService.factory.rectangle(2, 2, 6, 2)});
    expect(rooms).toContainWorldItem({name: 'empty', dimensions: services.geometryService.factory.rectangle(2, 2, 6, 2)});
});