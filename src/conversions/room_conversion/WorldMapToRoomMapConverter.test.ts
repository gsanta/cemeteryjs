import { WorldMapToRoomMapConverter } from './WorldMapToRoomMapConverter';
import { expect } from 'chai';

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
});