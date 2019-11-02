import { LinesToGraphConverter } from '../../../../src/model/formats/text/LinesToGraphConverter';
import { ConfigService } from '../../../../src/model/services/ConfigService';

describe('LinesToGraphConverter', () => {
    describe('parse', () => {
        it('creates a graph which describes the map represented by the input string', () => {
            const configService = new ConfigService().update(
                `
                    definitions \`

                    W = wall BORDER
                    # = empty

                    \`
                `
            );

            const linesToGraphConverter = new LinesToGraphConverter(configService);
            const graph = linesToGraphConverter.parse(
                [
                    '######',
                    '#WWWW#',
                    '#W####',
                    '######'
                ]);
            expect(graph.size()).toEqual(24);
        });
    });
});
