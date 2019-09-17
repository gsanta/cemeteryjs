import { Polygon } from '@nightshifts.inc/geometry';
import { MeshDescriptor } from "../../src/Config";
import { AssignBordersToRoomsModifier } from "../../src/modifiers/AssignBordersToRoomsModifier";
import { BuildHierarchyModifier } from "../../src/modifiers/BuildHierarchyModifier";
import { ChangeBorderWidthModifier } from "../../src/modifiers/ChangeBorderWidthModifier";
import { ChangeFurnitureSizeModifier } from '../../src/modifiers/ChangeFurnitureSizeModifier';
import { ConvertBorderPolyToLineModifier } from "../../src/modifiers/ConvertBorderPolyToLineModifier";
import { ScaleModifier } from "../../src/modifiers/ScaleModifier";
import { SegmentBordersModifier } from "../../src/modifiers/SegmentBordersModifier";
import { ServiceFacade } from "../../src/services/ServiceFacade";
import { setup } from "../test_utils/mocks";
import { NormalizeBorderRotationModifier } from '../../src/modifiers/NormalizeBorderRotationModifier';
import { SplitWallsIntoTwoParallelChildWallsModifier } from '../../src/modifiers/SplitWallsIntoTwoParallelChildWallsModifier';

function createMap(worldMap: string) {
    return `
        map \`

        ${worldMap}

        \`

        definitions \`

        W = wall
        D = door
        - = empty
        T = table

        \`
    `;
}

describe('ChangeFurnitureSizeModifier', () => {
    let services: ServiceFacade<any, any, any>;

    beforeEach(() => {
        services = setup({
            meshDescriptors: [
                {
                    name: 'mesh-descriptor',
                    type: 'table',
                    realDimensions: {
                        name: 'furniture-dimensions-descriptor',
                        width: 2,
                        height: 1
                    }
                } as MeshDescriptor,
                {
                    name: 'mesh-descriptor',
                    type: 'cupboard',
                    realDimensions: {
                        name: 'furniture-dimensions-descriptor',
                        width: 0.5,
                        height: 2
                    }
                } as MeshDescriptor
            ]
        });
    });

    it ('transforms the sketched furniture dimensions into real mesh dimensions', () => {
        const map = createMap(
            `
            WWWWWWWWWWWWWWW
            W-------------W
            W------TTT----W
            W------TTT----W
            W-------------W
            WWWWWWWWWWWWWWW
           `
        );

        const items = services.importerService.import(
            map,
            [
                SegmentBordersModifier.modName,
                BuildHierarchyModifier.modName,
                AssignBordersToRoomsModifier.modName,
                ConvertBorderPolyToLineModifier.modName,
                ChangeBorderWidthModifier.modName,
                ChangeFurnitureSizeModifier.modeName
            ]
        );

        const room = items[0].children[0];
        const table = room.children[0];

        expect(table.dimensions.equalTo(Polygon.createRectangle(7.5, 2.5, 2, 1))).toBeTruthy();
    });

    it ('snaps the furniture beside the wall if the original dimensions touched a wall', () => {
        const map = createMap(
        `
            WWWWWWWWWWWWWWW
            W------C------W
            WTTT---C------W
            WTTT---C----TTW
            W-----------TTW
            W----BBB------W
            WWWWWWWWWWWWWWW
        `
        );

        const items = services.importerService.import(
            map,
            [
                SegmentBordersModifier.modName,
                BuildHierarchyModifier.modName,
                AssignBordersToRoomsModifier.modName,
                ConvertBorderPolyToLineModifier.modName,
                ChangeBorderWidthModifier.modName,
                ChangeFurnitureSizeModifier.modeName
            ]
        );

        const room = items[0].children[0];

        expect(room.children).toHaveAnyWithDimensions(Polygon.createRectangle(0.5, 2, 1, 2));
        expect(room.children).toHaveAnyWithDimensions(Polygon.createRectangle(5, 5.5, 3, 1));
        expect(room.children).toHaveAnyWithDimensions(Polygon.createRectangle(5, 5.5, 3, 1));
        expect(room.children).toHaveAnyWithDimensions(Polygon.createRectangle(13.5, 3, 1, 2));
    });
});