import { LinesToGraphConverter } from '../../matrix_graph/conversion/LinesToGraphConverter';
import { GraphToWorldItemListConverter } from './GraphToWorldItemListConverter';
import { expect } from 'chai';
import { WorldItem } from '../../model/WorldItem';
import { Rectangle } from '../../model/Rectangle';

describe('GraphToWorldItemListConverter', () => {
    describe('convert', () => {
        it('creates world items from the graph (test case with one connected component)', () => {
            const linesToGraphConverter = new LinesToGraphConverter();
            const graph = linesToGraphConverter.parse(
                [
                    '######',
                    '#WWWWW',
                    '#W#W##',
                    '######'
                ],
                {
                    W: 'wall',
                    '#': 'empty'
                },
                {}
            );


            const graphToWorldItemListConverter = new GraphToWorldItemListConverter();
            const worldItems = graphToWorldItemListConverter.convert(graph);

            expect(worldItems[0]).to.eql(new WorldItem('W', new Rectangle(1, 2, 1, 4), 'wall'));
            expect(worldItems[1]).to.eql(new WorldItem('W', new Rectangle(3, 2, 1, 4), 'wall'));
            expect(worldItems[4]).to.eql(new WorldItem('F', new Rectangle(0, 0, 6, 8), 'floor'));
        });

        it('creates world items from the graph (test case with multiple connected components)', () => {
            const linesToGraphConverter = new LinesToGraphConverter();
            const graph = linesToGraphConverter.parse(
                [
                    '######',
                    '#WWWW#',
                    '#W####',
                    '##WW##'
                ],
                {
                    W: 'wall',
                    '#': 'empty'
                },
                {}
            );


            const graphToWorldItemListConverter = new GraphToWorldItemListConverter();
            const worldItems = graphToWorldItemListConverter.convert(graph);

            expect(worldItems[0]).to.eql(new WorldItem('W', new Rectangle(1, 2, 1, 4), 'wall'));
            expect(worldItems[2]).to.eql(new WorldItem('W', new Rectangle(2, 6, 2, 2), 'wall'));
            expect(worldItems[3]).to.eql(new WorldItem('F', new Rectangle(0, 0, 6, 8), 'floor'));
        });

        it('creates one world item for a rectangular connected component', () => {
            const linesToGraphConverter = new LinesToGraphConverter();
            const graph = linesToGraphConverter.parse(
                [
                    '#DD###',
                    '#DD###',
                    '#DD###',
                    '######'
                ],
                {
                    D: 'door',
                    '#': 'empty'
                },
                {}
            );


            const graphToWorldItemListConverter = new GraphToWorldItemListConverter();
            const worldItems = graphToWorldItemListConverter.convert(graph);
            expect(worldItems.length).to.equal(2);
            expect(worldItems[0]).to.eql(new WorldItem('D', new Rectangle(1, 0, 2, 6), 'door'));
        });
    });
});
