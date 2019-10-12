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
        W = wall


        \`
    `;
}

describe ('BorderItemSegmentingTransformator', () => {
    describe('generate', () => {
        it ('segments the walls into smaller pieces so that no wall will cover more then one room', () => {
            const map = createMap(
                `
                WWWWWWWWWW
                W--------W
                W--------W
                WWWWWWWWWW
                W--------W
                W--------W
                WWWWWWWWWW
                `
            );

            let services: ServiceFacade<any, any, any> = setup(map);

            const items = services.importerService.import(
                map,
                [
                    ScaleModifier.modName,
                    SegmentBordersModifier.modName
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
        });

        it ('segments the walls into as many pices as many rooms the wall spans', () => {
            const map = createMap(
                `
                WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
                W---------------------------------------------------W
                W---------------------------------------------------W
                W---------------------------------------------------W
                WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
                W-------------W-----------W-------------W-----------W
                W-------------W-----------W-------------W-----------W
                W-------------W-----------W-------------W-----------W
                W-------------W-----------W-------------W-----------W
                WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
                `
            );

            let services: ServiceFacade<any, any, any> = setup(map);

            const items = services.importerService.import(
                map,
                [
                    ScaleModifier.modName,
                    SegmentBordersModifier.modName
                ]
            );

            expect(items.filter(item => item.name === 'wall').length).toEqual(16);
        });
    });
});