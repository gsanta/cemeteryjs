import { SubareaBuilder } from '../../../../../src/world_generator/importers/builders/SubareaBuilder';
import { setup } from '../../../../testUtils';
import { TextWorldMapReader } from '../../../../../src/world_generator/importers/text/TextWorldMapReader';
import { WorldMapToSubareaMapConverter } from '../../../../../src/world_generator/importers/text/WorldMapToSubareaMapConverter';
import { FileFormat } from '../../../../../src/WorldGenerator';
import { Polygon } from '../../../../../src/model/geometry/shapes/Polygon';
import { Point } from '../../../../../src/model/geometry/shapes/Point';

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

            - = room ROLES [CONTAINER]
            I = window ROLES [BORDER]
            D = door ROLES [BORDER]
            W = wall ROLES [BORDER]
            T = table
            E = bed
            = = _subarea ROLES [CONTAINER]

            \`
        `;

        const services = setup(worldMap, FileFormat.TEXT);
        const subareaParser = new SubareaBuilder(services, new TextWorldMapReader(services), new WorldMapToSubareaMapConverter());

        const worldItems = subareaParser.build(worldMap);

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