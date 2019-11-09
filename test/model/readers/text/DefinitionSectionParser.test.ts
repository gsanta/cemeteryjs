import { TextConfigReader } from "../../../../src/model/readers/text/TextConfigReader";

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

it ('Parse the definition section of the world map', () => {
    const worldMap = createWorldMap(`
        I = window DIM 2 SCALE 2 MAT [assets/materials/window.png] MOD assets/models/window.babylon
        T = table DIM 3.2 2.5 MAT [ assets/materials/table_top.png assets/materials/table_leg.png ] SHAPE rect TRANS_Y 2
    `);

    const textConfigReader = new TextConfigReader();

    const {worldItemTypes} = textConfigReader.read(worldMap);

    expect(worldItemTypes[0]).toMatchMeshDescriptor({
        char: 'I',
        materials: ['assets/materials/window.png'],
        scale: 2,
        model: 'assets/models/window.babylon',
        realDimensions: {
            width: 2,
            height: 2
        }
    });

    expect(worldItemTypes[1]).toMatchObject({
        char: 'T',
        materials: [
            'assets/materials/table_top.png',
            'assets/materials/table_leg.png'
        ],
        shape: 'rect',
        translateY: 2,
        realDimensions: {
            width: 3.2,
            height: 2.5
        }
    });
});