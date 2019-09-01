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
import { setup } from "../test_utils/mocks";

function createMap(worldMap: string) {
        return `
            map \`

            ${worldMap}

            \`

            definitions \`

            W = wall
            D = door
            - = empty

            \`
        `;
}

describe(`AddOuterBorderLayerModifier`, () => {


    it ('applies the outer layer for external walls', () => {
        const map = createMap(
            `
            WDDWWWWW
            W--W---W
            W--W---W
            WWWWWWWW
            `
        );

        const serviceFacade = setup();

        const [root] = serviceFacade.importerService.import(
            map, 
            [
                ScaleModifier.modName,
                SegmentBordersModifier.modName,
                BuildHierarchyModifier.modName,
                AssignBordersToRoomsModifier.modName,
                ConvertBorderPolyToLineModifier.modName,
                ThickenBordersModifier.modName
            ]    
        )

        expect(root.children.length).toEqual(9);

        const items = new AddOuterBorderLayerModifier(serviceFacade.worldItemFactoryService).apply([root]);

        expect(items[0].children.length).toEqual(15);
        expect(items[0].children).toHaveAnyWithDimensions(new Segment(new Point(0.375, 0.5), new Point(0.375, 3.5)));
        expect(items[0].children).toHaveAnyWithDimensions(new Segment(new Point(7.625, 0.5), new Point(7.625, 3.5)));
        expect(items[0].children).toHaveAnyWithDimensions(new Segment(new Point(0.5, 3.625), new Point(3.5, 3.625)));
        expect(items[0].children).toHaveAnyWithDimensions(new Segment(new Point(3.5, 3.625), new Point(7.5, 3.625)));
        expect(items[0].children).toHaveAnyWithDimensions(new Segment(new Point(3.5, 0.325), new Point(7.5, 0.325)));
        expect(items[0].children).toHaveAnyWithDimensions(new Segment(new Point(0.5, 0.375), new Point(3.5, 0.375)));
    });
});
