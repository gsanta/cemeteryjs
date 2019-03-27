import { WorldMapToMatrixGraphConverter } from "../../matrix_graph/conversion/WorldMapToMatrixGraphConverter";
import { RoomInfoGenerator } from './RoomInfoGenerator';
import { expect } from 'chai';
import { Point } from "../../model/Point";
import * as fs from 'fs';
import { WorldMapToRoomMapConverter } from "./WorldMapToRoomMapConverter";

describe('RoomInfoGenerator', () => {
    describe('generate', () => {
        it ('returns with a WorldItem per room, the points in the Polygon representing the room\'s edges.', () => {
            const map = `
                map \`

                ----------
                -#####----
                -#####----
                -#####----
                ----------

                \`
            `;

            const worldMapToGraphConverter = new WorldMapToMatrixGraphConverter();
            const matrixGraph = worldMapToGraphConverter.convert(map);

            const roomGraphToPolygonListConverter = new RoomInfoGenerator('#');

            const worldItem = roomGraphToPolygonListConverter.generate(matrixGraph);

            expect(worldItem.length).to.eql(1);
            expect(worldItem[0].dimensions.points).to.eql([
                new Point(1, 1),
                new Point(6, 1),
                new Point(6, 4),
                new Point(1, 4)
            ]);
        });

        it ('makes sure that the space between two adjacent rooms is one unit', () => {
            const map = `
                map \`

                -#####----
                -#####----
                ----------
                -#####----
                -#####----

                \`
            `;

            const worldMapToGraphConverter = new WorldMapToMatrixGraphConverter();
            const matrixGraph = worldMapToGraphConverter.convert(map);

            const roomGraphToPolygonListConverter = new RoomInfoGenerator('#');

            const worldItem = roomGraphToPolygonListConverter.generate(matrixGraph);

            expect(worldItem.length).to.eql(2);
            expect(worldItem[0].dimensions.points).to.eql([
                new Point(1, 0),
                new Point(6, 0),
                new Point(6, 2),
                new Point(1, 2)
            ]);

            expect(worldItem[1].dimensions.points).to.eql([
                new Point(1, 3),
                new Point(6, 3),
                new Point(6, 5),
                new Point(1, 5)
            ]);
        });

        it ('converts shapes where the right side has steps', () => {
            const map = `
                map \`

                ----------
                -###------
                -####-----
                -####-----
                -######---

                \`
            `;

            const worldMapToGraphConverter = new WorldMapToMatrixGraphConverter();
            const matrixGraph = worldMapToGraphConverter.convert(map);

            const roomGraphToPolygonListConverter = new RoomInfoGenerator('#');

            const worldItem = roomGraphToPolygonListConverter.generate(matrixGraph);

            expect(worldItem.length).to.eql(1);
            expect(worldItem[0].dimensions.points).to.eql([
                new Point(1, 1),
                new Point(4, 1),
                new Point(4, 2),
                new Point(5, 2),
                new Point(5, 4),
                new Point(7, 4),
                new Point(7, 5),
                new Point(1, 5)
            ]);
        });

        it ('converts shapes where the left side has steps.', () => {
            const map = `
                map \`

                ----------
                -####-----
                -####-----
                ---##-----
                ---##-----
                ----------

                \`
            `;

            const worldMapToGraphConverter = new WorldMapToMatrixGraphConverter();
            const matrixGraph = worldMapToGraphConverter.convert(map);

            const roomGraphToPolygonListConverter = new RoomInfoGenerator('#');

            const worldItem = roomGraphToPolygonListConverter.generate(matrixGraph);

            expect(worldItem.length).to.eql(1);
            expect(worldItem[0].dimensions.points).to.eql([
                new Point(1, 1),
                new Point(5, 1),
                new Point(5, 5),
                new Point(3, 5),
                new Point(3, 3),
                new Point(1, 3)
            ]);
        });

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