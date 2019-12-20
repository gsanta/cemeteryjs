import { LinesToGraphConverter } from '../../../../../src/world_generator/importers/text/LinesToGraphConverter';
import { GameAssetStore } from '../../../../../src/world_generator/services/GameAssetStore';
import { TextConfigReader } from '../../../../../src/world_generator/importers/text/TextConfigReader';

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
