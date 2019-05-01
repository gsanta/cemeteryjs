import { expect } from 'chai';
import { GwmWorldItem } from '../GwmWorldItem';
import { HierarchyBuildingTransformator } from './HierarchyBuildingTransformator';
import { Polygon, Point } from '@nightshifts.inc/geometry';


describe('HierarchyBuildingTransformator', () => {
    describe('transform', () => {
        it ('creates a parent-child relationship between two WorldItems, if one contains the other', () => {
            const worldItemParentMock = new GwmWorldItem(
                '',
                new Polygon([
                        new Point(1, 1),
                        new Point(4, 1),
                        new Point(4, 4),
                        new Point(1, 4),
                ]),
                'room'
            );

            const worldItemChildMock = new GwmWorldItem(
                '',
                new Polygon([
                    new Point(1, 1),
                    new Point(2, 1),
                    new Point(2, 2),
                    new Point(1, 2),
                ]),
                'cupboard'
            );

            const hierarchyBuildingWorldItemGeneratorDecorator = new HierarchyBuildingTransformator();

            hierarchyBuildingWorldItemGeneratorDecorator.transform([worldItemParentMock, worldItemChildMock]);

            expect(worldItemParentMock.children.length).to.eq(1);
            expect(worldItemParentMock.children[0]).to.eq(worldItemChildMock);
        });

        it ('does not create a parent-child relationship if one does not contain the other', () => {
            const worldItemParentMock = new GwmWorldItem(
                '',
                new Polygon([
                        new Point(1, 1),
                        new Point(4, 1),
                        new Point(4, 4),
                        new Point(1, 4),
                ]),
                'room'
            );

            const worldItemChildMock = new GwmWorldItem(
                '',
                new Polygon([
                    new Point(5, 1),
                    new Point(6, 1),
                    new Point(6, 2),
                    new Point(5, 2),
                ]),
                'cupboard'
            );

            new HierarchyBuildingTransformator().transform([worldItemParentMock, worldItemChildMock]);

            expect(worldItemParentMock.children.length).to.eq(0);
        });
    });
});