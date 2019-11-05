import { Polygon } from '@nightshifts.inc/geometry';
import { AssignBordersToRoomsModifier } from "../../../src/model/modifiers/AssignBordersToRoomsModifier";
import { BuildHierarchyModifier } from "../../../src/model/modifiers/BuildHierarchyModifier";
import { ChangeBorderWidthModifier } from "../../../src/model/modifiers/ChangeBorderWidthModifier";
import { ChangeFurnitureSizeModifier } from '../../../src/model/modifiers/ChangeFurnitureSizeModifier';
import { SegmentBordersModifier } from "../../../src/model/modifiers/SegmentBordersModifier";
import { ServiceFacade } from "../../../src/model/services/ServiceFacade";
import { setup, setupMap } from "../testUtils";

describe('ChangeFurnitureSizeModifier', () => {
    it ('transforms the sketched furniture dimensions into real mesh dimensions', () => {

        const map = setupMap(
            `
            WWWWWWWWWWWWWWW
            W-------------W
            W------TTT----W
            W------TTT----W
            W-------------W
            WWWWWWWWWWWWWWW
            `
        );

        let services: ServiceFacade<any, any, any> = setup(map);

        const items = services.importerService.import(
            map,
            [
                SegmentBordersModifier.modName,
                BuildHierarchyModifier.modName,
                AssignBordersToRoomsModifier.modName,
                // ConvertBorderPolyToLineModifier.modName,
                ChangeBorderWidthModifier.modName,
                ChangeFurnitureSizeModifier.modeName
            ]
        );

        const room = items[0].children[0];
        expect(room.children).toHaveAnyWithDimensions(Polygon.createRectangle(7.5, 2.5, 2, 1));
    });

    it ('snaps the furniture beside the wall if the original dimensions touched a wall', () => {
        const map = `
        map \`

        WWWWWWWWWWWWWWW
        W------C------W
        WTTT---C------W
        WTTT---C----TTW
        W-----------TTW
        W----BBB------W
        WWWWWWWWWWWWWWW

        \`

        definitions \`

        W = wall BORDER
        - = room
        C = cupboard DIM 0.5 2 MOD assets/models/cupboard.babylon
        T = table DIM 1 2 MOD assets/models/table.babylon
        B = bed DIM 3 1  MOD assets/models/bed.babylon

        \`
        `;

        let services: ServiceFacade<any, any, any> = setup(map);

        const items = services.importerService.import(
            map,
            [
                SegmentBordersModifier.modName,
                BuildHierarchyModifier.modName,
                AssignBordersToRoomsModifier.modName,
                ChangeBorderWidthModifier.modName,
                ChangeFurnitureSizeModifier.modeName
            ]
        );

        const room = items[0].children[0];

        const tables = room.children.filter(child => child.name === 'table');
        const cupboard = room.children.filter(child => child.name === 'cupboard')[0];
        const bed = room.children.filter(child => child.name === 'bed')[0];

        expect(tables).toHaveAnyWithDimensions(Polygon.createRectangle(0.5, 2, 1, 2));
        expect(bed).toHaveDimensions(Polygon.createRectangle(5, 5.5, 3, 1));
        expect(tables).toHaveAnyWithDimensions(Polygon.createRectangle(13.5, 3, 1, 2));
        expect(cupboard).toHaveDimensions(Polygon.createRectangle(6.5, 0.5, 2, 0.5));
    });
});