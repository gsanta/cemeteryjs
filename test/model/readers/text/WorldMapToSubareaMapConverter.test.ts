import { WorldMapToSubareaMapConverter as WorldMapToSubareaMapConverter } from '../../../../src/model/readers/text/WorldMapToSubareaMapConverter';
import { ConfigService } from '../../../../src/model/services/ConfigService';

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

            - = room
            I = window BORDER
            D = door BORDER
            W = wall BORDER
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

            - = room
            I = window BORDER
            D = door BORDER
            W = wall BORDER
            = = _subarea

            \`
        `;

        const configService = new ConfigService().update(
            `
                definitions \`

                - = room
                I = window BORDER
                D = door BORDER
                W = wall BORDER
                = = _subarea

                \`
            `
        );

        const worldMapToSubareaMapConverter = new WorldMapToSubareaMapConverter(configService);

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

            - = room
            I = window BORDER
            D = door BORDER
            W = wall BORDER
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

            - = room
            I = window BORDER
            D = door BORDER
            W = wall BORDER
            T = table
            H = chair
            = = _subarea

            \`
        `;

        const configService = new ConfigService().update(
            `
                definitions \`

                - = room
                I = window BORDER
                D = door BORDER
                W = wall BORDER
                T = table
                H = chair
                = = _subarea

                \`
            `
        );

        const worldMapToSubareaMapConverter = new WorldMapToSubareaMapConverter(configService);

        expect(worldMapToSubareaMapConverter.convert(input)).toEqual(output);
    });
});