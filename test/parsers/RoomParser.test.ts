import { Point, Polygon } from '@nightshifts.inc/geometry';
import * as fs from 'fs';
import { RoomParser } from '../../src/parsers/RoomParser';
import { WorldItemFactoryService } from '../../src/services/WorldItemFactoryService';

describe('RoomParser', () => {
    describe ('generate', () => {
        it ('converts a complicated real-world example to the correct room Polygons.', () => {
            const worldMap = fs.readFileSync(__dirname + '/../../assets/test/big_world.gwm', 'utf8');

            const roomInfoParser = new RoomParser(new WorldItemFactoryService(), ['W', 'D', 'I'], '#');

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