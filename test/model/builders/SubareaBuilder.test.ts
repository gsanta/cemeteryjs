import { Point, Polygon } from '@nightshifts.inc/geometry';
import { SubareaBuilder } from '../../../src/model/builders/SubareaBuilder';
import { setup } from '../testUtils';
import { TextWorldMapReader } from '../../../src/model/readers/text/TextWorldMapReader';
import { WorldMapToSubareaMapConverter } from '../../../src/model/readers/text/WorldMapToSubareaMapConverter';

describe('SubareaParser', () => {
    it ('creates WorldItems for each subarea', () => {
        const worldMap = `
            map \`

            WWWWWWWWWW
            W---==---W
            W--=TT=--W
            W--=TT=--W
            W--------W
            W--EE====W
            WWWWWWWWWW

            \`

            definitions \`

            - = room
            I = window BORDER
            D = door BORDER
            W = wall BORDER
            T = table
            E = bed
            = = _subarea

            \`
        `;

        const services = setup(worldMap);
        const subareaParser = new SubareaBuilder(services, new TextWorldMapReader(services.configService), new WorldMapToSubareaMapConverter(services.configService));

        const worldItems = subareaParser.parse(worldMap);

        expect(worldItems).toContainWorldItem({
            id: '_subarea-1',
            name: '_subarea',
            dimensions: new Polygon([
                new Point(4, 1),
                new Point(3, 2),
                new Point(3, 4),
                new Point(7, 4),
                new Point(7, 2),
                new Point(6, 2),
                new Point(6, 1)
            ])
        });
        expect(worldItems).toContainWorldItem({id: '_subarea-2', name: '_subarea', dimensions: Polygon.createRectangle(3, 5, 6, 1)});
    });
});