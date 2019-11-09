import { Point, Segment, StripeView } from "@nightshifts.inc/geometry";
import { SplitWallsIntoTwoParallelChildWallsModifier } from '../../../src/model/modifiers/SplitWallsIntoTwoParallelChildWallsModifier';
import { AssignBordersToRoomsModifier } from "../../../src/model/modifiers/AssignBordersToRoomsModifier";
import { BuildHierarchyModifier } from "../../../src/model/modifiers/BuildHierarchyModifier";
import { ScaleModifier } from "../../../src/model/modifiers/ScaleModifier";
import { SegmentBordersModifier } from "../../../src/model/modifiers/SegmentBordersModifier";
import { ThickenBordersModifier } from '../../../src/model/modifiers/ThickenBordersModifier';
import { setup } from "../testUtils";
import { ChangeBorderWidthModifier } from '../../../src/model/modifiers/ChangeBorderWidthModifier';
import { WorldItem } from '../../../src/WorldItem';
import { FileFormat } from "../../../src/WorldGenerator";

function createMap(worldMap: string) {
        return `
            map \`

            ${worldMap}

            \`

            definitions \`

            W = wall BORDER
            D = door BORDER
            - = room

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

        const serviceFacade = setup(map, FileFormat.TEXT);

        const [root] = serviceFacade.importerService.import(
            map,
            [
                SegmentBordersModifier.modName,
                BuildHierarchyModifier.modName,
                AssignBordersToRoomsModifier.modName,
                ScaleModifier.modName,
                ChangeBorderWidthModifier.modName,
                ThickenBordersModifier.modName,
            ]
        )

        expect(root.children.length).toEqual(10);

        const items = new SplitWallsIntoTwoParallelChildWallsModifier(serviceFacade.worldItemFactoryService, serviceFacade.geometryService).apply([root]);

        const walls = root.children.filter(item => item.name === 'wall');

        expect(items[0].children.length).toEqual(10);
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
