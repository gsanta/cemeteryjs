import { FurnitureParser } from '../../src/parsers/FurnitureParser';
import { WorldItem } from '../../src/WorldItem';
import { Polygon } from '@nightshifts.inc/geometry';
import { WorldItemFactoryService } from '../../src/services/WorldItemFactoryService';

describe('FurnitureParser', () => {
    describe('generate', () => {
        it ('creates world items from the graph (test case with one connected component)', () => {
            const worldMap = `
                map \`

                ######
                #WWWWW
                #W#W##
                ######

                \`

                definitions \`

                W = wall
                D = door
                - = empty

                \`
            `;

            const furnitureInfoParser = new FurnitureParser(new WorldItemFactoryService(), ['wall']);
            const worldItems = furnitureInfoParser.parse(worldMap);

            expect(worldItems.length).toEqual(4);
            const firstItem = worldItems[0];
            expect(firstItem).toPartiallyEqualToWorldItem(new WorldItem('wall-1', 'W', Polygon.createRectangle(1, 1, 1, 2), 'wall'));
            const secondItem = worldItems[1];
            expect(secondItem).toPartiallyEqualToWorldItem(new WorldItem('wall-2', 'W', Polygon.createRectangle(3, 1, 1, 2), 'wall'));
        });

        it ('creates world items from the graph (test case with multiple connected components)', () => {
            const worldMap = `
                map \`

                ######
                #WWWW#
                #W####
                ##WW##

                \`

                definitions \`

                W = wall
                D = door
                - = empty

                \`
            `;


            const furnitureInfoParser = new FurnitureParser(new WorldItemFactoryService(), ['wall']);
            const worldItems = furnitureInfoParser.parse(worldMap);

            expect(worldItems.length).toEqual(3);
            const firstItem = worldItems[0];
            expect(firstItem).toPartiallyEqualToWorldItem(new WorldItem('wall-1', 'W', Polygon.createRectangle(1, 1, 1, 2), 'wall'));
            const thirdItem = worldItems[2];
            expect(thirdItem).toPartiallyEqualToWorldItem(new WorldItem('wall-3', 'W', Polygon.createRectangle(2, 3, 2, 1), 'wall'));
        });

        it ('creates one world item for a rectangular connected component', () => {
            const worldMap = `
                map \`

                #DD###
                #DD###
                #DD###
                ######

                \`

                definitions \`

                W = wall
                D = door
                - = empty

                \`
            `;


            const furnitureInfoParser = new FurnitureParser(new WorldItemFactoryService(), ['door']);
            const worldItems = furnitureInfoParser.parse(worldMap);
            expect(worldItems.length).toEqual(1);
            expect(worldItems[0]).toPartiallyEqualToWorldItem(new WorldItem('door-1', 'D', Polygon.createRectangle(1, 0, 2, 3), 'door'));
        });
    });
});
