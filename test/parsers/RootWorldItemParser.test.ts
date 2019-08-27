import { WorldItemInfo } from '../../src/WorldItemInfo';
import { RootWorldItemParser } from "../../src/parsers/RootWorldItemParser";
import { MatrixGraph } from "../../src/matrix_graph/MatrixGraph";
import { WorldItemInfoFactory } from "../../src/WorldItemInfoFactory";
import { Point, Polygon } from "@nightshifts.inc/geometry";


describe('RootWorldItemParser', () => {
    describe('generate', () => {
        it ('creates a root `WorldItemInfo` and appends it to the list of existing `WorldItemInfo`s', () => {
            const graphMock: Partial<MatrixGraph> = {
                getColumns: () => 5,
                getRows: () => 4
            };

            const rootWorldItemParser = new RootWorldItemParser(new WorldItemInfoFactory());

            const worldItems = rootWorldItemParser.generate(<MatrixGraph> graphMock);
            expect(worldItems.length).toEqual(1);
            const expectedShape = new Polygon([
                new Point(0, 0),
                new Point(0, 4),
                new Point(5, 4),
                new Point(5, 0)
            ]);
            expect(worldItems[0]).toEqual(new WorldItemInfo('1', 'F', expectedShape, 'root'));
        });
    });
});