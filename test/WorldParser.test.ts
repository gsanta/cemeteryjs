import { WorldParser, defaultParseOptions } from '../src/WorldParser';
import { expect } from 'chai';
import * as fs from 'fs';
import { WorldItemInfo } from '../src/WorldItemInfo';
import { BorderItemAddingTransformator } from '../src/transformators/BorderItemAddingTransformator';
import { HierarchyBuildingTransformator } from '../src/transformators/HierarchyBuildingTransformator';
import { ScalingTransformator } from '../src/transformators/ScalingTransformator';
import { CombinedWorldItemParser } from '../src/parsers/CombinedWorldItemParser';
import { FurnitureInfoParser } from '../src/parsers/furniture_parser/FurnitureInfoParser';
import { WorldMapToMatrixGraphConverter } from '../src/matrix_graph/conversion/WorldMapToMatrixGraphConverter';
import { RoomSeparatorParser } from '../src/parsers/room_separator_parser/RoomSeparatorParser';
import { RoomInfoParser } from '../src/parsers/room_parser/RoomInfoParser';
import { RootWorldItemParser } from '../src/parsers/RootWorldItemParser';
import { BorderItemSegmentingTransformator } from '../src/transformators/BorderItemSegmentingTransformator';
import { BorderItemsToLinesTransformator } from '../src/transformators/BorderItemsToLinesTransformator';
import { PolygonAreaInfoParser } from '../src/parsers/polygon_area_parser/PolygonAreaInfoParser';
import {Polygon, Point, Line} from '@nightshifts.inc/geometry';
import { WorldItemInfoFactory } from '../src/WorldItemInfoFactory';
import _ = require('lodash');

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
            expect(children[0]).to.eql(new WorldItemInfo(2, 'W', Polygon.createRectangle(0, 0, 1, 3), 'wall', true), 'children[0] is not correct');
            expect(children[1]).to.eql(new WorldItemInfo(3, 'W', Polygon.createRectangle(7, 0, 1, 3), 'wall', true), 'children[1] is not correct');
            expect(children[2]).to.eql(new WorldItemInfo(4, 'W', Polygon.createRectangle(0, 0, 3, 1), 'wall', true), 'children[2] is not correct');
            expect(children[3]).to.eql(new WorldItemInfo(5, 'W', Polygon.createRectangle(0, 2, 8, 1), 'wall', true), 'children[3] is not correct');
            expect(children[4]).to.eql(new WorldItemInfo(6, 'W', Polygon.createRectangle(5, 0, 3, 1), 'wall', true), 'children[4] is not correct');
            expect(children[5]).to.eql(new WorldItemInfo(7, 'I', Polygon.createRectangle(3, 0, 2, 1), 'window', true), 'children[5] is not correct');
            expect(children[6].name).to.eql('room', 'children[6] is not correct');
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
            expect(rooms[0].dimensions.equalTo(new Polygon([
                new Point(2, 3),
                new Point(2, 9),
                new Point(8, 9),
                new Point(8, 3)
            ]))).to.be.ok;
        });

        it ('adds the bordering `WorldItem`s to the corresponding rooms', () => {
            const map = `
                map \`

                WWWDDWWWWWDDWWW
                WCCC---WBB----W
                WCCC---W------W
                W------WBB----W
                WWWWWWWWWWWWWWW

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
                    new BorderItemAddingTransformator(['wall', 'door', 'window'])
                ]
            );

            const [root] = worldMapParser.parse(map);

            const [room1, room2] = root.children.filter(item => item.name === 'room');
            expect(room1.borderItems.length).to.eql(6);
            expect(room2.borderItems.length).to.eql(6);
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
                new BorderItemAddingTransformator(['wall', 'door', 'window'])
            ]
        );

        const [root] = worldMapParser.parse(map);
        const walls = root.children.filter(item => item.name === 'wall');

        expect(walls.length).to.eql(8);
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

    it ('can parse this', () => {
        const map = `
            map \`

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
});
