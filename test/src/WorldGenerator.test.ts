import { BuildHierarchyModifier } from '../../src/world_generator/modifiers/BuildHierarchyModifier';
import { ScaleModifier } from '../../src/world_generator/modifiers/ScaleModifier';
import { SegmentBordersModifier } from '../../src/world_generator/modifiers/SegmentBordersModifier';
import { WorldGeneratorServices } from '../../src/world_generator/services/WorldGeneratorServices';
import { setup } from '../testUtils';
import { FileFormat } from '../../src/WorldGenerator';

function createMap(worldMap: string) {
    return `
        map \`

        ${worldMap}

        \`

        definitions \`

        - = room ROLES [CONTAINER]
        W = wall ROLES [BORDER]
        I = window ROLES [BORDER]
        T = table
        D = door ROLES [BORDER]
        C = cupboard
        B = bed

        \`
    `;
}

describe('`WorldParser`', () => {
    it ('can integrate with `PolygonAreaInfoGenerator`', () => {
        const map = createMap(
            `
            WWWWWWWW
            W---W--W
            W---WWWW
            W------W
            W------W
            WWWWWWWW
            `
        );
        let services: WorldGeneratorServices = setup(map, FileFormat.TEXT);

        const worldItems = services.gameObjectBuilder.build(map);
        const [root] = services.modifierExecutor.applyModifiers(
            worldItems,
            [
                SegmentBordersModifier.modName,
                ScaleModifier.modName,
                BuildHierarchyModifier.modName
            ]    
        );

        expect(root.children.length).toEqual(10);
        expect(root.children[0].name).toEqual('room');
    });
});
