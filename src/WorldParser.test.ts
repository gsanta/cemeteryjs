import { WorldParser, defaultParseOptions } from './WorldParser';
import { expect } from 'chai';
import * as fs from 'fs';
import { WorldItemInfo } from './WorldItemInfo';
import { AdditionalDataConvertingTransformator } from './transformators/AdditionalDataConvertingTransformator';
import { BorderItemAddingTransformator } from './transformators/BorderItemAddingTransformator';
import { HierarchyBuildingTransformator } from './transformators/HierarchyBuildingTransformator';
import { ScalingTransformator } from './transformators/ScalingTransformator';
import { CombinedWorldItemParser } from './parsers/CombinedWorldItemParser';
import { FurnitureInfoParser } from './parsers/furniture_parser/FurnitureInfoParser';
import { WorldMapToMatrixGraphConverter } from './matrix_graph/conversion/WorldMapToMatrixGraphConverter';
import { RoomSeparatorParser } from './parsers/room_separator_parser/RoomSeparatorParser';
import { RoomInfoParser } from './parsers/room_parser/RoomInfoParser';
import { RootWorldItemParser } from './parsers/RootWorldItemParser';
import { BorderItemSegmentingTransformator } from './transformators/BorderItemSegmentingTransformator';
import { BorderItemsToLinesTransformator } from './transformators/BorderItemsToLinesTransformator';
import { PolygonAreaInfoParser } from './parsers/polygon_area_parser/PolygonAreaInfoParser';
import {Polygon, Point, Line} from '@nightshifts.inc/geometry';
import { WorldItemInfoFactory } from './WorldItemInfoFactory';
import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';

