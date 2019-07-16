/// <reference path="../../test/test.setup.ts"/>

import { WorldItemInfo } from '../../src/WorldItemInfo';
import { Segment, Point } from '@nightshifts.inc/geometry';
import { BorderItemWidthToRealWidthTransformator } from '../../src/transformators/BorderItemWidthToRealWidthTransformator';
import { expect } from 'chai';
import { BorderItemAddingTransformator } from '../../src/transformators/BorderItemAddingTransformator';
import { WorldItemInfoFactory, WorldParser } from '../../src';
import { CombinedWorldItemParser } from '../../src/parsers/CombinedWorldItemParser';
import { FurnitureInfoParser } from '../../src/parsers/furniture_parser/FurnitureInfoParser';
import { WorldMapToMatrixGraphConverter } from '../../src/matrix_graph/conversion/WorldMapToMatrixGraphConverter';
import { RoomSeparatorParser } from '../../src/parsers/room_separator_parser/RoomSeparatorParser';
import { RoomInfoParser } from '../../src/parsers/room_parser/RoomInfoParser';
import { RootWorldItemParser } from '../../src/parsers/RootWorldItemParser';
import { ScalingTransformator } from '../../src/transformators/ScalingTransformator';
import { BorderItemSegmentingTransformator } from '../../src/transformators/BorderItemSegmentingTransformator';
import { HierarchyBuildingTransformator } from '../../src/transformators/HierarchyBuildingTransformator';
import { BorderItemsToLinesTransformator } from '../../src/transformators/BorderItemsToLinesTransformator';

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
            new BorderItemAddingTransformator(['wall', 'door']),
            new BorderItemsToLinesTransformator()
        ]
    );

    return worldMapParser.parse(map);
}



describe('BorderItemWidthToRealWidthTransformator', () => {
    it ('orders the border items within a room so that neighbouring border items are placed next to each other', () => {
        let room = new WorldItemInfo(1, 'room', null, 'room');
        room.borderItems = [
            new WorldItemInfo(0, 'wall', new Segment(new Point(0, 4), new Point(0, 6)), 'wall'),
            new WorldItemInfo(0, 'wall', new Segment(new Point(0, 0), new Point(0, 4)), 'wall'),
            new WorldItemInfo(0, 'wall', new Segment(new Point(4, 0), new Point(0, 0)), 'wall'),
            new WorldItemInfo(0, 'wall', new Segment(new Point(0, 7), new Point(4, 7)), 'wall'),
            new WorldItemInfo(0, 'wall', new Segment(new Point(4, 7), new Point(4, 0)), 'wall'),
            new WorldItemInfo(0, 'wall', new Segment(new Point(0, 6), new Point(0, 7)), 'wall')
        ];

        const transformator = new BorderItemWidthToRealWidthTransformator();

        [room] = transformator.transform([room]);

        expect(room.borderItems).to.eql(
            [
                new WorldItemInfo(0, 'wall', new Segment(new Point(0, 0), new Point(0, 4)), 'wall'),
                new WorldItemInfo(0, 'wall', new Segment(new Point(4, 0), new Point(0, 0)), 'wall'),
                new WorldItemInfo(0, 'wall', new Segment(new Point(4, 7), new Point(4, 0)), 'wall'),
                new WorldItemInfo(0, 'wall', new Segment(new Point(0, 7), new Point(4, 7)), 'wall'),
                new WorldItemInfo(0, 'wall', new Segment(new Point(0, 6), new Point(0, 7)), 'wall'),
                new WorldItemInfo(0, 'wall', new Segment(new Point(0, 4), new Point(0, 6)), 'wall')
            ]
        );
    });

    it ('resizes border', () => {
        let room = new WorldItemInfo(1, 'room', null, 'room');
        room.borderItems = [
            new WorldItemInfo(0, 'wall', new Segment(new Point(0, 0), new Point(0, 4)), 'wall'),
            new WorldItemInfo(0, 'wall', new Segment(new Point(4, 0), new Point(0, 0)), 'wall'),
            new WorldItemInfo(0, 'wall', new Segment(new Point(4, 7), new Point(4, 0)), 'wall'),
            new WorldItemInfo(0, 'wall', new Segment(new Point(0, 7), new Point(4, 7)), 'wall'),
            new WorldItemInfo(0, 'wall', new Segment(new Point(0, 6), new Point(0, 7)), 'wall'),
            new WorldItemInfo(0, 'door', new Segment(new Point(0, 4), new Point(0, 6)), 'door')
        ];

        const transformator = new BorderItemWidthToRealWidthTransformator([{name: 'door', width: 1}]);

        [room] = transformator.transform([room]);

        expect(room.borderItems).to.eql(
            [
                new WorldItemInfo(0, 'wall', new Segment(new Point(0, 0), new Point(0, 4.5)), 'wall'),
                new WorldItemInfo(0, 'wall', new Segment(new Point(4, 0), new Point(0, 0)), 'wall'),
                new WorldItemInfo(0, 'wall', new Segment(new Point(4, 7), new Point(4, 0)), 'wall'),
                new WorldItemInfo(0, 'wall', new Segment(new Point(0, 7), new Point(4, 7)), 'wall'),
                new WorldItemInfo(0, 'wall', new Segment(new Point(0, 5.5), new Point(0, 7)), 'wall'),
                new WorldItemInfo(0, 'door', new Segment(new Point(0, 4.5), new Point(0, 5.5)), 'door')
            ]
        );
    });

    it ('snaps the border to the corner if the resizable border is a corner item', () => {
        const map = `
        WWWWWWWWWWWWWWW
        W-------------W
        W-------------W
        W-------------W
        WDDDDWWWWWWDDDW

        `;

        const transformator = new BorderItemWidthToRealWidthTransformator([{name: 'door', width: 2}]);
        const [root] = transformator.transform(initBorderItems(map));

        expect(root.children[0]).to.haveBorders([
            new Segment(new Point(0.5, 0.5), new Point(0.5, 4.5)),
            new Segment(new Point(0.5, 0.5), new Point(14.5, 0.5)),
            new Segment(new Point(14.5, 0.5), new Point(14.5, 4.5)),
            new Segment(new Point(12.5, 4.5), new Point(14.5, 4.5)),
            new Segment(new Point(2.5, 4.5), new Point(12.5, 4.5)),
            new Segment(new Point(0.5, 4.5), new Point(2.5, 4.5)),
        ]);
    });

    it ('works for a complicated example', () => {
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
        const [root] = initBorderItems(map);

    });
});
