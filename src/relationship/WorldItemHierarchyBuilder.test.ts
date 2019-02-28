import { WorldItemHierarchyBuilder } from './WorldItemHierarchyBuilder';
import { WorldItem } from '../model/WorldItem';
import { Point } from '../model/Point';
import { Polygon, WorldMapParser } from '..';
import { expect } from 'chai';
import { defaultParseOptions } from '../WorldMapParser';


describe('WorldItemHierarchyBuilder', () => {
    describe('build', () => {
        it ('creates a parent-child relationship between two WorldItems, if one contains the other', () => {
            const worldItemHierarchyBuilder = new WorldItemHierarchyBuilder(['room'], ['cupboard']);

            const worldItemParentMock = new WorldItem(
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
                '',
                new Polygon([
                    new Point(1, 1),
                    new Point(2, 1),
                    new Point(2, 2),
                    new Point(1, 2),
                ]),
                'cupboard'
            );

            worldItemHierarchyBuilder.build([<WorldItem> worldItemParentMock, <WorldItem> worldItemChildMock]);

            expect(worldItemParentMock.childWorldItems.length).to.eq(1);
            expect(worldItemParentMock.childWorldItems[0]).to.eq(worldItemChildMock);
        });

        it ('does not create a parent-child relationship if one does not contain the other', () => {
            const worldItemHierarchyBuilder = new WorldItemHierarchyBuilder(['room'], ['cupboard']);

            const worldItemParentMock = new WorldItem(
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
                '',
                new Polygon([
                    new Point(5, 1),
                    new Point(6, 1),
                    new Point(6, 2),
                    new Point(5, 2),
                ]),
                'cupboard'
            );

            worldItemHierarchyBuilder.build([<WorldItem> worldItemParentMock, <WorldItem> worldItemChildMock]);

            expect(worldItemParentMock.childWorldItems.length).to.eq(0);
        });

        it ('works for a more complicated example', () => {
            const map = `
                map \`

                WWDDWWWDDWWW
                WCCC##WBB##W
                WCCC##W####W
                W#####WBB##W
                WWWWWWWWWWWW

                \`

                definitions \`

                # = empty
                D = door
                C = cupboard
                B = bed
                W = wall

                \`
            `;

            const worldMapParser = WorldMapParser.createWithOptions({...defaultParseOptions, ...{xScale: 1, yScale: 2}});
            const items = worldMapParser.parse(map);

            const worldItemHierarchyBuilder = new WorldItemHierarchyBuilder(['room'], ['cupboard', 'bed']);
            worldItemHierarchyBuilder.build(items);

            const [room1, room2] = items.filter(item => item.name === 'room');

            expect(room1.childWorldItems.length).to.eql(1);
            expect(room2.childWorldItems.length).to.eql(2);
        });
    });
});