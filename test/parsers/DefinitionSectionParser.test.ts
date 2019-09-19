import { DefinitionSectionParser } from "../../src/parsers/DefinitionSectionParser";


describe('DefinitionSectionParser', () => {

    it ('parsers the definition section of the world map', () => {
        const worldMap = `
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

        const definitionSectionParser = new DefinitionSectionParser();

        const definitions = definitionSectionParser.parse(worldMap);
        1;
    });
});