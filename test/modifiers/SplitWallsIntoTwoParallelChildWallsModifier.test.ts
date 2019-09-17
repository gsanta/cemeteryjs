import { Point, Segment, StripeView } from "@nightshifts.inc/geometry";
import { SplitWallsIntoTwoParallelChildWallsModifier } from '../../src/modifiers/SplitWallsIntoTwoParallelChildWallsModifier';
import { AssignBordersToRoomsModifier } from "../../src/modifiers/AssignBordersToRoomsModifier";
import { BuildHierarchyModifier } from "../../src/modifiers/BuildHierarchyModifier";
import { ConvertBorderPolyToLineModifier } from "../../src/modifiers/ConvertBorderPolyToLineModifier";
import { ScaleModifier } from "../../src/modifiers/ScaleModifier";
import { SegmentBordersModifier } from "../../src/modifiers/SegmentBordersModifier";
import { ThickenBordersModifier } from '../../src/modifiers/ThickenBordersModifier';
import { setup } from "../test_utils/mocks";
import { ChangeBorderWidthModifier } from '../../src/modifiers/ChangeBorderWidthModifier';
import { WorldItem } from '../../src/WorldItem';

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

describe(`SplitWallsIntoTwoParallelChildWallsModifier`, () => {


    it ('splits each wall into two parallel walls and adds them as children to the original wall', () => {
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

        const items = new SplitWallsIntoTwoParallelChildWallsModifier(serviceFacade.worldItemFactoryService, serviceFacade.geometryService).apply([root]);

        const walls = root.children.filter(item => item.name === 'wall');

        expect(items[0].children.length).toEqual(9);
        walls.forEach(wall => {
            expect(wall.children.length).toEqual(2);
            checkIfChildrenDimensionsAddUpToParentDimensions(wall);
        });
    });
});

function checkIfChildrenDimensionsAddUpToParentDimensions(parentWall: WorldItem) {
    const parentRect = (<Segment> parentWall.dimensions).addThickness(parentWall.thickness / 2);
    const childSegment1 = <Segment> parentWall.children[0].dimensions;
    const childSegment2 = <Segment> parentWall.children[1].dimensions;

    const childrenRect = StripeView.createRectangleFromTwoOppositeSides(childSegment1, childSegment2);
    expect(parentRect.equalTo(childrenRect)).toBeTruthy();
}
