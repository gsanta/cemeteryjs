import { WorldMapToSubareaMapConverter as WorldMapToSubareaMapConverter } from '../../../../../src/model/readers/text/WorldMapToSubareaMapConverter';
import { WorldItemStore } from '../../../../../src/model/services/WorldItemStore';
import { TextConfigReader } from '../../../../../src/model/readers/text/TextConfigReader';

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

            - = room ROLES [CONTAINER]
            I = window ROLES [BORDER]
            D = door ROLES [BORDER]
            W = wall ROLES [BORDER]
            = = _subarea ROLES [CONTAINER]

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

            - = room ROLES [CONTAINER]
            I = window ROLES [BORDER]
            D = door ROLES [BORDER]
            W = wall ROLES [BORDER]
            = = _subarea ROLES [CONTAINER]

            \`
        `;

        const {worldItemTemplates, globalConfig} = new TextConfigReader().read(
            `
                definitions \`

                - = room ROLES [CONTAINER]
                I = window ROLES [BORDER]
                D = door ROLES [BORDER]
                W = wall ROLES [BORDER]
                = = _subarea ROLES [CONTAINER]

                \`
            `
        );

        const worldItemStore = new WorldItemStore(worldItemTemplates, globalConfig);

        const worldMapToSubareaMapConverter = new WorldMapToSubareaMapConverter();

        expect(worldMapToSubareaMapConverter.convert(input, worldItemStore.worldItemTemplates)).toEqual(output);
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

            - = room ROLES [CONTAINER]
            I = window ROLES [BORDER]
            D = door ROLES [BORDER]
            W = wall ROLES [BORDER]
            T = table
            H = chair
            = = _subarea ROLES [CONTAINER]

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

            - = room ROLES [CONTAINER]
            I = window ROLES [BORDER]
            D = door ROLES [BORDER]
            W = wall ROLES [BORDER]
            T = table
            H = chair
            = = _subarea ROLES [CONTAINER]

            \`
        `;

        const {worldItemTemplates, globalConfig} = new TextConfigReader().read(
            `
                definitions \`

                - = room ROLES [CONTAINER]
                I = window ROLES [BORDER]
                D = door ROLES [BORDER]
                W = wall ROLES [BORDER]
                T = table
                H = chair
                = = _subarea ROLES [CONTAINER]

                \`
            `
        );

        const worldItemStore = new WorldItemStore(worldItemTemplates, globalConfig);

        const worldMapToSubareaMapConverter = new WorldMapToSubareaMapConverter();

        expect(worldMapToSubareaMapConverter.convert(input, worldItemStore.worldItemTemplates)).toEqual(output);
    });
});