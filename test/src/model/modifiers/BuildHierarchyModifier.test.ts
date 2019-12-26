import { BuildHierarchyModifier } from '../../../../src/world_generator/modifiers/BuildHierarchyModifier';
import { setupMap, setup } from '../../../testUtils';
import { ScaleModifier } from '../../../../src/world_generator/modifiers/ScaleModifier';
import { FileFormat } from '../../../../src/WorldGenerator';

describe('BuildHierarchyModifier', () => {
    describe('apply', () => {
        it ('creates a parent-child relationship between two WorldItems, if one contains the other', () => {
            const map = setupMap(
                `
                WDDWWWWW
                W--WT--W
                W-EW---W
                WWWWWWWW

                `
            );

            const services = setup(map, FileFormat.TEXT);

            const worldItems = services.gameObjectBuilder.build(map);
            const [root] = services.modifierExecutor.applyModifiers(
                worldItems,
                [
                    ScaleModifier.modName,
                    BuildHierarchyModifier.modName                ]    
            );

            const room1 = root.children.find(child => child.id === 'room-1');
            expect(room1.children.length).toEqual(1);
            expect(room1.children[0].id).toEqual('bed-1');

            const room2 = root.children.find(child => child.id === 'room-2');
            expect(room2.children.length).toEqual(1);
            expect(room2.children[0].id).toEqual('table-1');
        });
    });

    describe('apply', () => {
        it ('creates a parent-child relationship between two WorldItems, if one contains the other', () => {
            const map = setupMap(
                `
                WWWWWWWWWW
                W---==---W
                W--=TT=--W
                W--=TT=--W
                W--------W
                W--EE====W
                WWWWWWWWWW
                `
            );

            const services = setup(map, FileFormat.TEXT);

            const worldItems = services.gameObjectBuilder.build(map);
            const [root] = services.modifierExecutor.applyModifiers(
                worldItems,
                [
                    ScaleModifier.modName,
                    BuildHierarchyModifier.modName                ]    
            );

            const room = root.children.find(item => item.name === 'room');

            expect(room.children).toContainWorldItem({id: '_subarea-1'});
            expect(room.children).toContainWorldItem({id: '_subarea-2'});

            const subarea1 = room.children.find(item => item.id === '_subarea-1');

            expect(subarea1.children).toContainWorldItem({id: 'table-1'});

            const subarea2 = room.children.find(item => item.id === '_subarea-2');
            expect(subarea2.children).toContainWorldItem({id: 'bed-1'});
        });
    });
});