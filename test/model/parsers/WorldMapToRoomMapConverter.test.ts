import { WorldMapToRoomMapConverter } from '../../../src/model/parsers/WorldMapToRoomMapConverter';
import * as fs from 'fs';
import { setup } from '../../test_utils/testUtils';

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
                I = window BORDER
                D = door BORDER
                W = wall BORDER

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
                I = window BORDER
                D = door BORDER
                W = wall BORDER

                \`
            `;

            const services = setup(input);

            const worldMapToRoomMapConverter = new WorldMapToRoomMapConverter(services.configService, 'W', '-');

            expect(worldMapToRoomMapConverter.convert(input)).toEqual(output);
        });
    });

    it ('converts a complicated real-world example correctly.', () => {
        const worldMapStr = fs.readFileSync(__dirname + '/../../../assets/test/big_world.gwm', 'utf8');

        const services = setup(worldMapStr);

        const worldMapToRoomMapConverter = new WorldMapToRoomMapConverter(services.configService, 'W', '-');
        const actualConvertedWorldMapStr = worldMapToRoomMapConverter.convert(worldMapStr);

        const expectedConvertedWorldMap = fs.readFileSync(__dirname + '/../../../assets/test/big_world_rooms.gwm', 'utf8');
        expect(actualConvertedWorldMapStr).toEqual(expectedConvertedWorldMap);
    });
});