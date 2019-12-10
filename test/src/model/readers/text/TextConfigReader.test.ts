import { TextConfigReader } from "../../../../../src/model/readers/text/TextConfigReader";
import { WorldItemRole } from "../../../../../src/WorldItemDefinition";

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

describe('Read a world item definition from text', () => {
    function getDefinition(definitionLine: string) {
        const worldMap = createWorldMap(definitionLine);
    
        const textConfigReader = new TextConfigReader();
    
        const {worldItemTypes} = textConfigReader.read(worldMap);

        expect(worldItemTypes.length).toEqual(1);

        return worldItemTypes[0];
    }

    it ('with basic properties', () => {
        const definition = getDefinition('T = table SCALE 2 MAT [assets/materials/table.png] MOD assets/models/table.babylon');
    
        expect(definition).toMatchMeshDescriptor({
            char: 'T',
            materials: ['assets/materials/table.png'],
            scale: 2,
            model: 'assets/models/table.babylon'
        });
    });

    it ('with multiple materials', () => {
        const definition = getDefinition('H = chair SCALE 2 MAT [assets/materials/chair1.png assets/materials/chair2.png] MOD assets/models/chair.babylon');
    
        expect(definition).toMatchMeshDescriptor({ materials: ['assets/materials/chair1.png', 'assets/materials/chair2.png']} );
    });

    it ('with roles', () => {
        const definition = getDefinition('I = window ROLES [BORDER] SCALE 2');
    
        expect(definition).toMatchMeshDescriptor({ roles: [WorldItemRole.BORDER] });
    });
});