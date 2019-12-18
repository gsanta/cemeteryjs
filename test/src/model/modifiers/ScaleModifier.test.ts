import { ScaleModifier } from '../../../../src/model/modifiers/ScaleModifier';
import { setup } from '../../../testUtils';
import { FileFormat } from '../../../../src/WorldGenerator';
import { Polygon } from '../../../../src/geometry/shapes/Polygon';
import { Segment } from '../../../../src/geometry/shapes/Segment';
import { Point } from '../../../../src/geometry/shapes/Point';

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

    let worldItems = services.gameObjectBuilder.build(map);

    const table = worldItems.find(item => item.name === 'table');
    const door = worldItems.find(item => item.name === 'door');
    const room = worldItems.find(item => item.name === 'room');

    
    expect(table).toHaveDimensions(Polygon.createRectangle(2, 2, 3, 2));
    expect(door).toHaveDimensions(new Segment(new Point(1, 0.5), new Point(4, 0.5)));
    expect(room).toHaveDimensions(Polygon.createRectangle(1, 1, 6, 3));
    
    new ScaleModifier(services).apply(worldItems)

    expect(table).toHaveDimensions(Polygon.createRectangle(4, 4, 6, 4));
    expect(door).toHaveDimensions(new Segment(new Point(2, 1), new Point(8, 1)));
    expect(room).toHaveDimensions(Polygon.createRectangle(2, 2, 12, 6));
});