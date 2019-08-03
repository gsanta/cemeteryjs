import { WorldMapToMatrixGraphConverter } from "../../../src/matrix_graph/conversion/WorldMapToMatrixGraphConverter";
import { PolygonAreaInfoParser } from "../../../src/parsers/polygon_area_parser/PolygonAreaInfoParser";
import { Point, Polygon } from '@nightshifts.inc/geometry';
import { WorldItemInfoFactory } from "../../../src/WorldItemInfoFactory";

describe('PolygonAreaInfoGenerator', () => {
    describe ('generate', () => {
        it ('returns with a WorldItem per connected area, the points in the Polygon representing the area\'s edges.', () => {
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

            const polygonAreaInfoParser = new PolygonAreaInfoParser(new WorldItemInfoFactory(), 'room', '#');

            const worldItem = polygonAreaInfoParser.generate(matrixGraph);

            expect(worldItem.length).toEqual(1);
            expect(worldItem[0].dimensions.equalTo(new Polygon([
                new Point(1, 1),
                new Point(1, 4),
                new Point(6, 4),
                new Point(6, 1)
            ]))).toBeTruthy();
        });

        it ('makes sure that the space between two adjacent connected component is one unit', () => {
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

            const polygonAreaInfoParser = new PolygonAreaInfoParser(new WorldItemInfoFactory(), 'room', '#');

            const worldItem = polygonAreaInfoParser.generate(matrixGraph);

            expect(worldItem.length).toEqual(2);
            expect(worldItem[0].dimensions.equalTo(new Polygon([
                new Point(1, 0),
                new Point(1, 2),
                new Point(6, 2),
                new Point(6, 0)
            ]))).toBeTruthy();

            expect(worldItem[1].dimensions.equalTo(new Polygon([
                new Point(1, 3),
                new Point(1, 5),
                new Point(6, 5),
                new Point(6, 3)
            ]))).toBeTruthy();
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

            const polygonAreaInfoParser = new PolygonAreaInfoParser(new WorldItemInfoFactory(), 'room', '#');

            const worldItem = polygonAreaInfoParser.generate(matrixGraph);

            expect(worldItem.length).toEqual(1);
            expect(worldItem[0].dimensions.equalTo(new Polygon([
                new Point(1, 1),
                new Point(1, 5),
                new Point(7, 5),
                new Point(7, 4),
                new Point(5, 4),
                new Point(5, 2),
                new Point(4, 2),
                new Point(4, 1)
            ]))).toBeTruthy();
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

            const polygonAreaInfoParser = new PolygonAreaInfoParser(new WorldItemInfoFactory(), 'room', '#');

            const worldItem = polygonAreaInfoParser.generate(matrixGraph);

            expect(worldItem.length).toEqual(1);
            expect(worldItem[0].dimensions.equalTo(new Polygon([
                new Point(1, 1),
                new Point(1, 3),
                new Point(3, 3),
                new Point(3, 5),
                new Point(5, 5),
                new Point(5, 1),
            ]))).toBeTruthy();
        });
    });
});