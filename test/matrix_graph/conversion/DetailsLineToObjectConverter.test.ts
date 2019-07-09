import { DetailsLineToObjectConverter, DetailsLineDataTypes } from '../../../src/matrix_graph/conversion/DetailsLineToObjectConverter';
import { expect } from 'chai';

describe('DetailsLineToObjectConverter', () => {
    describe('convert', () => {
        it('converts a string line to a javascript object', () => {
            const line = 'W = pos(5,1) axis(5,1) angle(-90)';

            const detailsLineToObjectConverter = new DetailsLineToObjectConverter({
                pos: DetailsLineDataTypes.COORDINATE,
                axis: DetailsLineDataTypes.COORDINATE,
                angle: DetailsLineDataTypes.STRING
            });
            const obj = detailsLineToObjectConverter.convert(line);

            expect(obj).to.eql({
                angle: '-90',
                axis: {
                    x: 5,
                    y: 1
                },
                pos: {
                    x: 5,
                    y: 1
                }
            })
        });
    });
});