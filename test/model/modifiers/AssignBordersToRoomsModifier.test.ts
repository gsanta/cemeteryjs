import { Polygon } from '@nightshifts.inc/geometry';
import { AssignBordersToRoomsModifier } from '../../../src/model/modifiers/AssignBordersToRoomsModifier';
import { ScaleModifier } from '../../../src/model/modifiers/ScaleModifier';
import { SegmentBordersModifier } from '../../../src/model/modifiers/SegmentBordersModifier';
import { setup } from '../../test_utils/testUtils';

describe(`AssignBordersToRoomsModifier`, () => {
    describe('`apply`', () => {
        it ('adds the bordering WorldItems to the corresponding room WorldItem', () => {
            const map = `
                map \`

                WWWWWWWWWW
                W--------W
                W--------W
                W--------W
                WWWWWWWWWW

                \`

                definitions \`

                - = room
                W = wall BORDER

                \`
            `;

            const services = setup(map);

            let items = services.importerService.import(map, []);

            const [wall1, wall2, wall3, wall4, room] =  new AssignBordersToRoomsModifier(services.configService).apply(items);

            expect(room.borderItems).toEqual([wall1, wall2, wall3, wall4]);
        });

        it ('does not add the bordering WorldItem if it only touches the room at it\'s edge', () => {
            const map = `
                map \`

                WWWWWWWWWW
                W---W----W
                W---W----W
                W---W----W
                WWWWWWWWWW
                W--------W
                W--------W
                W--------W
                WWWWWWWWWW

                \`

                definitions \`

                - = room
                W = wall BORDER

                \`
            `;

            const services = setup(map);

            const items = services.importerService.import(map, [SegmentBordersModifier.modName, AssignBordersToRoomsModifier.modName]);

            const room3 = items.filter(worldItem => worldItem.name === 'room')[2];
            const borderItemDimensions = room3.borderItems.map(borderItem => borderItem.dimensions);

            const cornerIntersectingRect = Polygon.createRectangle(4, 0, 1, 5);
            expect(borderItemDimensions.find((dim: Polygon) => dim.equalTo(cornerIntersectingRect))).toEqual(undefined);
        });

        it ('takes scales into consideration when calculating \'only corner\' connection', () => {
            const map = `
                map \`

                WWWWWWWWWW
                W--------W
                W--------W
                W--------W
                WWWWWWWWWW
                W---W----W
                W---W----W
                W---W----W
                WWWWWWWWWW

                \`

                definitions \`

                - = room
                W = wall

                \`
            `;


            const services = setup(map);


            const items = services.importerService.import(map, [ScaleModifier.modName, SegmentBordersModifier.modName, AssignBordersToRoomsModifier.modName]);

            const room3 = items.filter(worldItem => worldItem.name === 'room')[0];

            const borderItemDimensions = room3.borderItems.map(borderItem => borderItem.dimensions);
            1;
            const cornerIntersectingRect = Polygon.createRectangle(8, 8, 2, 10);
            expect(borderItemDimensions.find((dim: Polygon) => dim.equalTo(cornerIntersectingRect))).toEqual(undefined);
        });
    });
});