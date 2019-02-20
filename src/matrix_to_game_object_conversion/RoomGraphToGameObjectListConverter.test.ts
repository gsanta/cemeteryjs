import { WorldMapToMatrixGraphConverter } from "../matrix_graph/WorldMapToMatrixGraphConverter";
import { RoomGraphToGameObjectListConverter } from './RoomGraphToGameObjectListConverter';
import { expect } from 'chai';
import { Point } from "../model/Point";


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

            const roomGraphToGameObjectListConverter = new RoomGraphToGameObjectListConverter();

            const gameObjects = roomGraphToGameObjectListConverter.convert(matrixGraph, '#');

            expect(gameObjects.length).to.eql(1);
            expect(gameObjects[0].dimensions.points).to.eql([
                new Point(1, 1),
                new Point(5, 1),
                new Point(5, 2),
                new Point(5, 3),
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

            const roomGraphToGameObjectListConverter = new RoomGraphToGameObjectListConverter();

            const gameObjects = roomGraphToGameObjectListConverter.convert(matrixGraph, '#');

            expect(gameObjects.length).to.eql(2);
            expect(gameObjects[0].dimensions.points).to.eql([
                new Point(7, 1),
                new Point(8, 1),
                new Point(8, 2),
                new Point(7, 2)
            ]);

            expect(gameObjects[1].dimensions.points).to.eql([
                new Point(1, 2),
                new Point(3, 2),
                new Point(3, 3),
                new Point(1, 3)
            ]);
        });

        it.only ('converts a more complicated room shape correctly.', () => {
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

            const roomGraphToGameObjectListConverter = new RoomGraphToGameObjectListConverter();

            const gameObjects = roomGraphToGameObjectListConverter.convert(matrixGraph, '#');

            expect(gameObjects.length).to.eql(1);
            expect(gameObjects[0].dimensions.points).to.eql([
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