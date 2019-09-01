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
import { ChangeBorderWidthModifier } from "../../src/modifiers/ChangeBorderWidthModifier";
import { ChangeFurnitureSizeModifier } from '../../src/modifiers/ChangeFurnitureSizeModifier';
import { Polygon, Segment } from '@nightshifts.inc/geometry';
import { setup } from "../test_utils/mocks";
import { MeshDescriptor } from "../../src/integrations/api/Config";
import { ServiceFacade } from "../../src/services/ServiceFacade";

const initBorderItems = (strMap: string): WorldItemInfo[] => {
    const map = `
        map \`

        ${strMap}

        \`

        definitions \`

        W = wall
        D = door
        T = table
        B = bed
        C = cupboard
        - = empty

        \`
    `;

    const options = {
        xScale: 1,
        yScale: 1,
        furnitureCharacters: ['table', 'bed', 'cupboard'],
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
            new ScaleModifier(),
            new SegmentBordersModifier(worldItemInfoFactory, ['wall', 'door']),
            new BuildHierarchyModifier(),
            new AssignBordersToRoomsModifier(['wall', 'door']),
            new ConvertBorderPolyToLineModifier(),
            new ChangeBorderWidthModifier([{name: 'door', width: 2}])
        ]
    );

    return worldMapParser.parse(map);
}

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
                ScaleModifier.modName,
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

        expect(table.dimensions).toEqual(Polygon.createRectangle(7.5, 2.5, 2, 1));
    });

    it ('snaps the furniture beside the wall if the original dimensions touched a wall', () => {
        const map = `
        WWWWWWWWWWWWWWW
        W------C------W
        WTTT---C------W
        WTTT---C----TTW
        W-----------TTW
        W----BBB------W
        WWWWWWWWWWWWWWW

        `;

        const items = services.importerService.import(
            map,
            [
                ScaleModifier.modName,
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