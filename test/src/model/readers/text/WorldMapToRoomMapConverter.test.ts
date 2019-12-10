import { WorldMapToRoomMapConverter } from '../../../../../src/model/readers/text/WorldMapToRoomMapConverter';
import * as fs from 'fs';
import { setup } from '../../../../testUtils';
import { FileFormat } from '../../../../../src/WorldGenerator';

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
                I = window ROLES [BORDER]
                D = door ROLES [BORDER]
                W = wall ROLES [BORDER]
                * = outdoors ROLES [CONTAINER]

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
                I = window ROLES [BORDER]
                D = door ROLES [BORDER]
                W = wall ROLES [BORDER]
                * = outdoors ROLES [CONTAINER]

                \`
            `;

            const services = setup(input, FileFormat.TEXT);

            const worldMapToRoomMapConverter = new WorldMapToRoomMapConverter(services.configService);

            expect(worldMapToRoomMapConverter.convert(input)).toEqual(output);
        });
    });
});