import { ScaleModifier } from '../../../../src/model/modifiers/ScaleModifier';
import { setup } from '../../../testUtils';
import { FileFormat } from '../../../../src/WorldGenerator';

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

    W = wall ROLES [BORDER]
    D = door ROLES [BORDER]
    I = window ROLES [BORDER]
    - = room ROLES [CONTAINER]
    E = bed
    T = table
    = = _subarea ROLES [CONTAINER]
    H = chair

    \`

    globals \`

        scale 2 2

    \`
`
    const services = setup(map, FileFormat.TEXT);
    const geometryService = services.geometryService;

    let worldItems = services.worldItemBuilderService.build(map);

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