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
import * as _ from 'lodash';
import { hasAnyWorldItemInfoDimension } from '../parsers/room_separator_parser/RoomSeparatorParser.test';

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
            expect(_.find(reducedPolygons, polygon => polygon.equalTo( Polygon.createRectangle(1, 1, 1, 3)))).to.be.ok
            expect(_.find(reducedPolygons, polygon => polygon.equalTo( Polygon.createRectangle(2, 3, 5, 1)))).to.be.ok
            expect(reducedPolygons.length).to.eql(2);
        });
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
        expect(hasAnyWorldItemInfoDimension(expectedRoomDimensions1, root.children)).to.be.true;
        expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(4.5, 0.5, 4, 2), root.children)).to.be.true;
        expect(hasAnyWorldItemInfoDimension(new Segment(new Point(0.5, 0.5), new Point(0.5, 4.5)), root.children)).to.be.true;
        expect(hasAnyWorldItemInfoDimension(new Segment(new Point(8.5, 0.5), new Point(8.5, 2.5)), root.children)).to.be.true;
        expect(hasAnyWorldItemInfoDimension(new Segment(new Point(8.5, 2.5), new Point(8.5, 4.5)), root.children)).to.be.true;
        expect(hasAnyWorldItemInfoDimension(new Segment(new Point(0.5, 0.5), new Point(4.5, 0.5)), root.children)).to.be.true;
        expect(hasAnyWorldItemInfoDimension(new Segment(new Point(4.5, 0.5), new Point(8.5, 0.5)), root.children)).to.be.true;
        expect(hasAnyWorldItemInfoDimension(new Segment(new Point(0.5, 4.5), new Point(8.5, 4.5)), root.children)).to.be.true;
        // TODO: 2 border items are not validated, they have weird dimensions, check it later
    });

    describe('`transform`', () => {
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

        // it ('handles multiple rooms', () => {
        //     const map = `
        //         WDDDWWWWWWWWWWWWW
        //         W-------W---W---W
        //         W-------W---WWWWW
        //         W-------W-------W
        //         WWWWWWWWWWWWWWWWW
        //     `;

        //     const [root] = initBorderItems(map);

        //     const items = new BorderItemsToLinesTransformator().transform([root]);
        // });

        it ('handles multiple rooms', () => {
            const map = `
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

            //room1
            expect(hasAnyWorldItemInfoDimension(new Segment(new Point(1, 1), new Point(1, 4)), root.children)).to.be.true;
            expect(hasAnyWorldItemInfoDimension(new Segment(new Point(52, 1), new Point(52, 4)), root.children)).to.be.true;
            expect(hasAnyWorldItemInfoDimension(new Segment(new Point(1, 1), new Point(52, 1)), root.children)).to.be.true;
            expect(hasAnyWorldItemInfoDimension(new Segment(new Point(1, 1), new Point(52, 1)), root.children)).to.be.true;
            expect(hasAnyWorldItemInfoDimension(new Segment(new Point(1, 4), new Point(14.222222222222221, 4)), root.children)).to.be.true;
            expect(hasAnyWorldItemInfoDimension(new Segment(new Point(14.222222222222221, 4), new Point(26.5, 4)), root.children)).to.be.true;
            expect(hasAnyWorldItemInfoDimension(new Segment(new Point(26.5, 4), new Point(40.66666666666667, 4)), root.children)).to.be.true;
            expect(hasAnyWorldItemInfoDimension(new Segment(new Point(40.66666666666667, 4), new Point(52, 4)), root.children)).to.be.true;

            //room2
            expect(hasAnyWorldItemInfoDimension(new Segment(new Point(0.5, 4.5), new Point(0.5, 13.5)), root.children)).to.be.true;
            expect(hasAnyWorldItemInfoDimension(new Segment(new Point(14.5, 4.5), new Point(14.5, 9.5)), root.children)).to.be.true;
            expect(hasAnyWorldItemInfoDimension(new Segment(new Point(26.5, 9.5), new Point(26.5, 13.5)), root.children)).to.be.true;
            expect(hasAnyWorldItemInfoDimension(new Segment(new Point(1, 4), new Point(14.222222222222221, 4)), root.children)).to.be.true;
            expect(hasAnyWorldItemInfoDimension(new Segment(new Point(0.5, 13.5), new Point(26.5, 13.5)), root.children)).to.be.true;
            expect(hasAnyWorldItemInfoDimension(new Segment(new Point(14.5, 9.5), new Point(26.5, 9.5)), root.children)).to.be.true;

            //TODO: finish testing

        });
    });
});