import { CombinedWorldItemGenerator } from "./CombinedWorldItemGenerator";
import { RoomSeparatorGenerator } from "../room_separator_parsing/RoomSeparatorGenerator";
import { RoomInfoGenerator } from "../room_parsing/RoomInfoGenerator";
import { BorderItemSegmentingWorldItemGeneratorDecorator } from "./BorderItemSegmentingWorldItemGeneratorDecorator";
import { expect } from "chai";


describe('BorderItemSegmentingWorldItemGeneratorDecorator', () => {
    describe('generate', () => {
        it.only ('segments the two vertical walls so that they wont \'overflow\' the rooms', () => {
            const map = `
                map \`

                WWWWWWWWWW
                W--------W
                W--------W
                WWWWWWWWWW
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

            const borderItemSegmentingWorldItemGeneratorDecorator = new BorderItemSegmentingWorldItemGeneratorDecorator(
                combinedWorldItemGenerator,
                ['wall']
            );

            const items = borderItemSegmentingWorldItemGeneratorDecorator.generateFromStringMap(map);

            expect(items.length).to.eql(2);
        });
    });
});