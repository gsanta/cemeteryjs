import { CombinedWorldItemParser } from "../parsers/CombinedWorldItemParser";
import { RoomSeparatorParser } from "../parsers/room_separator_parser/RoomSeparatorParser";
import { RoomInfoParser } from "../parsers/room_parser/RoomInfoParser";
import { BorderItemSegmentingTransformator } from "./BorderItemSegmentingTransformator";
import { expect } from "chai";
import { Rectangle } from '../model/Rectangle';
import _ = require("lodash");


describe('BorderItemSegmentingTransformator', () => {
    describe('generate', () => {
        it ('segments the walls into smaller pieces with minimal number of segmentation', () => {
            const map = `
                map \`

                WWWWWWWWWWWWWWWWWWWWW
                W-------------------W
                W-------X-----------W
                W-------------------W
                W-------------------W
                W-------------------W
                W-------------------W
                W-------------------W
                W-------------------W
                WWWWWWWWWWWWWWWWWWWWW

                \`

                definitions \`

                - = empty
                W = wall
                X = player

                \`
            `;

            let items = new CombinedWorldItemParser(
                [
                    new RoomSeparatorParser(['W']),
                    new RoomInfoParser()
                ]
            ).generateFromStringMap(map);

            items = new BorderItemSegmentingTransformator(['wall']).transform(items);

            expect(items.filter(item => item.name === 'wall').length).to.eql(4, 'wall segment number not ok');
        });
    });


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

            let items = new CombinedWorldItemParser(
                [
                    new RoomSeparatorParser(['W']),
                    new RoomInfoParser()
                ]
            ).generateFromStringMap(map);

            items = new BorderItemSegmentingTransformator(['wall']).transform(items);

            expect(items.filter(item => item.name === 'wall').length).to.eql(7, 'wall segment number not ok');

            expect(_.some(items, {dimensions: new Rectangle(0, 0, 1, 4)}), 'Rectangle(0, 0, 1, 4) not found.').to.be.true;
            expect(_.some(items, {dimensions: new Rectangle(9, 4, 1, 3)}), 'Rectangle(9, 4, 1, 3) not found.').to.be.true;
            expect(_.some(items, {dimensions: new Rectangle(9, 0, 1, 4)}), 'Rectangle(9, 0, 1, 4) not found.').to.be.true;
            expect(_.some(items, {dimensions: new Rectangle(1, 0, 8, 1)}), 'Rectangle(1, 0, 8, 1) not found.').to.be.true;
            expect(_.some(items, {dimensions: new Rectangle(1, 0, 8, 1)}), 'Rectangle(1, 0, 8, 1) not found.').to.be.true;
            expect(_.some(items, {dimensions: new Rectangle(1, 3, 8, 1)}), 'Rectangle(1, 3, 8, 1) not found.').to.be.true;
            expect(_.some(items, {dimensions: new Rectangle(1, 6, 8, 1)}), 'Rectangle(1, 6, 8, 1) not found.').to.be.true;

        });
    });
});