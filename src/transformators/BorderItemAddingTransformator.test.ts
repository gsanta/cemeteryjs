import { CombinedWorldItemGenerator } from '../parsers/CombinedWorldItemGenerator';
import { RoomSeparatorGenerator } from '../parsers/room_separator_parsing/RoomSeparatorGenerator';
import { RoomInfoGenerator } from '../parsers/room_parsing/RoomInfoGenerator';
import { BorderItemAddingTransformator } from './BorderItemAddingTransformator';
import { expect } from 'chai';
import { BorderItemSegmentingTransformator } from './BorderItemSegmentingTransformator';
import { Rectangle } from '../model/Rectangle';
import { Polygon } from '../model/Polygon';
import _ = require('lodash');
import { ScalingTransformator } from './ScalingTransformator';


describe('BorderItemAddingTransformator', () => {
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

            let items = new CombinedWorldItemGenerator(
                [
                    new RoomSeparatorGenerator(['W']),
                    new RoomInfoGenerator()
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

            let items = new CombinedWorldItemGenerator(
                [
                    new RoomSeparatorGenerator(['W']),
                    new RoomInfoGenerator()
                ]
            ).generateFromStringMap(map);

            items = new BorderItemSegmentingTransformator(['wall']).transform(items);
            items = new BorderItemAddingTransformator(['wall'], false).transform(items);

            const room3 = items.filter(worldItem => worldItem.name === 'room')[2];

            const borderItemDimensions = room3.borderItems.map(borderItem => borderItem.dimensions);

            const cornerIntersectingRect = new Rectangle(4, 0, 1, 5);
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

            let items = new CombinedWorldItemGenerator(
                [
                    new RoomSeparatorGenerator(['W']),
                    new RoomInfoGenerator()
                ]
            ).generateFromStringMap(map);

            items = new BorderItemSegmentingTransformator(['wall']).transform(items);
            items = new BorderItemAddingTransformator(['wall']).transform(items);

            const room3 = items.filter(worldItem => worldItem.name === 'room')[2];

            const borderItemDimensions = room3.borderItems.map(borderItem => borderItem.dimensions);

            const cornerIntersectingRect = new Rectangle(4, 0, 1, 5);
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

            let items = new CombinedWorldItemGenerator(
                [
                    new RoomSeparatorGenerator(['W']),
                    new RoomInfoGenerator()
                ]
            ).generateFromStringMap(map);

            items = new ScalingTransformator({x: 2, y: 2}).transform(items);
            items = new BorderItemSegmentingTransformator(['wall'], {xScale: 2, yScale: 2}).transform(items);
            items = new BorderItemAddingTransformator(['wall']).transform(items);

            const room3 = items.filter(worldItem => worldItem.name === 'room')[0];

            const borderItemDimensions = room3.borderItems.map(borderItem => borderItem.dimensions);
            1;
            const cornerIntersectingRect = new Rectangle(8, 8, 2, 10);
            expect(_.find(borderItemDimensions, (dim: Polygon) => dim.equalTo(cornerIntersectingRect))).to.eql(undefined);
        });
    });
});