import { WorldMapToSubareaMapConverter as WorldMapToSubareaMapConverter } from '../../../src/model/parsers/WorldMapToSubareaMapConverter';

describe('WorldMapToSubareaMapConverter', () => {
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
            = = _subarea

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
            = = _subarea

            \`
        `;

        const worldMapToSubareaMapConverter = new WorldMapToSubareaMapConverter('=', '-', ['W', 'D', 'I']);

        expect(worldMapToSubareaMapConverter.convert(input)).toEqual(output);
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
            = = _subarea

            \`
        `;

        const output = `
            map \`

            ---------------------------------
            ------------------==H=H==--------
            ------------------=TTTTT=--------
            ------------------=TTTTT=--------
            ------------------==H=H==--------
            ---------------------------------

            \`

            definitions \`

            - = empty
            I = window
            D = door
            W = wall
            T = table
            H = chair
            = = _subarea

            \`
        `;

        const worldMapToSubareaMapConverter = new WorldMapToSubareaMapConverter('=', '-', ['W', 'D', 'I']);

        expect(worldMapToSubareaMapConverter.convert(input)).toEqual(output);
    });
});