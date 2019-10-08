import { DefinitionSectionParser } from "../../../src/model/parsers/DefinitionSectionParser";

function createWorldMap(definitionLines: string) {
    return `
        map \`

        WWWWDDDWWW
        W--TTTT--W
        W--TTTT--I
        W--------I
        W--------W
        WWWWWWWWWW

        \`

        definitions \`

        ${definitionLines}

        \`
    `;
}


describe('DefinitionSectionParser', () => {

    it ('parsers the definition section of the world map', () => {
        const worldMap = createWorldMap(`
            I = window DIM 2
            T = table DIM 3.2 2.5
        `);

        const definitionSectionParser = new DefinitionSectionParser();

        const definitions = definitionSectionParser.parse(worldMap);
        1;
        1;
    });
});