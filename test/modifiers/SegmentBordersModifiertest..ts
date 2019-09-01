import { Polygon } from "@nightshifts.inc/geometry";
import { SegmentBordersModifier } from "../../src/modifiers/SegmentBordersModifier";
import { ServiceFacade } from "../../src/services/ServiceFacade";
import { setup } from "../test_utils/mocks";
import _ = require("lodash");

function createMap(worldMap: string) {
    return `
        map \`

        ${worldMap}

        \`

        definitions \`

        - = empty
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

            let services: ServiceFacade<any, any, any> = setup();

            const items = services.importerService.import(
                map,
                [
                    SegmentBordersModifier.modName
                ]
            );

            expect(items.filter(item => item.name === 'wall').length).toEqual(7);

            expect(_.some(items, {dimensions: Polygon.createRectangle(0, 0, 1, 4)})).toBeTruthy();
            expect(_.some(items, {dimensions: Polygon.createRectangle(0, 3, 1, 4)})).toBeTruthy();
            expect(_.some(items, {dimensions: Polygon.createRectangle(9, 0, 1, 4)})).toBeTruthy();
            expect(_.some(items, {dimensions: Polygon.createRectangle(9, 3, 1, 4)})).toBeTruthy();
            expect(_.some(items, {dimensions: Polygon.createRectangle(0, 0, 10, 1)})).toBeTruthy();
            expect(_.some(items, {dimensions: Polygon.createRectangle(0, 3, 10, 1)})).toBeTruthy();
            expect(_.some(items, {dimensions: Polygon.createRectangle(0, 6, 10, 1)})).toBeTruthy();

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

            let services: ServiceFacade<any, any, any> = setup();

            const items = services.importerService.import(
                map,
                [
                    SegmentBordersModifier.modName
                ]
            );

            expect(items.filter(item => item.name === 'wall').length).toEqual(16);
        });
    });
});