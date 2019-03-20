import { CombinedWorldItemGenerator } from './CombinedWorldItemGenerator';
import { RoomSeparatorGenerator } from '../room_separator_parsing/RoomSeparatorGenerator';
import { RoomInfoGenerator } from '../room_parsing/RoomInfoGenerator';
import { BorderItemAddingWorldItemGeneratorDecorator } from './BorderItemAddingWorldItemGeneratorDecorator';
import { expect } from 'chai';
import { BorderItemSegmentingWorldItemGeneratorDecorator } from './BorderItemSegmentingWorldItemGeneratorDecorator';


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
                ['wall']
            );

            const worldItems = borderItemAddingWorldItemGeneratorDecorator.generateFromStringMap(map);

            expect(worldItems.length).to.eql(2);
        });
    });
});