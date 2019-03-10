import { WorldMapToMatrixGraphConverter } from "../../matrix_graph/conversion/WorldMapToMatrixGraphConverter";
import { RoomSeparatorGenerator } from './RoomSeparatorGenerator';
import { expect } from "chai";
import { Rectangle } from '../../model/Rectangle';


describe('RoomSeparatorGenerator', () => {
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

            const wallGenerator = new RoomSeparatorGenerator(['W', 'D', 'I']);


            const worldItems = wallGenerator.generate(matrixGraph);
            expect(worldItems.length).to.eql(4);
            expect(worldItems[0].dimensions).to.eql(new Rectangle(0, 0, 2, 1));
            expect(worldItems[1].dimensions).to.eql(new Rectangle(6, 0, 4, 1));
            expect(worldItems[2].dimensions).to.eql(new Rectangle(2, 0, 4, 1));
            expect(worldItems[3].dimensions).to.eql(new Rectangle(9, 1, 1, 2));
        });
    });
});