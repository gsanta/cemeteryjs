import { RoomInfoParser } from '../../src/parsers/room_parser/RoomInfoParser';
import { BorderItemsToLinesTransformator, mergeStraightAngledNeighbouringBorderItemPolygons } from '../../src/transformators/BorderItemsToLinesTransformator';
import { WorldMapToMatrixGraphConverter } from '../../src/matrix_graph/conversion/WorldMapToMatrixGraphConverter';
import { ScalingTransformator } from '../../src/transformators/ScalingTransformator';
import { Polygon, Point } from '@nightshifts.inc/geometry';
import { WorldItemInfoFactory } from '../../src/WorldItemInfoFactory';
import { WorldItemInfo } from '../../src/WorldItemInfo';
import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';
import { WorldParser } from '../../src';
import { CombinedWorldItemParser } from '../../src/parsers/CombinedWorldItemParser';
import { FurnitureInfoParser } from '../../src/parsers/furniture_parser/FurnitureInfoParser';
import { RoomSeparatorParser } from '../../src/parsers/room_separator_parser/RoomSeparatorParser';
import { RootWorldItemParser } from '../../src/parsers/RootWorldItemParser';
import { BorderItemSegmentingTransformator } from '../../src/transformators/BorderItemSegmentingTransformator';
import { HierarchyBuildingTransformator } from '../../src/transformators/HierarchyBuildingTransformator';
import { BorderItemAddingTransformator } from '../../src/transformators/BorderItemAddingTransformator';
import * as _ from 'lodash';
import { hasAnyWorldItemInfoDimension } from '../parsers/room_separator_parser/RoomSeparatorParser.test';
import { findWorldItemWithDimensions } from '../testUtils';

const initBorderItems = (strMap: string): WorldItemInfo[] => {
    const map = `
        map \`

        ${strMap}

        \`

        definitions \`

        W = wall
        D = door

        \`
    `;

    const options = {
        xScale: 1,
        yScale: 1,
        furnitureCharacters: [],
        roomSeparatorCharacters: ['wall', 'door']
    }

    const worldItemInfoFactory = new WorldItemInfoFactory();
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
            new ScalingTransformator(),
            new BorderItemSegmentingTransformator(worldItemInfoFactory, ['wall', 'door']),
            new HierarchyBuildingTransformator(),
            new BorderItemAddingTransformator(['wall', 'door'])
        ]
    );

    return worldMapParser.parse(map);
}


describe('`BorderItemsToLinesTransformator`', () => {
    describe('mergeStraightAngledNeighbouringBorderItemPolygons', () => {

        // it ('reduces the number of `Polygon`s as much as possible by merging `Polygon`s with common edge', () => {

        //     const polygons = [
        //         Polygon.createRectangle(1, 1, 1, 3),
        //         Polygon.createRectangle(2, 3, 2, 1),
        //         Polygon.createRectangle(4, 3, 3, 1)
        //     ];
        //     const reducedPolygons = mergeStraightAngledNeighbouringBorderItemPolygons(polygons);
        //     expect(_.find(reducedPolygons, polygon => polygon.equalTo( Polygon.createRectangle(1, 1, 1, 3)))).toBeTruthy()
        //     expect(_.find(reducedPolygons, polygon => polygon.equalTo( Polygon.createRectangle(2, 3, 5, 1)))).toBeTruthy()
        //     expect(reducedPolygons.length).toEqual(2);
        // });
    });

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

            \`
        `;

        const options = {
            xScale: 1,
            yScale: 1,
            furnitureCharacters: [],
            roomSeparatorCharacters: ['wall']
        }

        const worldItemInfoFactory = new WorldItemInfoFactory();
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
                new ScalingTransformator(),
                new BorderItemSegmentingTransformator(worldItemInfoFactory, ['wall']),
                new HierarchyBuildingTransformator(),
                new BorderItemAddingTransformator(['wall']),
            ]
        );

        const [root1] = worldMapParser.parse(map);
        const [root] = new BorderItemsToLinesTransformator().transform([root1]);

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

    describe('`transform`', () => {
        it ('sets the rotations for the borders correctly', () => {
            const map = `
                WDDWWWWW
                W------W
                W------W
                WWWWWWWW
            `;

            const [root] = initBorderItems(map);

            const items = new BorderItemsToLinesTransformator().transform([root]);

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

            const items = new BorderItemsToLinesTransformator().transform([root]);
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

            [root] = new BorderItemsToLinesTransformator().transform([root]);

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