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
                },
                {}
            );


            const graphToGrameMapConverter = new GraphToGameObjectListConverter();
            const gameMap = graphToGrameMapConverter.convert(graph);

            expect(gameMap[0]).to.eql(new GameObject('W', new Rectangle(1, 2, 1, 4), 'wall'));
            expect(gameMap[1]).to.eql(new GameObject('W', new Rectangle(3, 2, 1, 4), 'wall'));
            expect(gameMap[4]).to.eql(new GameObject('F', new Rectangle(0, 0, 6, 8), 'floor'));
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
                },
                {}
            );


            const graphToGrameMapConverter = new GraphToGameObjectListConverter();
            const gameMap = graphToGrameMapConverter.convert(graph);

            expect(gameMap[0]).to.eql(new GameObject('W', new Rectangle(1, 2, 1, 4), 'wall'));
            expect(gameMap[2]).to.eql(new GameObject('W', new Rectangle(2, 6, 2, 2), 'wall'));
            expect(gameMap[3]).to.eql(new GameObject('F', new Rectangle(0, 0, 6, 8), 'floor'));
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
                },
                {}
            );


            const graphToGrameMapConverter = new GraphToGameObjectListConverter();
            const gameMap = graphToGrameMapConverter.convert(graph);

            expect(gameMap[0]).to.eql(new GameObject('W', new Rectangle(1, 2, 1, 4), 'wall'));
            expect(gameMap[2]).to.eql(new GameObject('W', new Rectangle(2, 6, 2, 2), 'wall'));
            expect(gameMap[3]).to.eql(new GameObject('F', new Rectangle(0, 0, 6, 8), 'floor'));
        });

        it('creates one game object for a rectangular connected component', () => {
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


            const graphToGrameMapConverter = new GraphToGameObjectListConverter();
            const gameMap = graphToGrameMapConverter.convert(graph);
            expect(gameMap.length).to.equal(2);
            expect(gameMap[0]).to.eql(new GameObject('D', new Rectangle(1, 0, 2, 6), 'door'));
        });
    });
});
