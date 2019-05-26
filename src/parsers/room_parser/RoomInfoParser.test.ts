import { WorldMapToMatrixGraphConverter } from "../../matrix_graph/conversion/WorldMapToMatrixGraphConverter";
import { RoomInfoParser } from './RoomInfoParser';
import { expect } from 'chai';
import * as fs from 'fs';
import { WorldMapToRoomMapConverter } from "./WorldMapToRoomMapConverter";
import { Point } from "@nightshifts.inc/geometry";
import { WorldItemInfoFactory } from '../../WorldItemInfoFactory';

describe('RoomInfoParser', () => {
    describe ('generate', () => {
        it ('converts a complicated real-world example to the correct room Polygons.', () => {
            const worldMapStr = fs.readFileSync(__dirname + '/../../../assets/test/big_world.gwm', 'utf8');

            const worldMapToRoomMapConverter = new WorldMapToRoomMapConverter('-', '#', ['W', 'D', 'I']);

            const worldMapToGraphConverter = new WorldMapToMatrixGraphConverter();

            const matrixGraph = worldMapToGraphConverter.convert(worldMapToRoomMapConverter.convert(worldMapStr));

            const roomInfoParser = new RoomInfoParser(new WorldItemInfoFactory(), '#');

            const worldItem = roomInfoParser.generate(matrixGraph);

            expect(worldItem[0].dimensions.points).to.eql([
                new Point(1, 1),
                new Point(37, 1),
                new Point(37, 26),
                new Point(26, 26),
                new Point(26, 17),
                new Point(1, 17)
            ]);
        });
    });
});