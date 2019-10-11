import { ScaleModifier } from '../../../src/model/modifiers/ScaleModifier';
import { WorldItem } from '../../../src/WorldItem';
import { Polygon } from '@nightshifts.inc/geometry';
import { ConfigService } from '../../../src/model/services/ConfigService';
import { setupMap, setup } from '../../test_utils/testUtils';

it ('Scale the items', () => {
    const map = `
    map \`

    WDDDWWWW
    W------W
    W-TTT--W
    W-TTT--W
    WWWWWWWW

    \`

    definitions \`

    W = wall
    D = door
    I = window
    - = empty
    E = bed
    T = table
    = = _subarea
    H = chair

    \`

    globals \`

        scale 2 2

    \`
`
    const services = setup(map);

    const worldItems = services.importerService.import(
        map,
        []
    );

    const table = worldItems.find(item => item.name === 'table');
    const door = worldItems.find(item => item.name === 'door');
    const room = worldItems.find(item => item.name === 'room');

    const scalingWorldItemGenerator = new ScaleModifier(services);

    expect(table).toHaveDimensions(services.geometryService.factory.rectangle(2, 2, 3, 2));
    expect(door).toHaveDimensions(services.geometryService.factory.rectangle(1, 0, 3, 1));
    expect(room).toHaveDimensions(services.geometryService.factory.rectangle(0, 0, 8, 5));

    scalingWorldItemGenerator.apply(worldItems);

    expect(table).toHaveDimensions(services.geometryService.factory.rectangle(4, 4, 6, 4));
    expect(door).toHaveDimensions(services.geometryService.factory.rectangle(2, 0, 6, 2));
    expect(room).toHaveDimensions(services.geometryService.factory.rectangle(0, 0, 16, 10));
});