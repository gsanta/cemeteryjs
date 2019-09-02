import { Point, Segment } from "@nightshifts.inc/geometry";
import { AddOuterBorderLayerModifier } from '../../src/modifiers/AddOuterBorderLayerModifier';
import { AssignBordersToRoomsModifier } from "../../src/modifiers/AssignBordersToRoomsModifier";
import { BuildHierarchyModifier } from "../../src/modifiers/BuildHierarchyModifier";
import { ConvertBorderPolyToLineModifier } from "../../src/modifiers/ConvertBorderPolyToLineModifier";
import { ScaleModifier } from "../../src/modifiers/ScaleModifier";
import { SegmentBordersModifier } from "../../src/modifiers/SegmentBordersModifier";
import { ThickenBordersModifier } from '../../src/modifiers/ThickenBordersModifier';
import { setup } from "../test_utils/mocks";
import { ChangeBorderWidthModifier } from '../../src/modifiers/ChangeBorderWidthModifier';

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
                ChangeBorderWidthModifier.modName,
                ThickenBordersModifier.modName,
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
