import { GameMapReader } from './GameMapReader';
import { expect } from 'chai';

describe('GameMapReader', () => {
    describe('read', () => {
        it('creates a MatrixGraph', () => {
        const map = `
                map \`

                #W#
                #W#

                \`

                definitions \`

                W = wall
                # = empty

                \`
            `

            const gameMapReader = new GameMapReader();
            const matrixGraph = gameMapReader.read(map);
            expect(matrixGraph.getAllVertices().length).to.equal(6);
        });

        it('creates a MatrixGraph with the correct additional data attached', () => {
        const map = `
                map \`

                ##########
                #WW#######
                #WW#######
                #WW#######
                ##########

                \`

                definitions \`

                W = wall
                # = empty

                \`

                details \`
                    "attributes": [
                        {
                            "pos": {
                                "x": 1,
                                "y": 1
                            },
                            "orientation": "EAST"
                        }
                    ]
                \`
            `

            const gameMapReader = new GameMapReader();
            const matrixGraph = gameMapReader.read(map);
            expect(matrixGraph.getVertexValue(11).additionalData).to.eql(                        {
                "pos": {
                    "x": 1,
                    "y": 1
                },
                "orientation": "EAST"
            });
            1;
        });
    });
});