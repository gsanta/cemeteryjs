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
import { WorldItem } from "../../src/WorldItemInfo";
import { WorldItemFactoryService } from "../../src/services/WorldItemFactoryService";
import { WorldParser } from "../../src/WorldParser";
import { ConvertBorderPolyToLineModifier } from "../../src/modifiers/ConvertBorderPolyToLineModifier";
import { ThickenBordersModifier } from '../../src/modifiers/ThickenBordersModifier';


const setup = (strMap: string): WorldItem[] => {
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

    const worldItemInfoFactory = new WorldItemFactoryService();
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

describe('ThickenBordersModifier', () => {

    it ('gives thickness to the walls which were represented as a line segment', () => {
        const map = `
            WDDWWWWW
            W------W
            W------W
            WWWWWWWW
        `;

    const [root] = setup(map);

    const items = new ThickenBordersModifier().apply([root]);

    });
});
