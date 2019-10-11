import { BuildHierarchyModifier } from '../src/model/modifiers/BuildHierarchyModifier';
import { ScaleModifier } from '../src/model/modifiers/ScaleModifier';
import { SegmentBordersModifier } from '../src/model/modifiers/SegmentBordersModifier';
import { ServiceFacade } from '../src/model/services/ServiceFacade';
import { setup } from './test_utils/testUtils';

function createMap(worldMap: string) {
    return `
        map \`

        ${worldMap}

        \`

        definitions \`

        - = empty
        W = wall
        I = window
        T = table
        D = door
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
        let services: ServiceFacade<any, any, any> = setup(map);

        const [root] = services.importerService.import(
            map,
            [
                ScaleModifier.modName,
                SegmentBordersModifier.modName,
                BuildHierarchyModifier.modName
            ]
        );

        expect(root.children.length).toEqual(10);
        expect(root.children[0].name).toEqual('room');
        const room = root.children[0];
        expect(room.children.length).toEqual(1);
        expect(room.children[0].name).toEqual('empty');
    });
});
