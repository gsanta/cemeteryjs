import { WorldMapToRoomMapConverter } from '../../../../src/model/readers/text/WorldMapToRoomMapConverter';
import * as fs from 'fs';
import { setup } from '../../testUtils';

describe('WorldMapToRoomMapConverter', () => {
    describe('convert', () => {
        it ('replaces the non-wall room-separator characters to wall characters', () => {
            const input = `
                map \`

                **********
                *WWDDWWWW*
                *W------I*
                *WWWWWWWW*
                **********

                \`

                definitions \`

                - = room
                I = window BORDER
                D = door BORDER
                W = wall BORDER
                * = outdoors

                \`
            `;

            const output = `
                map \`

                **********
                *WWWWWWWW*
                *W------W*
                *WWWWWWWW*
                **********

                \`

                definitions \`

                - = room
                I = window BORDER
                D = door BORDER
                W = wall BORDER
                * = outdoors

                \`
            `;

            const services = setup(input);

            const worldMapToRoomMapConverter = new WorldMapToRoomMapConverter(services.configService);

            expect(worldMapToRoomMapConverter.convert(input)).toEqual(output);
        });
    });
});