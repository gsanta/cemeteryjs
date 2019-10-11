import { Polygon } from '@nightshifts.inc/geometry';
import { FurnitureParser } from '../../../src/model/parsers/FurnitureParser';
import { setup } from '../../test_utils/testUtils';

describe('FurnitureParser', () => {
    describe('generate', () => {
        it ('creates world items from the graph (test case with one connected component)', () => {
            const worldMap = `
                map \`

                ------
                -TTTTT
                -T-T--
                ------

                \`

                definitions \`

                W = wall
                T = table
                - = empty

                \`
            `;

            const services = setup(worldMap);

            const furnitureInfoParser = new FurnitureParser(services);
            const worldItems = furnitureInfoParser.parse(worldMap);

            expect(worldItems.length).toEqual(4);
            expect(worldItems).toContainWorldItem({id: 'table-1', name: 'table', dimensions: Polygon.createRectangle(1, 1, 1, 2)});
            expect(worldItems).toContainWorldItem({id: 'table-2', name: 'table', dimensions: Polygon.createRectangle(3, 1, 1, 2)});
            expect(worldItems).toContainWorldItem({id: 'table-3', name: 'table', dimensions: Polygon.createRectangle(2, 1, 1, 1)});
            expect(worldItems).toContainWorldItem({id: 'table-4', name: 'table', dimensions: Polygon.createRectangle(4, 1, 2, 1)});
        });

        it ('creates world items from the graph (test case with multiple connected components)', () => {
            const worldMap = `
                map \`

                ------
                -TTTT-
                -T----
                --TT--

                \`

                definitions \`

                W = wall
                T = table
                - = empty

                \`
            `;

            const services = setup(worldMap);

            const furnitureInfoParser = new FurnitureParser(services);
            const worldItems = furnitureInfoParser.parse(worldMap);

            expect(worldItems.length).toEqual(3);
            expect(worldItems).toContainWorldItem({id: 'table-1', name: 'table', dimensions: Polygon.createRectangle(1, 1, 1, 2)});
            expect(worldItems).toContainWorldItem({id: 'table-2', name: 'table', dimensions: Polygon.createRectangle(2, 1, 3, 1)});
            expect(worldItems).toContainWorldItem({id: 'table-3', name: 'table', dimensions: Polygon.createRectangle(2, 3, 2, 1)});
        });

        it ('creates one world item for a rectangular connected component', () => {
            const worldMap = `
                map \`

                -TT---
                -TT---
                -TT---
                ------

                \`

                definitions \`

                W = wall
                T = table
                - = empty

                \`
            `;

            const services = setup(worldMap);

            const furnitureInfoParser = new FurnitureParser(services);
            const worldItems = furnitureInfoParser.parse(worldMap);
            expect(worldItems.length).toEqual(1);
            expect(worldItems).toContainWorldItem({id: 'table-1', name: 'table', dimensions: Polygon.createRectangle(1, 0, 2, 3)});
        });
    });
});
