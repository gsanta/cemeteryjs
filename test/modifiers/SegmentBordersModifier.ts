import { Polygon } from "@nightshifts.inc/geometry";
import { CombinedWorldItemParser } from "../../src/parsers/CombinedWorldItemParser";
import { RoomInfoParser } from "../../src/parsers/room_parser/RoomInfoParser";
import { RoomSeparatorParser } from "../../src/parsers/room_separator_parser/RoomSeparatorParser";
import { SegmentBordersModifier } from "../../src/modifiers/SegmentBordersModifier";
import { WorldItemInfoFactory } from "../../src/WorldItemInfoFactory";
import _ = require("lodash");


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
                    new RoomSeparatorParser(worldItemInfoFacotry, ['wall']),
                    new RoomInfoParser(worldItemInfoFacotry)
                ]
            ).generateFromStringMap(map);

            items = new SegmentBordersModifier(worldItemInfoFacotry, ['wall']).apply(items);

            expect(items.filter(item => item.name === 'wall').length).toEqual(7);

            expect(_.some(items, {dimensions: Polygon.createRectangle(0, 0, 1, 4)})).toBeTruthy();
            expect(_.some(items, {dimensions: Polygon.createRectangle(0, 3, 1, 4)})).toBeTruthy();
            expect(_.some(items, {dimensions: Polygon.createRectangle(9, 0, 1, 4)})).toBeTruthy();
            expect(_.some(items, {dimensions: Polygon.createRectangle(9, 3, 1, 4)})).toBeTruthy();
            expect(_.some(items, {dimensions: Polygon.createRectangle(0, 0, 10, 1)})).toBeTruthy();
            expect(_.some(items, {dimensions: Polygon.createRectangle(0, 3, 10, 1)})).toBeTruthy();
            expect(_.some(items, {dimensions: Polygon.createRectangle(0, 6, 10, 1)})).toBeTruthy();

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
                    new RoomSeparatorParser(worldItemInfoFacotry, ['wall']),
                    new RoomInfoParser(worldItemInfoFacotry)
                ]
            ).generateFromStringMap(map);

            items = new SegmentBordersModifier(worldItemInfoFacotry, ['wall']).apply(items);

            expect(items.filter(item => item.name === 'wall').length).toEqual(16);
            // TODO: fix expectations
            // expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(0, 0, 1, 5), items), 'Rectangle(0, 0, 1, 5) not found').to.be.true;
            // expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(0, 4, 1, 6), items), 'Rectangle(0, 4, 1, 6) not found').to.be.true;
            // expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(14, 4, 1, 6), items), 'Rectangle(14, 4, 1, 6) not found').to.be.true;
            // expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(26, 4, 1, 6), items), 'Rectangle(26, 4, 1, 6) not found').to.be.true;
            // expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(40, 4, 1, 6), items), 'Rectangle(40, 4, 1, 6) not found').to.be.true;
            // expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(52, 0, 1, 5), items), 'Rectangle(52, 0, 1, 5) not found').to.be.true;
            // expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(52, 4, 1, 6), items), 'Rectangle(52, 4, 1, 6) not found').to.be.true;
            // expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(0, 0, 53, 1), items), 'Rectangle(0, 0, 53, 1) not found').to.be.true;
            // expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(0, 4, 15, 1), items), 'Rectangle(0, 4, 15, 1) not found').to.be.true;
            // expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(14, 4, 13, 1), items), 'Rectangle(14, 4, 12, 1) not found').to.be.true;
            // expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(26, 4, 15, 1), items), 'Rectangle(26, 4, 14, 1) not found').to.be.true;
            // expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(40, 4, 13, 1), items), 'Rectangle(40, 4, 13, 1) not found').to.be.true;
            // expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(0, 9, 15, 1), items), 'Rectangle(0, 9, 15, 1) not found').to.be.true;
            // expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(14, 9, 13, 1), items), 'Rectangle(14, 9, 12, 1) not found').to.be.true;
            // expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(26, 9, 15, 1), items), 'Rectangle(26, 9, 14, 1) not found').to.be.true;
            // expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(40, 9, 13, 1), items), 'Rectangle(40, 9, 13, 1) not found').to.be.true;
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
                    new RoomSeparatorParser(worldItemInfoFacotry, ['wall']),
                    new RoomInfoParser(worldItemInfoFacotry)
                ]
            ).generateFromStringMap(map);

            items = new SegmentBordersModifier(worldItemInfoFacotry, ['wall']).apply(items);

            expect(1).toEqual(2);
        });
    });
});