import { LinesToGraphConverter } from '../../../../../src/model/readers/text/LinesToGraphConverter';
import { GameAssetStore } from '../../../../../src/model/services/GameAssetStore';
import { TextConfigReader } from '../../../../../src/model/readers/text/TextConfigReader';

describe('LinesToGraphConverter', () => {
    describe('parse', () => {
        it('creates a graph which describes the map represented by the input string', () => {
            const {gameObjectTemplates, globalConfig} = new TextConfigReader().read(`
                definitions \`

                W = wall ROLES [BORDER]
                # = empty

                \`
            `);

            const linesToGraphConverter = new LinesToGraphConverter();
            const graph = linesToGraphConverter.parse(
                [
                    '######',
                    '#WWWW#',
                    '#W####',
                    '######'
                ],
                gameObjectTemplates
             );
            expect(graph.size()).toEqual(24);
        });
    });
});
