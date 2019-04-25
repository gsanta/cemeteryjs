import { WorldMapToMatrixGraphConverter } from "../../matrix_graph/conversion/WorldMapToMatrixGraphConverter";
import { RoomInfoGenerator } from './RoomInfoGenerator';
import { expect } from 'chai';
import { Point } from "../../model/Point";
import * as fs from 'fs';
import { WorldMapToRoomMapConverter } from "./WorldMapToRoomMapConverter";

describe('RoomInfoGenerator', () => {
    describe ('generate', () => {
        it ('converts a complicated real-world example to the correct room Polygons.', () => {
            const worldMapStr = fs.readFileSync(__dirname + '/../../../assets/test/big_world.gwm', 'utf8');

            const worldMapToRoomMapConverter = new WorldMapToRoomMapConverter('-', '#', ['W', 'D', 'I']);

            const worldMapToGraphConverter = new WorldMapToMatrixGraphConverter();

            const matrixGraph = worldMapToGraphConverter.convert(worldMapToRoomMapConverter.convert(worldMapStr));

            const roomGraphToPolygonListConverter = new RoomInfoGenerator('#');

            const worldItem = roomGraphToPolygonListConverter.generate(matrixGraph);

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