import { expect } from "chai";
import { WorldItemInfo } from '../WorldItemInfo';
import { RootWorldItemParser } from "./RootWorldItemParser";
import { MatrixGraph } from "../matrix_graph/MatrixGraph";
import { WorldItemInfoFactory } from "../WorldItemInfoFactory";
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
            expect(worldItems.length).to.eql(1);
            const expectedShape = new Polygon([
                new Point(0, 0),
                new Point(0, 4),
                new Point(5, 4),
                new Point(5, 0)
            ]);
            expect(worldItems[0]).to.eql(new WorldItemInfo(1, 'F', expectedShape, 'root'));
        });
    });
});