import { Polygon } from "@nightshifts.inc/geometry";
import { SegmentBordersModifier } from "../../../src/model/modifiers/SegmentBordersModifier";
import { ServiceFacade } from "../../../src/model/services/ServiceFacade";
import { setup } from "../../test_utils/testUtils";
import { ScaleModifier } from '../../../src/model/modifiers/ScaleModifier';

function createMap(worldMap: string) {
    return `
        map \`

        ${worldMap}

        \`

        definitions \`

        - = room
        W = wall BORDER


        \`
    `;
}

describe ('BorderItemSegmentingTransformator', () => {
    describe('generate', () => {
        it ('segments the walls into smaller pieces so that no wall will cover more then one room', () => {
            const map = `
            map \`

            WWWWWWWWWW
            W--------W
            W--------W
            WWWWWWWWWW
            W--------W
            W--------W
            WWWWWWWWWW

            \`

            definitions \`

            W = wall BORDER
            D = door BORDER
            I = window BORDER
            - = room

            \`

            globals \`

                scale 1 1

            \`
            `;

            let services: ServiceFacade<any, any, any> = setup(map);

            const items = services.importerService.import(
                map,
                [
                    SegmentBordersModifier.modName,
                    ScaleModifier.modName
                ]
            );

            expect(items.filter(item => item.name === 'wall').length).toEqual(7);


            expect(items).toHaveAnyWithDimensions(Polygon.createRectangle(0, 0, 1, 4));
            expect(items).toHaveAnyWithDimensions(Polygon.createRectangle(0, 3, 1, 4));
            expect(items).toHaveAnyWithDimensions(Polygon.createRectangle(9, 0, 1, 4));
            expect(items).toHaveAnyWithDimensions(Polygon.createRectangle(9, 3, 1, 4));
            expect(items).toHaveAnyWithDimensions(Polygon.createRectangle(0, 0, 10, 1));
            expect(items).toHaveAnyWithDimensions(Polygon.createRectangle(0, 3, 10, 1));
            expect(items).toHaveAnyWithDimensions(Polygon.createRectangle(0, 6, 10, 1));
            expect(items).toHaveAnyWithWorldMapPositions(services, [[0, 3], [0, 4], [0, 5], [0, 6]]);
            expect(items).toHaveAnyWithWorldMapPositions(services, [[0, 0], [0, 1], [0, 2], [0, 3]]);
            expect(items).toHaveAnyWithWorldMapPositions(services, [[9, 3], [9, 4], [9, 5], [9, 6]]);
            expect(items).toHaveAnyWithWorldMapPositions(services, [[9, 0], [9, 1], [9, 2], [9, 3]]);
            expect(items).toHaveAnyWithWorldMapPositions(services, [[0, 0], [1, 0], [2, 0], [3, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0]]);
            expect(items).toHaveAnyWithWorldMapPositions(services, [[0, 3], [1, 3], [2, 3], [3, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3], [9, 3]]);
            expect(items).toHaveAnyWithWorldMapPositions(services, [[0, 6], [1, 6], [2, 6], [3, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6], [8, 6], [9, 6]]);
        });

        it ('segments the walls into as many pices as many rooms the wall spans', () => {
            const map = `
            map \`

            WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
            WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
            W---------------------------------------------------W
            W---------------------------------------------------W
            WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
            W-------------W-----------W-------------W----------WW
            W-------------W-----------W-------------W----------WW
            W-------------W-----------W-------------W----------WW
            W-------------W-----------W-------------W----------WW
            WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

            \`

            definitions \`

            W = wall BORDER
            D = door BORDER
            I = window BORDER
            - = room

            \`

            globals \`

                scale 1 1

            \`
            `;

            let services: ServiceFacade<any, any, any> = setup(map);

            const items = services.importerService.import(
                map,
                [
                    SegmentBordersModifier.modName,
                    ScaleModifier.modName
                ]
            );

            expect(items.filter(item => item.name === 'wall').length).toEqual(16);

            const middelVerticalWallSegments = [
                services.geometryService.factory.rectangle(0, 4, 15, 1),
                services.geometryService.factory.rectangle(15, 4, 13, 1)
            ];

            middelVerticalWallSegments.forEach(polygon =>
                expect(items).toHaveAnyWithDimensions(polygon)
            )
        });
    });
});