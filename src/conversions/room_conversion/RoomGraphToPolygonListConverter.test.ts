import { WorldMapToMatrixGraphConverter } from "../../matrix_graph/conversion/WorldMapToMatrixGraphConverter";
import { RoomGraphToPolygonListConverter } from './RoomGraphToPolygonListConverter';
import { expect } from 'chai';
import { Point } from "../../model/Point";

describe('RoomGraphToGameObjectListConverter', () => {
    describe('convert', () => {
        it ('returns with a Polygon per room, the points in the Polygon representing the room\'s edges.', () => {
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

            const roomGraphToPolygonListConverter = new RoomGraphToPolygonListConverter();

            const polygons = roomGraphToPolygonListConverter.convert(matrixGraph, '#');

            expect(polygons.length).to.eql(1);
            expect(polygons[0].points).to.eql([
                new Point(1, 1),
                new Point(6, 1),
                new Point(6, 2),
                new Point(6, 3),
                new Point(6, 4),
                new Point(1, 4),
                new Point(1, 3),
                new Point(1, 2)
            ]);
        });

        it ('converts multiple rooms correctly.', () => {
            const map = `
                map \`

                ----------
                -------##-
                -###---##-
                -###------
                ----------

                \`
            `;

            const worldMapToGraphConverter = new WorldMapToMatrixGraphConverter();
            const matrixGraph = worldMapToGraphConverter.convert(map);

            const roomGraphToPolygonListConverter = new RoomGraphToPolygonListConverter();

            const polygons = roomGraphToPolygonListConverter.convert(matrixGraph, '#');

            expect(polygons.length).to.eql(2);
            expect(polygons[0].points).to.eql([
                new Point(7, 1),
                new Point(9, 1),
                new Point(9, 2),
                new Point(9, 3),
                new Point(7, 3),
                new Point(7, 2)
            ]);

            expect(polygons[1].points).to.eql([
                new Point(1, 2),
                new Point(4, 2),
                new Point(4, 3),
                new Point(4, 4),
                new Point(1, 4),
                new Point(1, 3)
            ]);
        });

        it ('converts a more complicated room shape correctly.', () => {
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

            const roomGraphToPolygonListConverter = new RoomGraphToPolygonListConverter();

            const polygons = roomGraphToPolygonListConverter.convert(matrixGraph, '#');

            expect(polygons.length).to.eql(1);
            expect(polygons[0].points).to.eql([
                new Point(1, 1),
                new Point(4, 1),
                new Point(4, 2),
                new Point(5, 2),
                new Point(5, 3),
                new Point(5, 4),
                new Point(7, 4),
                new Point(7, 5),
                new Point(1, 5),
                new Point(1, 4),
                new Point(1, 3),
                new Point(1, 2)
            ]);
        });
    });
});