import { RoomInfoParser } from '../../src/parsers/room_parser/RoomInfoParser';
import { ConvertBorderPolyToLineModifier, mergeStraightAngledNeighbouringBorderItemPolygons } from '../../src/modifiers/ConvertBorderPolyToLineModifier';
import { WorldMapToMatrixGraphConverter } from '../../src/matrix_graph/conversion/WorldMapToMatrixGraphConverter';
import { ScaleModifier } from '../../src/modifiers/ScaleModifier';
import { Polygon, Point } from '@nightshifts.inc/geometry';
import { WorldItemFactory } from '../../src/WorldItemInfoFactory';
import { WorldItem } from '../../src/WorldItemInfo';
import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';
import { WorldParser } from '../../src';
import { CombinedWorldItemParser } from '../../src/parsers/CombinedWorldItemParser';
import { FurnitureInfoParser } from '../../src/parsers/furniture_parser/FurnitureInfoParser';
import { RoomSeparatorParser } from '../../src/parsers/room_separator_parser/RoomSeparatorParser';
import { RootWorldItemParser } from '../../src/parsers/RootWorldItemParser';
import { SegmentBordersModifier } from '../../src/modifiers/SegmentBordersModifier';
import { BuildHierarchyModifier } from '../../src/modifiers/BuildHierarchyModifier';
import { AssignBordersToRoomsModifier } from '../../src/modifiers/AssignBordersToRoomsModifier';
import * as _ from 'lodash';
import { hasAnyWorldItemInfoDimension } from '../parsers/room_separator_parser/RoomSeparatorParser.test';
import { findWorldItemWithDimensions } from '../test_utils/mocks';

const initBorderItems = (strMap: string): WorldItem[] => {
    const map = `
        map \`

        ${strMap}

        \`

        definitions \`

        W = wall
        D = door
        - = empty

        \`
    `;

    const options = {
        xScale: 1,
        yScale: 1,
        furnitureCharacters: [],
        roomSeparatorCharacters: ['wall', 'door']
    }

    const worldItemInfoFactory = new WorldItemFactory();
    const worldMapParser = WorldParser.createWithCustomWorldItemGenerator(
        new CombinedWorldItemParser(
            [
                new FurnitureInfoParser(worldItemInfoFactory, options.furnitureCharacters, new WorldMapToMatrixGraphConverter()),
                new RoomSeparatorParser(worldItemInfoFactory, options.roomSeparatorCharacters),
                new RoomInfoParser(worldItemInfoFactory),
                new RootWorldItemParser(worldItemInfoFactory)
            ]
        ),
        [
            new ScaleModifier(),
            new SegmentBordersModifier(worldItemInfoFactory, ['wall', 'door']),
            new BuildHierarchyModifier(),
            new AssignBordersToRoomsModifier(['wall', 'door'])
        ]
    );

    return worldMapParser.parse(map);
}


describe(`ConvertBorderPolyToLineModifier`, () => {
    it ('tests the new implementation', () => {
        const map = `
            map \`

            WWWWWWWWW
            W---W---W
            W---WWWWW
            W-------W
            WWWWWWWWW

            \`

            definitions \`

            W = wall
            - = empty

            \`
        `;

        const options = {
            xScale: 1,
            yScale: 1,
            furnitureCharacters: [],
            roomSeparatorCharacters: ['wall']
        }

        const worldItemInfoFactory = new WorldItemFactory();
        const worldMapParser = WorldParser.createWithCustomWorldItemGenerator(
            new CombinedWorldItemParser(
                [
                    new FurnitureInfoParser(worldItemInfoFactory, options.furnitureCharacters, new WorldMapToMatrixGraphConverter()),
                    new RoomSeparatorParser(worldItemInfoFactory, options.roomSeparatorCharacters),
                    new RoomInfoParser(worldItemInfoFactory),
                    new RootWorldItemParser(worldItemInfoFactory)
                ]
            ),
            [
                new ScaleModifier(),
                new SegmentBordersModifier(worldItemInfoFactory, ['wall']),
                new BuildHierarchyModifier(),
                new AssignBordersToRoomsModifier(['wall']),
            ]
        );

        const [root1] = worldMapParser.parse(map);
        const [root] = new ConvertBorderPolyToLineModifier().apply([root1]);

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
            const map = `
                WDDWWWWW
                W------W
                W------W
                WWWWWWWW
            `;

            const [root] = initBorderItems(map);

            const items = new ConvertBorderPolyToLineModifier().apply([root]);

            expect(findWorldItemWithDimensions(items, new Segment(new Point(0.5, 0.5), new Point(0.5, 3.5))).rotation).toEqual(Math.PI / 2);
            expect(findWorldItemWithDimensions(items, new Segment(new Point(7.5, 0.5), new Point(7.5, 3.5))).rotation).toEqual(Math.PI / 2);
            expect(findWorldItemWithDimensions(items, new Segment(new Point(0.5, 3.5), new Point(7.5, 3.5))).rotation).toEqual(0);
            expect(findWorldItemWithDimensions(items, new Segment(new Point(2.833333333333334, 0.5), new Point(7.5, 0.5))).rotation).toEqual(0);
            expect(findWorldItemWithDimensions(items, new Segment(new Point(0.5000000000000009, 0.5), new Point(2.833333333333334, 0.5))).rotation).toEqual(0);
        });

        it ('handles multiple types of border items (e.g doors, windows) beside walls', () => {
            const map = `
                WDDWWWWW
                W------W
                W------W
                WWWWWWWW
            `;

            const [root] = initBorderItems(map);

            const items = new ConvertBorderPolyToLineModifier().apply([root]);
        });

        it ('handles multiple rooms', () => {
            const map = `
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

                `;

            let [root] = initBorderItems(map);

            [root] = new ConvertBorderPolyToLineModifier().apply([root]);

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