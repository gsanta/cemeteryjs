import { LinesToGraphConverter } from '../matrix_graph/LinesToGraphConverter';
import { GraphToGameObjectListConverter } from './GraphToGameObjectListConverter';
import { expect } from 'chai';
import { GameObject } from '../GameObject';
import { Rectangle } from '../model/Rectangle';

describe('GraphToGameObjectListConverter', () => {
    describe('convert', () => {
        it('creates game objects from the graph (test case with one connected component)', () => {
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
                }
            );


            const graphToGrameMapConverter = new GraphToGameObjectListConverter();
            const gameMap = graphToGrameMapConverter.convert(graph);

            expect(gameMap).to.eql([
                new GameObject('W', new Rectangle(1, 1, 1, 2), 'wall'),
                new GameObject('W', new Rectangle(3, 1, 1, 2), 'wall'),
                new GameObject('W', new Rectangle(2, 1, 1, 1), 'wall'),
                new GameObject('W', new Rectangle(4, 1, 2, 1), 'wall')
            ]);
        });

        it('creates game objects from the graph (test case with multiple connected components)', () => {
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
                }
            );


            const graphToGrameMapConverter = new GraphToGameObjectListConverter();
            const gameMap = graphToGrameMapConverter.convert(graph);

            expect(gameMap).to.eql([
                new GameObject('W', new Rectangle(1, 1, 1, 2), 'wall'),
                new GameObject('W', new Rectangle(2, 1, 3, 1), 'wall'),
                new GameObject('W', new Rectangle(2, 3, 2, 1), 'wall')
            ]);
        });
    });
});
