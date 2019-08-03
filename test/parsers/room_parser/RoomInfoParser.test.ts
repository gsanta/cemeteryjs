import { WorldMapToMatrixGraphConverter } from "../../../src/matrix_graph/conversion/WorldMapToMatrixGraphConverter";
import { RoomInfoParser } from '../../../src/parsers/room_parser/RoomInfoParser';
import * as fs from 'fs';
import { WorldMapToRoomMapConverter } from "../../../src/parsers/room_parser/WorldMapToRoomMapConverter";
import { Point, Polygon } from '@nightshifts.inc/geometry';
import { WorldItemInfoFactory } from '../../../src/WorldItemInfoFactory';

describe('RoomInfoParser', () => {
    describe ('generate', () => {
        it ('converts a complicated real-world example to the correct room Polygons.', () => {
            const worldMapStr = fs.readFileSync(__dirname + '/../../../assets/test/big_world.gwm', 'utf8');

            const worldMapToRoomMapConverter = new WorldMapToRoomMapConverter('-', '#', ['W', 'D', 'I']);

            const worldMapToGraphConverter = new WorldMapToMatrixGraphConverter();

            const matrixGraph = worldMapToGraphConverter.convert(worldMapToRoomMapConverter.convert(worldMapStr));

            const roomInfoParser = new RoomInfoParser(new WorldItemInfoFactory(), '#');

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