import { ScaleModifier } from '../../../src/model/modifiers/ScaleModifier';
import { setup } from '../testUtils';

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

    W = wall BORDER
    D = door BORDER
    I = window BORDER
    - = room
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
    const geometryService = services.geometryService;

    let worldItems = services.importerService.import(map, []);

    const table = worldItems.find(item => item.name === 'table');
    const door = worldItems.find(item => item.name === 'door');
    const room = worldItems.find(item => item.name === 'room');

    
    expect(table).toHaveDimensions(services.geometryService.factory.rectangle(2, 2, 3, 2));
    expect(door).toHaveDimensions(geometryService.factory.edge(geometryService.factory.point(1, 0.5), geometryService.factory.point(4, 0.5)));
    expect(room).toHaveDimensions(services.geometryService.factory.rectangle(1, 1, 6, 3));
    
    new ScaleModifier(services).apply(worldItems)

    expect(table).toHaveDimensions(services.geometryService.factory.rectangle(4, 4, 6, 4));
    expect(door).toHaveDimensions(geometryService.factory.edge(geometryService.factory.point(2, 1), geometryService.factory.point(8, 1)));
    expect(room).toHaveDimensions(services.geometryService.factory.rectangle(2, 2, 12, 6));
});