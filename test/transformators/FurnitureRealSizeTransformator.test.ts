/// <reference path="../../test/test.setup.ts"/>

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
import { BorderItemWidthToRealWidthTransformator } from "../../src/transformators/BorderItemWidthToRealWidthTransformator";
import { expect } from 'chai';
import { FurnitureRealSizeTransformator } from '../../src/transformators/FurnitureRealSizeTransformator';
import { Polygon } from '@nightshifts.inc/geometry';

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

        \`
    `;

    const options = {
        xScale: 1,
        yScale: 1,
        furnitureCharacters: ['T', 'B', 'C'],
        roomSeparatorCharacters: ['W', 'D']
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
            new BorderItemWidthToRealWidthTransformator([{name: 'door', width: 2}])
        ]
    );

    return worldMapParser.parse(map);
}

describe('FurnitureRealSizeTransformator', () => {
    it ('transforms the sketched furniture dimensions into real mesh dimensions', () => {
        const map = `
        WWWWWWWWWWWWWWW
        W-------------W
        W------TTT----W
        W------TTT----W
        W-------------W
        WWWWWWWWWWWWWWW

        `;

        const transformator = new FurnitureRealSizeTransformator({table: Polygon.createRectangle(0, 0, 2, 1)});
        const items = transformator.transform(initBorderItems(map));

        const room = items[0].children[0];
        const table = room.children[0];

        expect(table.dimensions).to.eql(Polygon.createRectangle(7.5, 2.5, 2, 1));
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

        const transformator = new FurnitureRealSizeTransformator({table: Polygon.createRectangle(0, 0, 2, 1), cupboard: Polygon.createRectangle(0, 0, 0.5, 2)});
        const items = transformator.transform(initBorderItems(map));

        const room = items[0].children[0];

        expect(room.children).to.haveAnyWithDimensions(Polygon.createRectangle(0.5, 2, 1, 2));
        expect(room.children).to.haveAnyWithDimensions(Polygon.createRectangle(5, 5.5, 3, 1));
        expect(room.children).to.haveAnyWithDimensions(Polygon.createRectangle(5, 5.5, 3, 1));
        expect(room.children).to.haveAnyWithDimensions(Polygon.createRectangle(13.5, 3, 1, 2));
    });
});