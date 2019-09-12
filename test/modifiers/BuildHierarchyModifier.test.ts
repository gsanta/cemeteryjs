import { BuildHierarchyModifier } from '../../src/modifiers/BuildHierarchyModifier';
import { setupMap, setup } from '../test_utils/mocks';
import { ScaleModifier } from '../../src/modifiers/ScaleModifier';
import { SegmentBordersModifier } from '../../src/modifiers/SegmentBordersModifier';


describe('BuildHierarchyModifier', () => {
    describe('apply', () => {
        it ('creates a parent-child relationship between two WorldItems, if one contains the other', () => {
            const services = setup();
            const map = setupMap(
                `
                WDDWWWWW
                W--WT--W
                W-EW---W
                WWWWWWWW

                `
            );

            const [root] = services.importerService.import(
                map,
                [
                    ScaleModifier.modName,
                    SegmentBordersModifier.modName,
                    BuildHierarchyModifier.modName
                ]
            );

            const room1 = root.children[0];
            expect(room1.children.length).toEqual(2);
            expect(room1.children[0].id).toEqual('bed-1');
            expect(room1.children[1].id).toEqual('empty-1');

            const room2 = root.children[1];
            expect(room2.children.length).toEqual(2);
            expect(room2.children[0].id).toEqual('table-1');
            expect(room2.children[1].id).toEqual('empty-2');
        });
    });
});