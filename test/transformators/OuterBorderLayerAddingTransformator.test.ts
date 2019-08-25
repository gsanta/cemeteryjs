import { WorldItemInfo, WorldItemInfoFactory, WorldParser } from "../../src";
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
import { BorderItemsToLinesTransformator } from "../../src/transformators/BorderItemsToLinesTransformator";
import { BorderThickeningTransformator } from '../../src/transformators/BorderThickeningTransformator';
import { OuterBorderLayerAddingTransformator } from '../../src/transformators/OuterBorderLayerAddingTransformator';
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
            new ScalingTransformator(),
            new BorderItemSegmentingTransformator(worldItemInfoFactory, ['wall', 'door']),
            new HierarchyBuildingTransformator(),
            new BorderItemAddingTransformator(['wall', 'door']),
            new BorderItemsToLinesTransformator(),
            new BorderThickeningTransformator()
        ]
    );

    return worldMapParser.parse(map);
}

describe(`OuterBorderLayerAddingTransformator`, () => {
    it ('applies the outer layer for external walls', () => {
        const map = `
            WDDWWWWW
            W--W---W
            W--W---W
            WWWWWWWW
        `;

        const [root] = setup(map);

        expect(root.children.length).toEqual(9);

        const items = new OuterBorderLayerAddingTransformator().transform([root]);

        expect(items[0].children.length).toEqual(14);
        expect(items[0].children).toHaveAnyWithDimensions(new Segment(new Point(0.375, 0.5), new Point(0.375, 3.5)));
        expect(items[0].children).toHaveAnyWithDimensions(new Segment(new Point(7.625, 0.5), new Point(7.625, 3.5)));
        expect(items[0].children).toHaveAnyWithDimensions(new Segment(new Point(0.5, 3.625), new Point(3.5, 3.625)));
        expect(items[0].children).toHaveAnyWithDimensions(new Segment(new Point(3.5, 3.625), new Point(7.5, 3.625)));
        expect(items[0].children).toHaveAnyWithDimensions(new Segment(new Point(3.5, 0.325), new Point(7.5, 0.325)));
    });
});
