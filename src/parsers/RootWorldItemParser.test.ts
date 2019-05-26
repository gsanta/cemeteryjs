import { expect } from "chai";
import { WorldItemInfo } from '../WorldItemInfo';
import { RootWorldItemParser } from "./RootWorldItemParser";
import { MatrixGraph } from "../matrix_graph/MatrixGraph";
import { Rectangle } from "@nightshifts.inc/geometry";
import { WorldItemInfoFactory } from "../WorldItemInfoFactory";


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
            expect(worldItems[0]).to.eql(new WorldItemInfo(1, 'F', new Rectangle(0, 0, 5, 4), 'root'));
        });
    });
});