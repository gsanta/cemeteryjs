import { Point, Polygon } from '@nightshifts.inc/geometry';
import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';
import { AssignBordersToRoomsModifier } from '../../src/modifiers/AssignBordersToRoomsModifier';
import { BuildHierarchyModifier } from '../../src/modifiers/BuildHierarchyModifier';
import { ConvertBorderPolyToLineModifier } from '../../src/modifiers/ConvertBorderPolyToLineModifier';
import { ScaleModifier } from '../../src/modifiers/ScaleModifier';
import { SegmentBordersModifier } from '../../src/modifiers/SegmentBordersModifier';
import { ServiceFacade } from '../../src/services/ServiceFacade';
import { hasAnyWorldItemInfoDimension } from '../parsers/room_separator_parser/RoomSeparatorParser.test';
import { findWorldItemWithDimensions, setup } from '../test_utils/mocks';

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

        let services: ServiceFacade<any, any, any> = setup({xScale: 1, yScale: 1});

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
            new Point(0.5, 0.5),
            new Point(0.5, 4.5),
            new Point(8.5, 4.5),
            new Point(8.5, 2.5),
            new Point(4.5, 2.5),
            new Point(4.5, 0.5)
        ])
        expect(hasAnyWorldItemInfoDimension(expectedRoomDimensions1, root.children)).toBeTruthy();
        expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(4.5, 0.5, 4, 2), root.children)).toBeTruthy();
        expect(hasAnyWorldItemInfoDimension(new Segment(new Point(0.5, 0.5), new Point(0.5, 4.5)), root.children)).toBeTruthy();
        expect(hasAnyWorldItemInfoDimension(new Segment(new Point(8.5, 0.5), new Point(8.5, 2.5)), root.children)).toBeTruthy();
        expect(hasAnyWorldItemInfoDimension(new Segment(new Point(8.5, 2.5), new Point(8.5, 4.5)), root.children)).toBeTruthy();
        expect(hasAnyWorldItemInfoDimension(new Segment(new Point(0.5, 0.5), new Point(4.5, 0.5)), root.children)).toBeTruthy();
        expect(hasAnyWorldItemInfoDimension(new Segment(new Point(4.5, 0.5), new Point(8.5, 0.5)), root.children)).toBeTruthy();
        expect(hasAnyWorldItemInfoDimension(new Segment(new Point(0.5, 4.5), new Point(8.5, 4.5)), root.children)).toBeTruthy();
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

            let services: ServiceFacade<any, any, any> = setup({xScale: 1, yScale: 1});

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

            expect(findWorldItemWithDimensions(items, new Segment(new Point(0.5, 0.5), new Point(0.5, 3.5))).rotation).toEqual(Math.PI / 2);
            expect(findWorldItemWithDimensions(items, new Segment(new Point(7.5, 0.5), new Point(7.5, 3.5))).rotation).toEqual(Math.PI / 2);
            expect(findWorldItemWithDimensions(items, new Segment(new Point(0.5, 3.5), new Point(7.5, 3.5))).rotation).toEqual(0);
            expect(findWorldItemWithDimensions(items, new Segment(new Point(2.833333333333334, 0.5), new Point(7.5, 0.5))).rotation).toEqual(0);
            expect(findWorldItemWithDimensions(items, new Segment(new Point(0.5000000000000009, 0.5), new Point(2.833333333333334, 0.5))).rotation).toEqual(0);
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

            let services: ServiceFacade<any, any, any> = setup({xScale: 1, yScale: 1});

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
                new Segment(new Point(0.5, 0.5), new Point(0.5, 4.5)),
                new Segment(new Point(32.5, 0.5), new Point(32.5, 4.5)),
                new Segment(new Point(0.5, 0.5), new Point(32.5, 0.5)),
                new Segment(new Point(0.5, 4.5), new Point(32.5, 4.5))
            ]);

            expect(root.children[1]).toHaveBorders([
                new Segment(new Point(32.5, 0.5), new Point(32.5, 4.5)),
                new Segment(new Point(52.5, 0.5), new Point(52.5, 4.5)),
                new Segment(new Point(32.5, 0.5), new Point(52.5, 0.5)),
                new Segment(new Point(32.5, 4.5), new Point(52.5, 4.5))
            ]);

            expect(root.children[2]).toHaveBorders([
                new Segment(new Point(0.5, 4.5), new Point(0.5, 8.5)),
                new Segment(new Point(52.5, 4.5), new Point(52.5, 8.5)),
                new Segment(new Point(0.5, 4.5), new Point(32.5, 4.5)),
                new Segment(new Point(32.5, 4.5), new Point(52.5, 4.5)),
                new Segment(new Point(0.5, 8.5), new Point(14.235849056603774, 8.5)),
                new Segment(new Point(14.235849056603776, 8.5), new Point(26.5, 8.5)),
                new Segment(new Point(26.499999999999996, 8.5), new Point(40.726415094339615, 8.5)),
                new Segment(new Point(40.726415094339615, 8.5), new Point(52.5, 8.5))
            ]);

            expect(root.children[3]).toHaveBorders([
                new Segment(new Point(0.5, 8.5), new Point(0.5, 17.5)),
                new Segment(new Point(14.5, 8.5), new Point(14.5, 13.5)),
                new Segment(new Point(26.5, 13.5), new Point(26.5, 17.5)),
                new Segment(new Point(0.5, 8.5), new Point(14.235849056603774, 8.5)),
                new Segment(new Point(0.5, 17.5), new Point(26.5, 17.5)),
                new Segment(new Point(14.5, 13.5), new Point(26.5, 13.5))
            ]);


            expect(root.children[4]).toHaveBorders([
                new Segment(new Point(14.5, 8.5), new Point(14.5, 13.5)),
                new Segment(new Point(26.5, 8.5), new Point(26.5, 13.5)),
                new Segment(new Point(14.235849056603776, 8.5), new Point(26.5, 8.5)),
                new Segment(new Point(14.5, 13.5), new Point(26.5, 13.5))
            ]);

            // //TODO: finish testing

        });
    });
});