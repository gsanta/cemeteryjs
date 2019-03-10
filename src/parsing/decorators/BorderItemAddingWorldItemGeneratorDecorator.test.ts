import { CombinedWorldItemGenerator } from './CombinedWorldItemGenerator';
import { FurnitureInfoGenerator } from '../furniture_parsing/FurnitureInfoGenerator';
import { RoomSeparatorGenerator } from '../room_separator_parsing/RoomSeparatorGenerator';
import { RoomInfoGenerator } from '../room_parsing/RoomInfoGenerator';
import { RootWorldItemGenerator } from '../RootWorldItemGenerator';
import { BorderItemAddingWorldItemGeneratorDecorator } from './BorderItemAddingWorldItemGeneratorDecorator';


describe('BorderItemAddingWorldItemGeneratorDecorator', () => {
    describe('generate', () => {
        it.only ('adds the bordering WorldItems to the corresponding room WorldItem', () => {
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

            const worldItems = borderItemAddingWorldItemGeneratorDecorator.generateFromStringMap(map);
            debugger;
        });
    });
});