import { WorldItem } from '../../src/WorldItemInfo';
import { AssignBordersToRoomsModifier } from '../../src/modifiers/AssignBordersToRoomsModifier';
import { WorldItemInfoFactory, WorldParser } from '../../src';
import { CombinedWorldItemParser } from '../../src/parsers/CombinedWorldItemParser';
import { FurnitureInfoParser } from '../../src/parsers/furniture_parser/FurnitureInfoParser';
import { WorldMapToMatrixGraphConverter } from '../../src/matrix_graph/conversion/WorldMapToMatrixGraphConverter';
import { RoomSeparatorParser } from '../../src/parsers/room_separator_parser/RoomSeparatorParser';
import { RoomInfoParser } from '../../src/parsers/room_parser/RoomInfoParser';
import { RootWorldItemParser } from '../../src/parsers/RootWorldItemParser';
import { ScaleModifier } from '../../src/modifiers/ScaleModifier';
import { SegmentBordersModifier } from '../../src/modifiers/SegmentBordersModifier';
import { BuildHierarchyModifier } from '../../src/modifiers/BuildHierarchyModifier';
import { ConvertBorderPolyToLineModifier } from '../../src/modifiers/ConvertBorderPolyToLineModifier';

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
            new ScaleModifier(),
            new SegmentBordersModifier(worldItemInfoFactory, ['wall', 'door']),
            new BuildHierarchyModifier(),
            new AssignBordersToRoomsModifier(['wall', 'door']),
            new ConvertBorderPolyToLineModifier()
        ]
    );

    return worldMapParser.parse(map);
}



describe('ChangeBorderWidthModifier', () => {
    // it ('orders the border items within a room so that neighbouring border items are placed next to each other', () => {
    //     let room = new WorldItemInfo(1, 'room', null, 'room');
    //     room.borderItems = [
    //         new WorldItemInfo(0, 'wall', new Segment(new Point(0, 4), new Point(0, 6)), 'wall'),
    //         new WorldItemInfo(0, 'wall', new Segment(new Point(0, 0), new Point(0, 4)), 'wall'),
    //         new WorldItemInfo(0, 'wall', new Segment(new Point(4, 0), new Point(0, 0)), 'wall'),
    //         new WorldItemInfo(0, 'wall', new Segment(new Point(0, 7), new Point(4, 7)), 'wall'),
    //         new WorldItemInfo(0, 'wall', new Segment(new Point(4, 7), new Point(4, 0)), 'wall'),
    //         new WorldItemInfo(0, 'wall', new Segment(new Point(0, 6), new Point(0, 7)), 'wall')
    //     ];

    //     const transformator = new BorderItemWidthToRealWidthTransformator();

    //     [room] = transformator.transform([room]);

    //     expect(room.borderItems).toEqual(
    //         [
    //             new WorldItemInfo(0, 'wall', new Segment(new Point(0, 0), new Point(0, 4)), 'wall'),
    //             new WorldItemInfo(0, 'wall', new Segment(new Point(4, 0), new Point(0, 0)), 'wall'),
    //             new WorldItemInfo(0, 'wall', new Segment(new Point(4, 7), new Point(4, 0)), 'wall'),
    //             new WorldItemInfo(0, 'wall', new Segment(new Point(0, 7), new Point(4, 7)), 'wall'),
    //             new WorldItemInfo(0, 'wall', new Segment(new Point(0, 6), new Point(0, 7)), 'wall'),
    //             new WorldItemInfo(0, 'wall', new Segment(new Point(0, 4), new Point(0, 6)), 'wall')
    //         ]
    //     );
    // });

    // it ('resizes border', () => {
    //     let room = new WorldItemInfo(1, 'room', null, 'room');
    //     room.borderItems = [
    //         new WorldItemInfo(0, 'wall', new Segment(new Point(0, 0), new Point(0, 4)), 'wall'),
    //         new WorldItemInfo(0, 'wall', new Segment(new Point(4, 0), new Point(0, 0)), 'wall'),
    //         new WorldItemInfo(0, 'wall', new Segment(new Point(4, 7), new Point(4, 0)), 'wall'),
    //         new WorldItemInfo(0, 'wall', new Segment(new Point(0, 7), new Point(4, 7)), 'wall'),
    //         new WorldItemInfo(0, 'wall', new Segment(new Point(0, 6), new Point(0, 7)), 'wall'),
    //         new WorldItemInfo(0, 'door', new Segment(new Point(0, 4), new Point(0, 6)), 'door')
    //     ];

    //     const transformator = new BorderItemWidthToRealWidthTransformator([{name: 'door', width: 1}]);

    //     [room] = transformator.transform([room]);

    //     expect(room.borderItems).toEqual(
    //         [
    //             new WorldItemInfo(0, 'wall', new Segment(new Point(0, 0), new Point(0, 4.5)), 'wall'),
    //             new WorldItemInfo(0, 'wall', new Segment(new Point(4, 0), new Point(0, 0)), 'wall'),
    //             new WorldItemInfo(0, 'wall', new Segment(new Point(4, 7), new Point(4, 0)), 'wall'),
    //             new WorldItemInfo(0, 'wall', new Segment(new Point(0, 7), new Point(4, 7)), 'wall'),
    //             new WorldItemInfo(0, 'wall', new Segment(new Point(0, 5.5), new Point(0, 7)), 'wall'),
    //             new WorldItemInfo(0, 'door', new Segment(new Point(0, 4.5), new Point(0, 5.5)), 'door')
    //         ]
    //     );
    // });

    // it ('snaps the border to the corner if the resizable border is a corner item', () => {
    //     const map = `
    //     WWWWWWWWWWWWWWW
    //     W-------------W
    //     W-------------W
    //     W-------------W
    //     WDDDDWWWWWWDDDW

    //     `;

    //     const transformator = new BorderItemWidthToRealWidthTransformator([{name: 'door', width: 2}]);
    //     const [root] = transformator.transform(initBorderItems(map));

    //     expect(root.children[0]).toHaveBorders([
    //         new Segment(new Point(0.5, 0.5), new Point(0.5, 4.5)),
    //         new Segment(new Point(0.5, 0.5), new Point(14.5, 0.5)),
    //         new Segment(new Point(14.5, 0.5), new Point(14.5, 4.5)),
    //         new Segment(new Point(12.5, 4.5), new Point(14.5, 4.5)),
    //         new Segment(new Point(2.5, 4.5), new Point(12.5, 4.5)),
    //         new Segment(new Point(0.5, 4.5), new Point(2.5, 4.5)),
    //     ]);
    // });

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
