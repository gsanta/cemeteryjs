import { expect } from "chai";
import { GwmWorldItem } from '../GwmWorldItem';
import { RootWorldItemParser } from "./RootWorldItemParser";
import { MatrixGraph } from "../matrix_graph/MatrixGraph";
import { Rectangle } from "@nightshifts.inc/geometry";


describe('RootWorldItemParser', () => {
    describe('generate', () => {
        it ('creates a root `GwmWorldItem` and appends it to the list of existing `GwmWorldItem`s', () => {
            const graphMock: Partial<MatrixGraph> = {
                getColumns: () => 5,
                getRows: () => 4
            };

            const rootWorldItemParser = new RootWorldItemParser();

            const worldItems = rootWorldItemParser.generate(<MatrixGraph> graphMock);
            expect(worldItems.length).to.eql(1);
            expect(worldItems[0]).to.eql(new GwmWorldItem('F', new Rectangle(0, 0, 5, 4), 'root'));
        });
    });
});