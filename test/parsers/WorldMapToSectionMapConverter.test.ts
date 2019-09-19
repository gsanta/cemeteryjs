import { WorldMapToSectionMapConverter } from '../../src/parsers/WorldMapToSectionMapConverter';

describe('WorldMapToSectionMapConverter', () => {
    it ('replaces the border characters with empty characters', () => {
        const input = `
            map \`

            WWWWDDDWWW
            W--====--W
            W--====--I
            W--------I
            W----====W
            WWWWWWWWWW

            \`

            definitions \`

            - = empty
            I = window
            D = door
            W = wall
            = = _section

            \`
        `;

        const output = `
            map \`

            ----------
            ---====---
            ---====---
            ----------
            -----====-
            ----------

            \`

            definitions \`

            - = empty
            I = window
            D = door
            W = wall
            = = _section

            \`
        `;

        const worldMapToSectionMapConverter = new WorldMapToSectionMapConverter('=', '-', ['W', 'D', 'I']);

        expect(worldMapToSectionMapConverter.convert(input)).toEqual(output);
    });

    it ('replaces the furniture characters with section character', () => {
        const input = `
            map \`

            WWWWWWWWWIIWWWWWWWWWWWWWWWWWWWWWW
            W-----------------==H=H==-------W
            W-----------------=TTTTT=-------W
            W-----------------=TTTTT=-------W
            W-----------------==H=H==-------W
            WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

            \`

            definitions \`

            - = empty
            I = window
            D = door
            W = wall
            T = table
            H = chair
            = = _section

            \`
        `;

        const output = `
            map \`

            ---------------------------------
            ------------------=======--------
            ------------------=======--------
            ------------------=======--------
            ------------------=======--------
            ---------------------------------

            \`

            definitions \`

            - = empty
            I = window
            D = door
            W = wall
            T = table
            H = chair
            = = _section

            \`
        `;

        const worldMapToSectionMapConverter = new WorldMapToSectionMapConverter('=', '-', ['W', 'D', 'I']);

        expect(worldMapToSectionMapConverter.convert(input)).toEqual(output);
    });
});