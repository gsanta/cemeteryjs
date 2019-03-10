import { CombinedWorldItemGenerator } from './CombinedWorldItemGenerator';
import { RoomSeparatorGenerator } from '../room_separator_parsing/RoomSeparatorGenerator';
import { RoomInfoGenerator } from '../room_parsing/RoomInfoGenerator';
import { BorderItemAddingWorldItemGeneratorDecorator } from './BorderItemAddingWorldItemGeneratorDecorator';
import { expect } from 'chai';


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
    });
});