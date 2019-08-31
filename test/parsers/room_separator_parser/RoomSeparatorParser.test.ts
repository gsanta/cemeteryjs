import { WorldMapToMatrixGraphConverter } from "../../../src/matrix_graph/conversion/WorldMapToMatrixGraphConverter";
import { RoomSeparatorParser } from '../../../src/parsers/room_separator_parser/RoomSeparatorParser';
import { WorldItemFactoryService } from '../../../src/services/WorldItemFactoryService';
import { Polygon, Shape } from "@nightshifts.inc/geometry";
import { WorldItem } from '../../../src/WorldItemInfo';
import * as _ from 'lodash';

// TODO: create custom matcher
export function hasAnyWorldItemInfoDimension(dimension: Shape, worldItemInfos: WorldItem[]) {
    if (_.some(worldItemInfos, worldItemInfo => worldItemInfo.dimensions.equalTo(dimension))) {
        return true;
    } else {
        throw new Error(`${dimension.toString()} does not exist`);
    }
}

describe('RoomSeparatorParser', () => {
    describe('generate', () => {
        it ('sepearates the walls into vertical and horizontal `WorldItemInfo`s.', () => {
            const map = `
                map \`

                WWWWWWWWWWWWWWWWWW
                W--------W-------W
                W--------W-------W
                W--------W-------W
                WWWWWWWWWWWWWWWWWW

                \`

                definitions \`

                - = empty
                W = wall
                D = door
                I = window

                \`
            `;

            const worldMapToGraphConverter = new WorldMapToMatrixGraphConverter();
            const matrixGraph = worldMapToGraphConverter.convert(map);

            const roomSeparatorParser = new RoomSeparatorParser(new WorldItemFactoryService(), ['wall', 'door', 'window']);


            const worldItems = roomSeparatorParser.generate(matrixGraph);
            expect(worldItems.length).toEqual(5);
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(0, 0, 1, 5), worldItems)).toBeTruthy();
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(9, 0, 1, 5), worldItems)).toBeTruthy();
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(17, 0, 1, 5), worldItems)).toBeTruthy();
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(0, 0, 18, 1), worldItems)).toBeTruthy();
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(0, 4, 18, 1), worldItems)).toBeTruthy();
        });

        it ('creates separate `WorldItemInfo`s for different type of border items.', () => {
            const map = `
                map \`

                WWDDDDWWWW
                ---------I
                ---------I
                ----------
                ----------

                \`

                definitions \`

                - = empty
                W = wall
                D = door
                I = window

                \`
            `;

            const worldMapToGraphConverter = new WorldMapToMatrixGraphConverter();
            const matrixGraph = worldMapToGraphConverter.convert(map);

            const roomSeparatorParser = new RoomSeparatorParser(new WorldItemFactoryService(), ['wall', 'door', 'window']);


            const worldItems = roomSeparatorParser.generate(matrixGraph);
            expect(worldItems.length).toEqual(4);
            expect(worldItems[0].dimensions).toEqual(Polygon.createRectangle(0, 0, 2, 1));
            expect(worldItems[1].dimensions).toEqual(Polygon.createRectangle(6, 0, 4, 1));
            expect(worldItems[2].dimensions).toEqual(Polygon.createRectangle(2, 0, 4, 1));
            expect(worldItems[3].dimensions).toEqual(Polygon.createRectangle(9, 1, 1, 2));
        });
    });
});