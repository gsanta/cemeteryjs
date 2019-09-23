import { Point, Polygon } from '@nightshifts.inc/geometry';
import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';
import { AssignBordersToRoomsModifier } from '../../../src/model/modifiers/AssignBordersToRoomsModifier';
import { BuildHierarchyModifier } from '../../../src/model/modifiers/BuildHierarchyModifier';
import { ConvertBorderPolyToLineModifier } from '../../../src/model/modifiers/ConvertBorderPolyToLineModifier';
import { ScaleModifier } from '../../../src/model/modifiers/ScaleModifier';
import { SegmentBordersModifier } from '../../../src/model/modifiers/SegmentBordersModifier';
import { ServiceFacade } from '../../../src/model/services/ServiceFacade';
import { hasAnyWorldItemInfoDimension } from '../parsers/BorderParser.test';
import { findWorldItemWithDimensions, setup } from '../../test_utils/mocks';

function createMap(worldMap: string) {
    return `
        map \`

        ${worldMap}

        \`

        definitions \`

        W = wall
        D = door
        - = empty

        \`
    `;
}

describe(`ConvertBorderPolyToLineModifier`, () => {
    let services: ServiceFacade<any, any, any>;

    it ('tests the new implementation', () => {
        const map = createMap(
            `
            WWWWWWWWW
            W---W---W
            W---WWWWW
            W-------W
            WWWWWWWWW
            `
        );

        let services: ServiceFacade<any, any, any> = setup(map, []);

        const [root] = services.importerService.import(
            map,
            [
                ScaleModifier.modName,
                SegmentBordersModifier.modName,
                BuildHierarchyModifier.modName,
                AssignBordersToRoomsModifier.modName,
                ConvertBorderPolyToLineModifier.modName
            ]
        );

        const expectedRoomDimensions1 = new Polygon([
            new Point(0.5, 1),
            new Point(0.5, 9),
            new Point(8.5, 9),
            new Point(8.5, 5),
            new Point(4.5, 5),
            new Point(4.5, 1)
        ])
        expect(hasAnyWorldItemInfoDimension(expectedRoomDimensions1, root.children)).toBeTruthy();
        expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(4.5, 1, 4, 4), root.children)).toBeTruthy();
        expect(hasAnyWorldItemInfoDimension(new Segment(new Point(0.5, 1), new Point(0.5, 9)), root.children)).toBeTruthy();
        expect(hasAnyWorldItemInfoDimension(new Segment(new Point(8.5, 1), new Point(8.5, 5)), root.children)).toBeTruthy();
        expect(hasAnyWorldItemInfoDimension(new Segment(new Point(8.5, 5), new Point(8.5, 9)), root.children)).toBeTruthy();
        expect(hasAnyWorldItemInfoDimension(new Segment(new Point(0.5, 1), new Point(4.5, 1)), root.children)).toBeTruthy();
        expect(hasAnyWorldItemInfoDimension(new Segment(new Point(4.5, 1), new Point(8.5, 1)), root.children)).toBeTruthy();
        expect(hasAnyWorldItemInfoDimension(new Segment(new Point(0.5, 9), new Point(8.5, 9)), root.children)).toBeTruthy();
        // TODO: 2 border items are not validated, they have weird dimensions, check it later
    });

    describe('`apply`', () => {
        it ('sets the rotations for the borders correctly', () => {
            const map = createMap(`
                WDDWWWWW
                W------W
                W------W
                WWWWWWWW
            `);

            let services: ServiceFacade<any, any, any> = setup(map, []);

            const items = services.importerService.import(
                map,
                [
                    ScaleModifier.modName,
                    SegmentBordersModifier.modName,
                    BuildHierarchyModifier.modName,
                    AssignBordersToRoomsModifier.modName,
                    ConvertBorderPolyToLineModifier.modName
                ]
            );

            expect(findWorldItemWithDimensions(items, new Segment(new Point(0.5, 1), new Point(0.5, 7))).rotation).toEqual(Math.PI / 2);
            expect(findWorldItemWithDimensions(items, new Segment(new Point(7.5, 1), new Point(7.5, 7))).rotation).toEqual(Math.PI / 2);
            expect(findWorldItemWithDimensions(items, new Segment(new Point(0.5, 7), new Point(7.5, 7))).rotation).toEqual(0);
            expect(findWorldItemWithDimensions(items, new Segment(new Point(2.833333333333334, 1), new Point(7.5, 1))).rotation).toEqual(0);
            expect(findWorldItemWithDimensions(items, new Segment(new Point(0.5000000000000009, 1), new Point(2.833333333333334, 1))).rotation).toEqual(0);
        });

        it ('handles multiple rooms', () => {
            const map = createMap(`
                WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
                W-------------------------------W-------------------W
                W-------------------------------W-------------------W
                W-------------------------------W-------------------W
                WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
                W---------------------------------------------------W
                W---------------------------------------------------W
                W---------------------------------------------------W
                WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
                W-------------W-----------W-------------W-----------W
                W-------------W-----------W-------------W-----------W
                W-------------W-----------W-------------W-----------W
                W-------------W-----------W-------------W-----------W
                W-------------WWWWWWWWWWWWW-------------WWWWWWWWWWWWW
                W-------------------------W-------------------------W
                W-------------------------W-------------------------W
                W-------------------------W-------------------------W
                WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

            `);

            let services: ServiceFacade<any, any, any> = setup(map, []);

            const [root] = services.importerService.import(
                map,
                [
                    ScaleModifier.modName,
                    SegmentBordersModifier.modName,
                    BuildHierarchyModifier.modName,
                    AssignBordersToRoomsModifier.modName,
                    ConvertBorderPolyToLineModifier.modName
                ]
            );

            expect(root.children[0]).toHaveBorders([
                new Segment(new Point(0.5, 1), new Point(0.5, 9)),
                new Segment(new Point(32.5, 1), new Point(32.5, 9)),
                new Segment(new Point(0.5, 1), new Point(32.5, 1)),
                new Segment(new Point(0.5, 9), new Point(32.5, 9))
            ]);

            expect(root.children[1]).toHaveBorders([
                new Segment(new Point(32.5, 1), new Point(32.5, 9)),
                new Segment(new Point(52.5, 1), new Point(52.5, 9)),
                new Segment(new Point(32.5, 1), new Point(52.5, 1)),
                new Segment(new Point(32.5, 9), new Point(52.5, 9))
            ]);

            expect(root.children[2]).toHaveBorders([
                new Segment(new Point(0.5, 9), new Point(0.5, 17)),
                new Segment(new Point(52.5, 9), new Point(52.5, 17)),
                new Segment(new Point(0.5, 9), new Point(32.5, 9)),
                new Segment(new Point(32.5, 9), new Point(52.5, 9)),
                new Segment(new Point(0.5, 17), new Point(14.235849056603774, 17)),
                new Segment(new Point(14.235849056603776, 17), new Point(26.5, 17)),
                new Segment(new Point(26.499999999999996, 17), new Point(40.726415094339615, 17)),
                new Segment(new Point(40.726415094339615, 17), new Point(52.5, 17))
            ]);

            expect(root.children[3]).toHaveBorders([
                new Segment(new Point(0.5, 17), new Point(0.5, 35)),
                new Segment(new Point(14.5, 17), new Point(14.5, 27)),
                new Segment(new Point(26.5, 27), new Point(26.5, 35)),
                new Segment(new Point(0.5, 17), new Point(14.235849056603774, 17)),
                new Segment(new Point(0.5, 35), new Point(26.5, 35)),
                new Segment(new Point(14.5, 27), new Point(26.5, 27))
            ]);


            expect(root.children[4]).toHaveBorders([
                new Segment(new Point(14.5, 17), new Point(14.5, 27)),
                new Segment(new Point(26.5, 17), new Point(26.5, 27)),
                new Segment(new Point(14.235849056603776, 17), new Point(26.5, 17)),
                new Segment(new Point(14.5, 27), new Point(26.5, 27))
            ]);

            // //TODO: finish testing

        });
    });
});