import { CombinedWorldItemParser } from "../parsers/CombinedWorldItemParser";
import { RoomSeparatorParser } from "../parsers/room_separator_parser/RoomSeparatorParser";
import { RoomInfoParser } from "../parsers/room_parser/RoomInfoParser";
import { BorderItemSegmentingTransformator } from "./BorderItemSegmentingTransformator";
import { expect } from "chai";
import _ = require("lodash");
import { Polygon, Point } from "@nightshifts.inc/geometry";
import { WorldItemInfoFactory } from "../WorldItemInfoFactory";
import { hasAnyWorldItemInfoDimension } from "../parsers/room_separator_parser/RoomSeparatorParser.test";


describe ('BorderItemSegmentingTransformator', () => {
    describe('generate', () => {
        it ('segments the walls into smaller pieces so that no wall will cover more then one room', () => {
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

            const worldItemInfoFacotry = new WorldItemInfoFactory();
            let items = new CombinedWorldItemParser(
                [
                    new RoomSeparatorParser(worldItemInfoFacotry, ['W']),
                    new RoomInfoParser(worldItemInfoFacotry)
                ]
            ).generateFromStringMap(map);

            items = new BorderItemSegmentingTransformator(worldItemInfoFacotry, ['wall']).transform(items);

            expect(items.filter(item => item.name === 'wall').length).to.eql(7, 'wall segment number not ok');

            expect(_.some(items, {dimensions: Polygon.createRectangle(0, 0, 1, 4)}), 'Rectangle(0, 0, 1, 4) not found.').to.be.true;
            expect(_.some(items, {dimensions: Polygon.createRectangle(0, 3, 1, 4)}), 'Rectangle(0, 3, 1, 4) not found.').to.be.true;
            expect(_.some(items, {dimensions: Polygon.createRectangle(9, 0, 1, 4)}), 'Rectangle(9, 0, 1, 4) not found.').to.be.true;
            expect(_.some(items, {dimensions: Polygon.createRectangle(9, 3, 1, 4)}), 'Rectangle(9, 3, 1, 4) not found.').to.be.true;
            expect(_.some(items, {dimensions: Polygon.createRectangle(0, 0, 10, 1)}), 'Rectangle(0, 0, 10, 1) not found.').to.be.true;
            expect(_.some(items, {dimensions: Polygon.createRectangle(0, 3, 10, 1)}), 'Rectangle(0, 3, 10, 1) not found.').to.be.true;
            expect(_.some(items, {dimensions: Polygon.createRectangle(0, 6, 10, 1)}), 'Rectangle(0, 6, 10, 1) not found.').to.be.true;

        });

        it ('segments the walls into as many pices as many rooms the wall spans', () => {
            const map = `
                map \`

                WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
                W---------------------------------------------------W
                W---------------------------------------------------W
                W---------------------------------------------------W
                WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
                W-------------W-----------W-------------W-----------W
                W-------------W-----------W-------------W-----------W
                W-------------W-----------W-------------W-----------W
                W-------------W-----------W-------------W-----------W
                WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

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

            expect(items.filter(item => item.name === 'wall').length).to.eq(16);
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(0, 0, 1, 5), items), 'Rectangle(0, 0, 1, 5) not found').to.be.true;
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(0, 4, 1, 6), items), 'Rectangle(0, 4, 1, 6) not found').to.be.true;
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(14, 4, 1, 6), items), 'Rectangle(14, 4, 1, 6) not found').to.be.true;
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(26, 4, 1, 6), items), 'Rectangle(26, 4, 1, 6) not found').to.be.true;
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(40, 4, 1, 6), items), 'Rectangle(40, 4, 1, 6) not found').to.be.true;
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(52, 0, 1, 5), items), 'Rectangle(52, 0, 1, 5) not found').to.be.true;
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(52, 4, 1, 6), items), 'Rectangle(52, 4, 1, 6) not found').to.be.true;
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(0, 0, 53, 1), items), 'Rectangle(0, 0, 53, 1) not found').to.be.true;
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(0, 4, 15, 1), items), 'Rectangle(0, 4, 15, 1) not found').to.be.true;
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(14, 4, 13, 1), items), 'Rectangle(14, 4, 12, 1) not found').to.be.true;
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(26, 4, 15, 1), items), 'Rectangle(26, 4, 14, 1) not found').to.be.true;
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(40, 4, 13, 1), items), 'Rectangle(40, 4, 13, 1) not found').to.be.true;
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(0, 9, 15, 1), items), 'Rectangle(0, 9, 15, 1) not found').to.be.true;
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(14, 9, 13, 1), items), 'Rectangle(14, 9, 12, 1) not found').to.be.true;
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(26, 9, 15, 1), items), 'Rectangle(26, 9, 14, 1) not found').to.be.true;
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(40, 9, 13, 1), items), 'Rectangle(40, 9, 13, 1) not found').to.be.true;
        });


        it.skip ('alternating segmentation not supported yet, but should add', () => {
            const map = `
                map \`

                WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
                W------------------W-------------------W
                W------------------W-------------------W
                W------------------W-------------------W
                WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
                W-------------W-----------W------------W
                W-------------W-----------W------------W
                W-------------W-----------W------------W
                W-------------W-----------W------------W
                WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

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

            expect(1).to.eq(2);
        });
    });
});