import { Point, Polygon } from '@nightshifts.inc/geometry';
import { SubareaParser } from '../../../src/model/parsers/SubareaParser';
import { setup } from '../../test_utils/mocks';

describe('SubareaParser', () => {
    // it ('creates WorldItems for each subarea', () => {
    //     const worldMap = `
    //         map \`

    //         WWWWDDDWWW
    //         W--====--W
    //         W--====--I
    //         W--------I
    //         W----====W
    //         WWWWWWWWWW

    //         \`

    //         definitions \`

    //         - = empty
    //         I = window
    //         D = door
    //         W = wall
    //         = = _subarea

    //         \`
    //     `;

    //     const services = setup(worldMap, []);
    //     const subareaParser = new SubareaParser(services);

    //     const worldItems = subareaParser.parse(worldMap);

    //     expect(worldItems).toContainWorldItem({id: '_subarea-1', name: '_subarea', dimensions: Polygon.createRectangle(3, 1, 4, 2)});
    //     expect(worldItems).toContainWorldItem({id: '_subarea-2', name: '_subarea', dimensions: Polygon.createRectangle(5, 4, 4, 1)});
    // });

    it ('puts the furnitures under the corresponding subarea', () => {
        const worldMap = `
            map \`

            WWWWWWWWWW
            W---==---W
            W--=TT=--W
            W--=TT=--W
            W--------W
            W--EE====W
            WWWWWWWWWW

            \`

            definitions \`

            - = empty
            I = window
            D = door
            W = wall
            T = table
            E = bed
            = = _subarea

            \`
        `;

        const services = setup(worldMap, []);
        const subareaParser = new SubareaParser(services);

        const worldItems = subareaParser.parse(worldMap);

        expect(worldItems).toContainWorldItem({id: '_subarea-1', name: '_subarea', dimensions: Polygon.createRectangle(3, 1, 4, 2)});
        expect(worldItems).toContainWorldItem({id: '_subarea-2', name: '_subarea', dimensions: Polygon.createRectangle(5, 4, 4, 1)});
    });
});