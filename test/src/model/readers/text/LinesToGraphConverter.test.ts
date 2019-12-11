import { LinesToGraphConverter } from '../../../../../src/model/readers/text/LinesToGraphConverter';
import { WorldItemStore } from '../../../../../src/model/services/WorldItemStore';
import { TextConfigReader } from '../../../../../src/model/readers/text/TextConfigReader';

describe('LinesToGraphConverter', () => {
    describe('parse', () => {
        it('creates a graph which describes the map represented by the input string', () => {
            const {worldItemTemplates, globalConfig} = new TextConfigReader().read(`
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
                worldItemTemplates
             );
            expect(graph.size()).toEqual(24);
        });
    });
});
