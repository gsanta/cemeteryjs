import { CombinedWorldItemParser } from '../parsers/CombinedWorldItemParser';
import { RoomSeparatorParser } from '../parsers/room_separator_parser/RoomSeparatorParser';
import { RoomInfoParser } from '../parsers/room_parser/RoomInfoParser';
import { BorderItemAddingTransformator } from './BorderItemAddingTransformator';
import { expect } from 'chai';
import { BorderItemSegmentingTransformator } from './BorderItemSegmentingTransformator';
import _ = require('lodash');
import { ScalingTransformator } from './ScalingTransformator';
import { Polygon } from '@nightshifts.inc/geometry';
import { WorldItemInfoFactory } from '../WorldItemInfoFactory';


describe('`BorderItemAddingTransformator`', () => {
    describe('`transform`', () => {
        it ('adds the bordering WorldItems to the corresponding room WorldItem', () => {
            const map = `
                map \`

                WWWWWWWWWW
                W--------W
                W--------W
                W--------W
                WWWWWWWWWW

                \`

                definitions \`

                - = empty
                W = wall

                \`
            `;

            const worldItemInfoFacotry = new WorldItemInfoFactory();
            let items = new CombinedWorldItemParser(
                [
                    new RoomSeparatorParser(worldItemInfoFacotry, ['W']),
                    new RoomInfoParser(worldItemInfoFacotry)
                ]
            ).generateFromStringMap(map);

            const [wall1, wall2, wall3, wall4, room] =  new BorderItemAddingTransformator(['wall']).transform(items);

            expect(room.borderItems).to.eql([wall1, wall2, wall3, wall4]);
        });

        it ('adds border items that intersect at corner when doNotIncludeBorderItemsThatIntersectsOnlyAtCorner is set', () => {
            const map = `
                map \`

                WWWWWWWWWW
                W---W----W
                W---W----W
                W---W----W
                WWWWWWWWWW
                W--------W
                W--------W
                W--------W
                WWWWWWWWWW

                \`

                definitions \`

                - = empty
                W = wall

                \`
            `;

            const worldItemInfoFacotry = new WorldItemInfoFactory();
            let items = new CombinedWorldItemParser(
                [
                    new RoomSeparatorParser(worldItemInfoFacotry, ['W']),
                    new RoomInfoParser(worldItemInfoFacotry)
                ]
            ).generateFromStringMap(map);

            items = new BorderItemSegmentingTransformator(worldItemInfoFacotry, ['wall']).transform(items);
            items = new BorderItemAddingTransformator(['wall'], false).transform(items);

            const room3 = items.filter(worldItem => worldItem.name === 'room')[2];

            const borderItemDimensions = room3.borderItems.map(borderItem => borderItem.dimensions);

            const cornerIntersectingRect = Polygon.createRectangle(4, 0, 1, 5);
            expect(_.find(borderItemDimensions, (dim: Polygon) => dim.equalTo(cornerIntersectingRect))).to.eql(cornerIntersectingRect);
        });

        it ('does not add the bordering WorldItem if it only touches the room at it\'s edge', () => {
            const map = `
                map \`

                WWWWWWWWWW
                W---W----W
                W---W----W
                W---W----W
                WWWWWWWWWW
                W--------W
                W--------W
                W--------W
                WWWWWWWWWW

                \`

                definitions \`

                - = empty
                W = wall

                \`
            `;

            const worldItemInfoFacotry = new WorldItemInfoFactory();
            let items = new CombinedWorldItemParser(
                [
                    new RoomSeparatorParser(worldItemInfoFacotry, ['W']),
                    new RoomInfoParser(worldItemInfoFacotry)
                ]
            ).generateFromStringMap(map);

            items = new BorderItemSegmentingTransformator(worldItemInfoFacotry, ['wall']).transform(items);
            items = new BorderItemAddingTransformator(['wall']).transform(items);

            const room3 = items.filter(worldItem => worldItem.name === 'room')[2];

            const borderItemDimensions = room3.borderItems.map(borderItem => borderItem.dimensions);

            const cornerIntersectingRect = Polygon.createRectangle(4, 0, 1, 5);
            expect(_.find(borderItemDimensions, (dim: Polygon) => dim.equalTo(cornerIntersectingRect))).to.eql(undefined);
        });

        it ('takes scales into consideration when calculating \'only corner\' connection', () => {
            const map = `
                map \`

                WWWWWWWWWW
                W--------W
                W--------W
                W--------W
                WWWWWWWWWW
                W---W----W
                W---W----W
                W---W----W
                WWWWWWWWWW

                \`

                definitions \`

                - = empty
                W = wall

                \`
            `;

            const worldItemInfoFacotry = new WorldItemInfoFactory();
            let items = new CombinedWorldItemParser(
                [
                    new RoomSeparatorParser(worldItemInfoFacotry, ['W']),
                    new RoomInfoParser(worldItemInfoFacotry)
                ]
            ).generateFromStringMap(map);

            items = new ScalingTransformator({x: 2, y: 2}).transform(items);
            items = new BorderItemSegmentingTransformator(worldItemInfoFacotry, ['wall'], {xScale: 2, yScale: 2}).transform(items);
            items = new BorderItemAddingTransformator(['wall']).transform(items);

            const room3 = items.filter(worldItem => worldItem.name === 'room')[0];

            const borderItemDimensions = room3.borderItems.map(borderItem => borderItem.dimensions);
            1;
            const cornerIntersectingRect = Polygon.createRectangle(8, 8, 2, 10);
            expect(_.find(borderItemDimensions, (dim: Polygon) => dim.equalTo(cornerIntersectingRect))).to.eql(undefined);
        });
    });
});