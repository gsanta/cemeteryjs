import { WorldMapToMatrixGraphConverter } from "../../matrix_graph/conversion/WorldMapToMatrixGraphConverter";
import { RoomSeparatorParser } from './RoomSeparatorParser';
import { expect } from "chai";
import { WorldItemInfoFactory } from '../../WorldItemInfoFactory';
import { Polygon, Shape } from "@nightshifts.inc/geometry";
import { WorldItemInfo } from '../../WorldItemInfo';
import * as _ from 'lodash';

// TODO: create custom matcher
function hasAnyWorldItemInfoDimension(dimension: Shape, worldItemInfos: WorldItemInfo[]) {
    return _.some(worldItemInfos, worldItemInfo => worldItemInfo.dimensions.equalTo(dimension));
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

            const roomSeparatorParser = new RoomSeparatorParser(new WorldItemInfoFactory(), ['W', 'D', 'I']);


            const worldItems = roomSeparatorParser.generate(matrixGraph);
            expect(worldItems.length).to.eql(5);
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(0, 0, 1, 5), worldItems));
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(9, 0, 1, 5), worldItems));
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(17, 0, 1, 5), worldItems));
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(0, 0, 18, 1), worldItems));
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(0, 4, 18, 1), worldItems));
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

            const roomSeparatorParser = new RoomSeparatorParser(new WorldItemInfoFactory(), ['W', 'D', 'I']);


            const worldItems = roomSeparatorParser.generate(matrixGraph);
            expect(worldItems.length).to.eql(4);
            expect(worldItems[0].dimensions).to.eql(Polygon.createRectangle(0, 0, 2, 1));
            expect(worldItems[1].dimensions).to.eql(Polygon.createRectangle(6, 0, 4, 1));
            expect(worldItems[2].dimensions).to.eql(Polygon.createRectangle(2, 0, 4, 1));
            expect(worldItems[3].dimensions).to.eql(Polygon.createRectangle(9, 1, 1, 2));
        });
    });
});