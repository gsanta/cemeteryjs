import { CombinedWorldItemGenerator } from './CombinedWorldItemGenerator';
import { RoomSeparatorGenerator } from '../room_separator_parsing/RoomSeparatorGenerator';
import { RoomInfoGenerator } from '../room_parsing/RoomInfoGenerator';
import { BorderItemAddingWorldItemGeneratorDecorator } from './BorderItemAddingWorldItemGeneratorDecorator';
import { expect } from 'chai';
import { BorderItemSegmentingWorldItemGeneratorDecorator } from './BorderItemSegmentingWorldItemGeneratorDecorator';
import { Rectangle } from '../../model/Rectangle';
import { Polygon } from '../../model/Polygon';
import _ = require('lodash');


describe('BorderItemAddingWorldItemGeneratorDecorator', () => {
    describe('generate', () => {
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

            const combinedWorldItemGenerator = new CombinedWorldItemGenerator(
                [
                    new RoomSeparatorGenerator(['W']),
                    new RoomInfoGenerator()
                ]
            );

            const borderItemAddingWorldItemGeneratorDecorator = new BorderItemAddingWorldItemGeneratorDecorator(
                combinedWorldItemGenerator,
                ['wall']
            );

            const [wall1, wall2, wall3, wall4, room] = borderItemAddingWorldItemGeneratorDecorator.generateFromStringMap(map);

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

            const borderItemAddingWorldItemGeneratorDecorator = new BorderItemAddingWorldItemGeneratorDecorator(
                new BorderItemSegmentingWorldItemGeneratorDecorator(
                    new CombinedWorldItemGenerator(
                        [
                            new RoomSeparatorGenerator(['W']),
                            new RoomInfoGenerator()
                        ]
                    ),
                    ['wall']
                ),
                ['wall'],
                false
            );

            const worldItems = borderItemAddingWorldItemGeneratorDecorator.generateFromStringMap(map);

            const room3 = worldItems.filter(worldItem => worldItem.name === 'room')[2];

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

            const borderItemAddingWorldItemGeneratorDecorator = new BorderItemAddingWorldItemGeneratorDecorator(
                new BorderItemSegmentingWorldItemGeneratorDecorator(
                    new CombinedWorldItemGenerator(
                        [
                            new RoomSeparatorGenerator(['W']),
                            new RoomInfoGenerator()
                        ]
                    ),
                    ['wall']
                ),
                ['wall'],
                true
            );

            const worldItems = borderItemAddingWorldItemGeneratorDecorator.generateFromStringMap(map);

            const room3 = worldItems.filter(worldItem => worldItem.name === 'room')[2];

            const borderItemDimensions = room3.borderItems.map(borderItem => borderItem.dimensions);

            const cornerIntersectingRect = new Rectangle(4, 0, 1, 5);
            expect(_.find(borderItemDimensions, (dim: Polygon) => dim.equalTo(cornerIntersectingRect))).to.eql(undefined);
        });
    });
});