import { WorldItemInfo } from '../WorldItemInfo';
import { Segment, Point } from '@nightshifts.inc/geometry';
import { BorderItemWidthToRealWidthTransformator } from './BorderItemWidthToRealWidthTransformator';
import { expect } from 'chai';
import { BorderItemAddingTransformator } from './BorderItemAddingTransformator';
import { WorldItemInfoFactory, WorldParser } from '..';
import { CombinedWorldItemParser } from '../parsers/CombinedWorldItemParser';
import { FurnitureInfoParser } from '../parsers/furniture_parser/FurnitureInfoParser';
import { WorldMapToMatrixGraphConverter } from '../matrix_graph/conversion/WorldMapToMatrixGraphConverter';
import { RoomSeparatorParser } from '../parsers/room_separator_parser/RoomSeparatorParser';
import { RoomInfoParser } from '../parsers/room_parser/RoomInfoParser';
import { RootWorldItemParser } from '../parsers/RootWorldItemParser';
import { ScalingTransformator } from './ScalingTransformator';
import { BorderItemSegmentingTransformator } from './BorderItemSegmentingTransformator';
import { HierarchyBuildingTransformator } from './HierarchyBuildingTransformator';
import { BorderItemsToLinesTransformator } from './BorderItemsToLinesTransformator';

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

    // it.only ('works for a complicated example', () => {
    //     const map = `
    //         WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
    //         W---------------------------------------------------W
    //         W---------------------------------------------------W
    //         W---------------------------------------------------W
    //         WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
    //         W-------------W-----------W-------------W-----------W
    //         W-------------W-----------W-------------W-----------W
    //         W-------------W-----------W-------------W-----------W
    //         W-------------W-----------W-------------W-----------W
    //         W-------------WWWWWWWWWWWWW-------------WWWWWWWWWWWWW
    //         W-------------------------W-------------------------W
    //         W-------------------------W-------------------------W
    //         W-------------------------W-------------------------W
    //         WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

    //         `;
    //     debugger;
    //     const [root] = initBorderItems(map);

    //     debugger;
    // });
});
