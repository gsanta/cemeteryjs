import { WorldMapToRoomMapConverter } from '../../../src/parsers/room_parser/WorldMapToRoomMapConverter';
import { expect } from 'chai';
import * as fs from 'fs';

describe('WorldMapToRoomMapConverter', () => {
    describe('convert', () => {
        it ('replaces the non-wall room-separator characters to wall characters', () => {
            const input = `
            map \`

            ##########
            #WWDDWWWW#
            #W######I#
            #WWWWWWWW#
            ##########

            \`

            definitions \`

            # = empty
            I = window
            D = door
            W = wall

            \`
        `;

        const output = `
            map \`

            ----------
            -WWWWWWWW-
            -W------W-
            -WWWWWWWW-
            ----------

            \`

            definitions \`

            # = empty
            I = window
            D = door
            W = wall

            \`
        `;


            const worldMapToRoomMapConverter = new WorldMapToRoomMapConverter('W', '-', ['D', 'I']);

            expect(worldMapToRoomMapConverter.convert(input)).to.eq(output);
        });
    });

    it ('converts a complicated real-world example correctly.', () => {
        const worldMapStr = fs.readFileSync(__dirname + '/../../../assets/test/big_world.gwm', 'utf8');

        const worldMapToRoomMapConverter = new WorldMapToRoomMapConverter('W', '-', ['D', 'I']);
        const actualConvertedWorldMapStr = worldMapToRoomMapConverter.convert(worldMapStr);

        const expectedConvertedWorldMap = fs.readFileSync(__dirname + '/../../../assets/test/big_world_rooms.gwm', 'utf8');
        expect(actualConvertedWorldMapStr).to.eq(expectedConvertedWorldMap);
    });
});