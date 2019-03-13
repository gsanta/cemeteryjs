import { CombinedWorldItemGenerator } from "./CombinedWorldItemGenerator";
import { RoomSeparatorGenerator } from "../room_separator_parsing/RoomSeparatorGenerator";
import { RoomInfoGenerator } from "../room_parsing/RoomInfoGenerator";
import { BorderItemSegmentingWorldItemGeneratorDecorator } from "./BorderItemSegmentingWorldItemGeneratorDecorator";
import { expect } from "chai";
import { Rectangle } from '../../model/Rectangle';
import _ = require("lodash");


describe('BorderItemSegmentingWorldItemGeneratorDecorator', () => {
    describe('generate', () => {
        it ('segments the walls into smaller pieces so that no wall will conver more then one room', () => {
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

            expect(items.filter(item => item.name === 'wall').length).to.eql(13, 'wall segment number not ok');

            expect(_.some(items, {dimensions: new Rectangle(0, 0, 1, 1)}), 'Rectangle(0, 0, 1, 1) not found.').to.be.true;
            expect(_.some(items, {dimensions: new Rectangle(1, 0, 8, 1)}), 'Rectangle(1, 0, 8, 1) not found.').to.be.true;
            expect(_.some(items, {dimensions: new Rectangle(9, 0, 1, 1)}), 'Rectangle(9, 0, 1, 1) not found.').to.be.true;
            expect(_.some(items, {dimensions: new Rectangle(0, 1, 1, 2)}), 'Rectangle(0, 1, 1, 2) not found.').to.be.true;
            expect(_.some(items, {dimensions: new Rectangle(9, 1, 1, 2)}), 'Rectangle(9, 1, 1, 2) not found.').to.be.true;
            expect(_.some(items, {dimensions: new Rectangle(0, 3, 1, 1)}), 'Rectangle(0, 3, 1, 1) not found.').to.be.true;
            expect(_.some(items, {dimensions: new Rectangle(9, 3, 1, 1)}), 'Rectangle(9, 3, 1, 1) not found.').to.be.true;
            expect(_.some(items, {dimensions: new Rectangle(1, 3, 8, 1)}), 'Rectangle(1, 3, 8, 1) not found.').to.be.true;
            expect(_.some(items, {dimensions: new Rectangle(0, 4, 1, 2)}), 'Rectangle(0, 4, 1, 2) not found.').to.be.true;
            expect(_.some(items, {dimensions: new Rectangle(9, 4, 1, 2)}), 'Rectangle(9, 4, 1, 2) not found.').to.be.true;
            expect(_.some(items, {dimensions: new Rectangle(0, 6, 1, 1)}), 'Rectangle(0, 6, 1, 1) not found.').to.be.true;
            expect(_.some(items, {dimensions: new Rectangle(9, 6, 1, 1)}), 'Rectangle(9, 6, 1, 1) not found.').to.be.true;
            expect(_.some(items, {dimensions: new Rectangle(1, 6, 8, 1)}), 'Rectangle(1, 6, 8, 1) not found.').to.be.true;

        });
    });
});