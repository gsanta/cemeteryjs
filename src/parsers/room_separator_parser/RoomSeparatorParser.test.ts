import { WorldMapToMatrixGraphConverter } from "../../matrix_graph/conversion/WorldMapToMatrixGraphConverter";
import { RoomSeparatorParser } from './RoomSeparatorParser';
import { expect } from "chai";
import { WorldItemInfoFactory } from '../../WorldItemInfoFactory';
import { Polygon } from "@nightshifts.inc/geometry";


describe('RoomSeparatorParser', () => {
    describe('generate', () => {
        it ('returns with a WorldItem for each vertical or horizontal room separator segments.', () => {
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