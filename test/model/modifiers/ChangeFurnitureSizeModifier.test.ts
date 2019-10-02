import { Polygon } from '@nightshifts.inc/geometry';
import { MeshDescriptor } from "../../../src/Config";
import { AssignBordersToRoomsModifier } from "../../../src/model/modifiers/AssignBordersToRoomsModifier";
import { BuildHierarchyModifier } from "../../../src/model/modifiers/BuildHierarchyModifier";
import { ChangeBorderWidthModifier } from "../../../src/model/modifiers/ChangeBorderWidthModifier";
import { ChangeFurnitureSizeModifier } from '../../../src/model/modifiers/ChangeFurnitureSizeModifier';
import { ConvertBorderPolyToLineModifier } from "../../../src/model/modifiers/ConvertBorderPolyToLineModifier";
import { SegmentBordersModifier } from "../../../src/model/modifiers/SegmentBordersModifier";
import { ServiceFacade } from "../../../src/model/services/ServiceFacade";
import { setup } from "../../test_utils/testUtils";

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

const meshDescriptors: MeshDescriptor[] = [
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
];

describe('ChangeFurnitureSizeModifier', () => {
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

        let services: ServiceFacade<any, any, any> = setup(map, meshDescriptors);

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
        expect(room.children).toHaveAnyWithDimensions(Polygon.createRectangle(7.5, 2.5, 2, 1));
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

        let services: ServiceFacade<any, any, any> = setup(map, meshDescriptors);

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