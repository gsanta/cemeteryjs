import { WorldMapToMatrixGraphConverter } from "../../src/parsers/reader/WorldMapToMatrixGraphConverter";
import { RoomParser } from '../../src/parsers/RoomParser';
import * as fs from 'fs';
import { WorldMapToRoomMapConverter } from "../../src/parsers/WorldMapToRoomMapConverter";
import { Point, Polygon } from '@nightshifts.inc/geometry';
import { WorldItemFactoryService } from '../../src/services/WorldItemFactoryService';

describe('RoomParser', () => {
    describe ('generate', () => {
        it ('converts a complicated real-world example to the correct room Polygons.', () => {
            const worldMapStr = fs.readFileSync(__dirname + '/../../assets/test/big_world.gwm', 'utf8');

            const worldMapToRoomMapConverter = new WorldMapToRoomMapConverter('-', '#', ['W', 'D', 'I']);

            const worldMapToGraphConverter = new WorldMapToMatrixGraphConverter();

            const matrixGraph = worldMapToGraphConverter.convert(worldMapToRoomMapConverter.convert(worldMapStr));

            const roomInfoParser = new RoomParser(new WorldItemFactoryService());

            const worldItem = roomInfoParser.generate(matrixGraph);

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