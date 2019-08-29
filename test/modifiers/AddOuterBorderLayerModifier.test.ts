import { WorldItemInfo, WorldItemInfoFactory, WorldParser } from "../../src";
import { CombinedWorldItemParser } from "../../src/parsers/CombinedWorldItemParser";
import { FurnitureInfoParser } from "../../src/parsers/furniture_parser/FurnitureInfoParser";
import { WorldMapToMatrixGraphConverter } from "../../src/matrix_graph/conversion/WorldMapToMatrixGraphConverter";
import { RoomSeparatorParser } from "../../src/parsers/room_separator_parser/RoomSeparatorParser";
import { RoomInfoParser } from "../../src/parsers/room_parser/RoomInfoParser";
import { RootWorldItemParser } from "../../src/parsers/RootWorldItemParser";
import { ScaleModifier } from "../../src/modifiers/ScaleModifier";
import { SegmentBordersModifier } from "../../src/modifiers/SegmentBordersModifier";
import { BuildHierarchyModifier } from "../../src/modifiers/BuildHierarchyModifier";
import { AssignBordersToRoomsModifier } from "../../src/modifiers/AssignBordersToRoomsModifier";
import { ConvertBorderPolyToLineModifier } from "../../src/modifiers/ConvertBorderPolyToLineModifier";
import { ThickenBordersModifier } from '../../src/modifiers/ThickenBordersModifier';
import { AddOuterBorderLayerModifier } from '../../src/modifiers/AddOuterBorderLayerModifier';
import { Point, Segment } from "@nightshifts.inc/geometry";

const setup = (strMap: string): WorldItemInfo[] => {
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
            new ConvertBorderPolyToLineModifier(),
            new ThickenBordersModifier()
        ]
    );

    return worldMapParser.parse(map);
}

describe(`AddOuterBorderLayerModifier`, () => {


    it ('applies the outer layer for external walls', () => {
        const map = `
            WDDWWWWW
            W--W---W
            W--W---W
            WWWWWWWW
        `;

        setup(map);

        const [root] = setup(map);

        expect(root.children.length).toEqual(9);

        const items = new AddOuterBorderLayerModifier().apply([root]);

        expect(items[0].children.length).toEqual(15);
        expect(items[0].children).toHaveAnyWithDimensions(new Segment(new Point(0.375, 0.5), new Point(0.375, 3.5)));
        expect(items[0].children).toHaveAnyWithDimensions(new Segment(new Point(7.625, 0.5), new Point(7.625, 3.5)));
        expect(items[0].children).toHaveAnyWithDimensions(new Segment(new Point(0.5, 3.625), new Point(3.5, 3.625)));
        expect(items[0].children).toHaveAnyWithDimensions(new Segment(new Point(3.5, 3.625), new Point(7.5, 3.625)));
        expect(items[0].children).toHaveAnyWithDimensions(new Segment(new Point(3.5, 0.325), new Point(7.5, 0.325)));
        expect(items[0].children).toHaveAnyWithDimensions(new Segment(new Point(0.5, 0.375), new Point(3.5, 0.375)));
    });
});
