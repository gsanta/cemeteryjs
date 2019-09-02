import { WorldItem } from '../../src/WorldItem';
import { BuildHierarchyModifier } from '../../src/modifiers/BuildHierarchyModifier';
import { Polygon, Point } from '@nightshifts.inc/geometry';


describe('HierarchyBuildingTransformator', () => {
    describe('apply', () => {
        it ('creates a parent-child relationship between two WorldItems, if one contains the other', () => {
            const worldItemParentMock = new WorldItem(
                '1',
                '',
                new Polygon([
                        new Point(1, 1),
                        new Point(4, 1),
                        new Point(4, 4),
                        new Point(1, 4),
                ]),
                'room'
            );

            const worldItemChildMock = new WorldItem(
                '2',
                '',
                new Polygon([
                    new Point(1, 1),
                    new Point(2, 1),
                    new Point(2, 2),
                    new Point(1, 2),
                ]),
                'cupboard'
            );

            const hierarchyBuildingWorldItemGeneratorDecorator = new BuildHierarchyModifier();

            hierarchyBuildingWorldItemGeneratorDecorator.apply([worldItemParentMock, worldItemChildMock]);

            expect(worldItemParentMock.children.length).toEqual(1);
            expect(worldItemParentMock.children[0]).toEqual(worldItemChildMock);
        });

        it ('does not create a parent-child relationship if one does not contain the other', () => {
            const worldItemParentMock = new WorldItem(
                '1',
                '',
                new Polygon([
                        new Point(1, 1),
                        new Point(4, 1),
                        new Point(4, 4),
                        new Point(1, 4),
                ]),
                'room'
            );

            const worldItemChildMock = new WorldItem(
                '2',
                '',
                new Polygon([
                    new Point(5, 1),
                    new Point(6, 1),
                    new Point(6, 2),
                    new Point(5, 2),
                ]),
                'cupboard'
            );

            new BuildHierarchyModifier().apply([worldItemParentMock, worldItemChildMock]);

            expect(worldItemParentMock.children.length).toEqual(0);
        });
    });
});