import { RoomInfoParser } from '../parsers/room_parser/RoomInfoParser';
import { BorderItemsToLinesTransformator, mergeStraightAngledNeighbouringBorderItemPolygons } from './BorderItemsToLinesTransformator';
import { expect } from 'chai';
import { WorldMapToMatrixGraphConverter } from '../matrix_graph/conversion/WorldMapToMatrixGraphConverter';
import { WorldMapToRoomMapConverter } from '../parsers/room_parser/WorldMapToRoomMapConverter';
import { ScalingTransformator } from './ScalingTransformator';
import { PolygonAreaInfoParser } from '../parsers/polygon_area_parser/PolygonAreaInfoParser';
import { Polygon, Point } from '@nightshifts.inc/geometry';
import { WorldItemInfoFactory } from '../WorldItemInfoFactory';
import { WorldItemInfo } from '../WorldItemInfo';
import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';
import { WorldParser } from '..';
import { CombinedWorldItemParser } from '../parsers/CombinedWorldItemParser';
import { FurnitureInfoParser } from '../parsers/furniture_parser/FurnitureInfoParser';
import { RoomSeparatorParser } from '../parsers/room_separator_parser/RoomSeparatorParser';
import { RootWorldItemParser } from '../parsers/RootWorldItemParser';
import { BorderItemSegmentingTransformator } from './BorderItemSegmentingTransformator';
import { HierarchyBuildingTransformator } from './HierarchyBuildingTransformator';
import { BorderItemAddingTransformator } from './BorderItemAddingTransformator';

var Offset = require('polygon-offset');

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
        roomSeparatorCharacters: ['W', 'D']
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

        it ('reduces the number of `Polygon`s as much as possible by merging `Polygon`s with common edge', () => {

            const polygons = [
                Polygon.createRectangle(1, 1, 1, 3),
                Polygon.createRectangle(2, 3, 2, 1),
                Polygon.createRectangle(4, 3, 3, 1)
            ];

            const reducedPolygons = mergeStraightAngledNeighbouringBorderItemPolygons(polygons);
            expect(reducedPolygons.length).to.eql(2);
        });
    });

    it.skip ('tests the new implementation', () => {
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
            roomSeparatorCharacters: ['W']
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
                new BorderItemsToLinesTransformator()
            ]
        );

        const [root1] = worldMapParser.parse(map);


    });

    describe('`transform`', () => {
        it ('converts the border items to `Line`s and stretches the rooms so they fill up the gaps.', () => {
            const borderItems = [
                new WorldItemInfo(1, 'wall', new Polygon([new Point(1, 1), new Point(1, 5), new Point(2, 5), new Point(2, 1)]), 'wall'),
                new WorldItemInfo(2, 'wall', new Polygon([new Point(2, 4), new Point(2, 5), new Point(6, 5), new Point(6, 4)]), 'wall'),
                new WorldItemInfo(3, 'wall', new Polygon([new Point(6, 1), new Point(6, 5), new Point(7, 5), new Point(7, 1)]), 'wall'),
                new WorldItemInfo(4, 'wall', new Polygon([new Point(2, 1), new Point(2, 2), new Point(6, 2), new Point(6, 1)]), 'wall')
            ];

            const poly1 = new Polygon([
                new Point(2, 2),
                new Point(2, 4),
                new Point(6, 4),
                new Point(6, 2)
            ]);

            const worldItemInfo = new WorldItemInfo(5, 'room', poly1, 'room');
            worldItemInfo.borderItems = borderItems;

            const items = new BorderItemsToLinesTransformator().transform([worldItemInfo]);
            expect(items[0].dimensions).to.eql(new Polygon([
                new Point(1.5, 1.5),
                new Point(1.5, 4.5),
                new Point(6.5, 4.5),
                new Point(6.5, 1.5)
            ]), 'room dimensions are not correct');

            const segment1 = new Segment(new Point(1.5, 1.5), new Point(1.5, 4.5))
            expect(items[0].borderItems[0].dimensions).to.eql(segment1, 'first border item dimensions are not correct');

            const segment2 = new Segment(new Point(1.5, 4.5), new Point(6.5, 4.5));
            expect(items[0].borderItems[1].dimensions).to.eql(segment2, 'second border item dimensions are correct');

            const segment3 = new Segment(new Point(6.5, 4.5), new Point(6.5, 1.5));
            expect(items[0].borderItems[2].dimensions.equalTo(segment3)).to.eql(true, 'third border item dimensions are correct');

            const segment4 = new Segment(new Point(6.5, 1.5), new Point(1.5, 1.5));
            expect(items[0].borderItems[3].dimensions.equalTo(segment4)).to.eql(true, 'fourth border item dimensions are correct');
        });

        it ('handles multiple types of border items (e.g doors, windows) beside walls', () => {
            const map = `
                WDDDWWWWW
                W-------W
                W-------W
                W-------W
                WWWWWWWWW
            `;

            const [root] = initBorderItems(map);

            const items = new BorderItemsToLinesTransformator().transform([root]);
        });

        it ('handles multiple rooms', () => {
            const map = `
                WDDDWWWWWWWWWWWWW
                W-------W---W---W
                W-------W---WWWWW
                W-------W-------W
                WWWWWWWWWWWWWWWWW
            `;

            const [root] = initBorderItems(map);

            const items = new BorderItemsToLinesTransformator().transform([root]);
        });
    });
});