describe('`WorldParser`', () => {
    describe('parse', () => {
        it ('creates a WorldItem for every distinguishable item in the input map', () => {
            const map = `
                map \`

                WWWIIWWW
                W--TT--W
                WWWWWWWW


                \`

                definitions \`

                - = empty
                W = wall
                I = window
                T = table
                \`
            `;

            const gameObjectParser = WorldParser.createWithOptions(
                { furnitureCharacters: ['T'], roomSeparatorCharacters: ['W', 'I']}
            );

            const [root] = gameObjectParser.parse(map);
            const children = root.children;
            expect(children.length).to.equal(7, 'number of children of root is not correct.');
            expect(children[0]).to.eql(new WorldItemInfo(2, 'W', Polygon.createRectangle(0, 0, 1, 3), 'wall'), 'children[0] is not correct');
            expect(children[1]).to.eql(new WorldItemInfo(3, 'W', Polygon.createRectangle(7, 0, 1, 3), 'wall'), 'children[1] is not correct');
            expect(children[2]).to.eql(new WorldItemInfo(4, 'W', Polygon.createRectangle(1, 0, 2, 1), 'wall'), 'children[2] is not correct');
            expect(children[3]).to.eql(new WorldItemInfo(5, 'W', Polygon.createRectangle(1, 2, 6, 1), 'wall'), 'children[3] is not correct');
            expect(children[4]).to.eql(new WorldItemInfo(6, 'W', Polygon.createRectangle(5, 0, 2, 1), 'wall'), 'children[4] is not correct');
            expect(children[5]).to.eql(new WorldItemInfo(7, 'I', Polygon.createRectangle(3, 0, 2, 1), 'window'), 'children[5] is not correct');
            expect(children[6].name).to.eql('room', 'children[6] is not correct');
        });

        it ('can parse the additional data for a WorldItem.', () => {
            const map = `
                map \`

                WWWWWWWWWW
                W---II---W
                W---T----W
                W--------W
                WWWWWWWWWW

                \`

                definitions \`

                # = empty
                I = window
                W = wall
                T = table

                \`

                details2 \`

                T = pos(4,2) axis1(4,2) axis2(13,2) angle(-90)

                \`
            `;

            const worldMapParser = WorldParser.createWithOptions(
                { furnitureCharacters: ['I', 'T'], roomSeparatorCharacters: ['W']}
            );

            const [root] = worldMapParser.parse(map);
            const room = root.children.filter(item => item.name === 'room')[0];

            expect(room.children[1].additionalData).to.eql({
                angle: -90,
                axis1: {
                    x: 4, y: 2
                },
                axis2: {
                    x: 13, y: 2
                },
                pos: {
                    x: 4, y: 2
                }
            });
        });

        it('attaches the additional data to vertices, if present TEST CASE 1', () => {
            const file = fs.readFileSync(__dirname + '/../assets/test/testAdditionalData.gwm', 'utf8');
            const worldMapParser = WorldParser.createWithOptions(
                { furnitureCharacters: ['I'], roomSeparatorCharacters: ['W']}
            );

            const [root] = worldMapParser.parse(file);
            const room = root.children.filter(item => item.name === 'room')[0];
            expect(room.children[0].additionalData).to.eql({
                angle: 90,
                axis: {
                    x: 4, y: 1
                },
                pos: {
                    x: 4, y: 1
                }
            })
        });

        it ('attaches the additional data to vertices, if present TEST CASE 2', () => {
            const file = fs.readFileSync(__dirname + '/../assets/test/testAdditionalData2.gwm', 'utf8');
            const worldMapParser = WorldParser.createWithOptions(
                { furnitureCharacters: ['I'], roomSeparatorCharacters: ['W']}
            );

            const [root] = worldMapParser.parse(file);
            const room = root.children.filter(item => item.name === 'room')[0];

            expect(room.children[0].additionalData).to.eql({
                angle: 90,
                axis: {
                    x: 4, y: 1
                },
                pos: {
                    x: 4, y: 1
                }
            });
        });

        it ('attaches the additional data to vertices for rectangular GameObjects', () => {
            const map = `
                map \`

                WWWWWWWWWW
                W###II###W
                W###II###W
                W########W
                WWWWWWWWWW

                \`

                definitions \`

                # = empty
                I = window

                \`

                details2 \`

                I = pos(4,1) orientation(EAST)

                \`
            `;

            const worldMapParser = WorldParser.createWithOptions(
                { furnitureCharacters: ['I'], roomSeparatorCharacters: ['W']}
            );
            const [root] = worldMapParser.parse(map);
            const room = root.children.filter(item => item.name === 'room')[0];

            expect(room.children[0].additionalData).to.eql({
                "pos": {
                    "x": 4,
                    "y": 1
                },
                "orientation": "EAST"
            });
        });

        it ('converts the additional data if conversion function provided', () => {
            const map = `
                map \`

                WWWW
                WC#W
                WWWW
                \`

                definitions \`

                # = empty
                C = cupboard

                \`

                details2 \`

                I = pos(1,1) orientation(EAST)

                \`
            `;

            const additionalDataConverter = (additionalData?) => {
                return additionalData ?
                    { orientation: `${additionalData.orientation}_CONVERTED` } :
                    null
            };

            const worldMapParser = WorldParser.createWithOptions(
                { furnitureCharacters: ['C'], roomSeparatorCharacters: ['W']},
                {...defaultParseOptions, ...{additionalDataConverter}}
            );
            const [root] = worldMapParser.parse(map);

            const room = root.children.filter(item => item.name === 'room')[0];

            expect(room.children[0].additionalData).to.eql({
                "orientation": "EAST_CONVERTED"
            });
        });

        it ('creates a polygon for every room', () => {
            const map = `
                map \`

                WIIWW
                W---W
                W---W
                WWDDW

                \`
            `;

            const worldMapParser = WorldParser.createWithOptions({ furnitureCharacters: [], roomSeparatorCharacters: ['W', 'I', 'D']});
            const items = worldMapParser.parse(map);
            const rooms = items[0].children.filter(item => item.name === 'room');
            expect(rooms.length).to.eq(1);
            expect(rooms[0].dimensions.points).to.eql([
                new Point(1, 1),
                new Point(4, 1),
                new Point(4, 3),
                new Point(1, 3),
            ]);
        });


        it ('scales the polygons if scale option is changed.', () => {
            const map = `
                map \`

                WIIWW
                W###W
                W###W
                WWDDW

                \`
            `;

            const worldMapParser = WorldParser.createWithOptions(
                { furnitureCharacters: [], roomSeparatorCharacters: ['W', 'I', 'D']},
                {...defaultParseOptions, ...{xScale: 2, yScale: 3}}
            );
            const [root] = worldMapParser.parse(map);
            const rooms = root.children.filter(item => item.name === 'room');

            expect(rooms.length).to.eq(1);
            expect(rooms[0].dimensions.points).to.eql([
                new Point(2, 3),
                new Point(8, 3),
                new Point(8, 9),
                new Point(2, 9)
            ]);
        });

        it ('builds a hierarchy between rooms and the furnitures inside the rooms', () => {
            const map = `
                map \`

                WWDDWWWDDWWW
                WCCC##WBB##W
                WCCC##W####W
                W#####WBB##W
                WWWWWWWWWWWW

                \`

                definitions \`

                # = empty
                D = door
                C = cupboard
                B = bed
                W = wall

                \`
            `;

            const worldMapParser = WorldParser.createWithOptions(
                { furnitureCharacters: ['B', 'C'], roomSeparatorCharacters: ['W', 'I', 'D']},
                {...defaultParseOptions, ...{xScale: 1, yScale: 2}}
            );
            const items = worldMapParser.parse(map);

            const [root] = items.filter(item => item.name === 'root');
            const [room1, room2] = root.children.filter(item => item.name === 'room');

            expect(room1.children.length).to.eql(1);
            expect(room2.children.length).to.eql(2);
            expect(root.children.length).to.eq(12);
        });

        it ('adds the bordering `WorldItem`s to the corresponding rooms', () => {
            const map = `
                map \`

                WWDDWWWDDWWW
                WCCC--WBB--W
                WCCC--W----W
                W-----WBB##W
                WWWWWWWWWWWW

                \`

                definitions \`

                D = door
                C = cupboard
                B = bed
                W = wall

                \`
            `;

            const worldMapParser = WorldParser.createWithOptions(
                { furnitureCharacters: ['B', 'C'], roomSeparatorCharacters: ['W', 'D']},
                {...defaultParseOptions, ...{xScale: 1, yScale: 1}}
            );
            const [root] = worldMapParser.parse(map);

            const [room1, room2] = root.children.filter(item => item.name === 'room');

            expect(room1.borderItems.length).to.eql(5);
            expect(room2.borderItems.length).to.eql(5);
        });
    });

    it ('integrates correctly the BorderItemSegmentingWorldItemGeneratorDecorator if used', () => {
        const map = `
            map \`

            WWDDWWWDDWWW
            WCCC--WBB--W
            WCCC--W----W
            W-----WBB##W
            WWWWWWWWWWWW

            \`

            definitions \`

            D = door
            C = cupboard
            B = bed
            W = wall

            \`
        `;

        const options = {
            xScale: 1,
            yScale: 1,
            furnitureCharacters: ['C', 'B'],
            roomSeparatorCharacters: ['W', 'D', 'I']
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
                new ScalingTransformator({ x: options.xScale, y: options.yScale }),
                new BorderItemSegmentingTransformator(worldItemInfoFactory, ['wall', 'door', 'window']),
                new HierarchyBuildingTransformator(),
                new BorderItemAddingTransformator(['wall', 'door', 'window']),
                new AdditionalDataConvertingTransformator()
            ]
        );

        const [root] = worldMapParser.parse(map);
        const walls = root.children.filter(item => item.name === 'wall');

        expect(walls.length).to.eql(8);
    });

    it ('integrates correctly the `BorderItemsToLinesTransformator` if used', () => {
        const map = `
            map \`

            WWWWWWWWW
            W---W---W
            W---W---W
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
                new BorderItemsToLinesTransformator(),
                new AdditionalDataConvertingTransformator()
            ]
        );

        const [root] = worldMapParser.parse(map);

        expect(root.children.length).to.eql(9);
        const room1 = root.children[0];
        expect(room1.dimensions).to.eql(new Polygon([new Point(0.5, 0.5), new Point(4.5, 0.5), new Point(4.5, 3.5), new Point(0.5, 3.5)]));
        const room2 = root.children[1];
        expect(room2.dimensions).to.eql(new Polygon([new Point(4.5, 0.5), new Point(8.5, 0.5), new Point(8.5, 3.5), new Point(4.5, 3.5)]));
        const randomWall1 = root.children[2];
        expect(randomWall1.dimensions).to.eql(new Segment(new Point(0.5, 0), new Point(0.5, 4)));
        const randomWall2 = root.children[5];
        expect(randomWall2.dimensions).to.eql(new Segment(new Point(1, 0.5), new Point(4, 0.5)));
    });

    it ('can integrate with `PolygonAreaInfoGenerator`', () => {
        const map = `
            map \`

            WWWWWWWW
            W---W--W
            W---WWWW
            W------W
            W------W
            WWWWWWWW

            \`
        `;

        const worldItemInfoFactory = new WorldItemInfoFactory();
        const worldMapParser = WorldParser.createWithCustomWorldItemGenerator(
            new CombinedWorldItemParser(
                [
                    new RoomInfoParser(worldItemInfoFactory),
                    new PolygonAreaInfoParser(worldItemInfoFactory, 'empty', '-'),
                    new RootWorldItemParser(worldItemInfoFactory)
                ]
            ),
            [new HierarchyBuildingTransformator()]
        );

        const [root] = worldMapParser.parse(map);

        expect(root.children.length).to.eq(2, 'root\'s children size is incorrect');
        expect(root.children[0].name).to.eq('room');
        const room = root.children[0];
        expect(room.children.length).to.eq(1, 'room\'s children size is incorrect');
        expect(room.children[0].name).to.eq('empty');
    });
});
