import { CombinedWorldItemParser } from "../../src/parsers/CombinedWorldItemParser";
import { FurnitureInfoParser } from "../../src/parsers/furniture_parser/FurnitureInfoParser";
import { WorldMapToMatrixGraphConverter } from "../../src/matrix_graph/conversion/WorldMapToMatrixGraphConverter";
import { RoomSeparatorParser } from "../../src/parsers/room_separator_parser/RoomSeparatorParser";
import { RoomInfoParser } from "../../src/parsers/room_parser/RoomInfoParser";
import { RootWorldItemParser } from "../../src/parsers/RootWorldItemParser";
import { ScalingTransformator } from "../../src/transformators/ScalingTransformator";
import { BorderItemSegmentingTransformator } from "../../src/transformators/BorderItemSegmentingTransformator";
import { HierarchyBuildingTransformator } from "../../src/transformators/HierarchyBuildingTransformator";
import { BorderItemAddingTransformator } from "../../src/transformators/BorderItemAddingTransformator";
import { WorldItemInfo } from "../../src/WorldItemInfo";
import { WorldItemInfoFactory } from "../../src/WorldItemInfoFactory";
import { WorldParser } from "../../src/WorldParser";
import { BorderItemsToLinesTransformator } from "../../src/transformators/BorderItemsToLinesTransformator";
import { BorderThickeningTransformator } from '../../src/transformators/BorderThickeningTransformator';


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
            new ScalingTransformator(),
            new BorderItemSegmentingTransformator(worldItemInfoFactory, ['wall', 'door']),
            new HierarchyBuildingTransformator(),
            new BorderItemAddingTransformator(['wall', 'door']),
            new BorderItemsToLinesTransformator()
        ]
    );

    return worldMapParser.parse(map);
}

describe('BorderThickeningTransformator', () => {

    it ('gives thickness to the walls which were represented as a line segment', () => {
        const map = `
            WDDWWWWW
            W------W
            W------W
            WWWWWWWW
        `;

    const [root] = setup(map);

    const items = new BorderThickeningTransformator().transform([root]);

    });
});
