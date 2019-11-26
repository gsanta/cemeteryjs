import { AssignBordersToRoomsModifier } from '../../../src/model/modifiers/AssignBordersToRoomsModifier';
import { SegmentBordersModifier } from '../../../src/model/modifiers/SegmentBordersModifier';
import { setup } from '../testUtils';
import { FileFormat } from '../../../src/WorldGenerator';

it ('Add the correct borders to a single room', () => {
    const map = `
        map \`

        WWWWWWWWWW
        W--------W
        W--------W
        W--------W
        WWWWWWWWWW

        \`

        definitions \`

        - = room
        W = wall ROLES [BORDER]

        \`
    `;

    const services = setup(map, FileFormat.TEXT);

    let items = services.importerService.import(map, []);

    const [wall1, wall2, wall3, wall4, room] =  new AssignBordersToRoomsModifier(services).apply(items);

    expect(room.borderItems).toHaveAnyWithDimensions(wall1.dimensions);
    expect(room.borderItems).toHaveAnyWithDimensions(wall2.dimensions);
    expect(room.borderItems).toHaveAnyWithDimensions(wall3.dimensions);
    expect(room.borderItems).toHaveAnyWithDimensions(wall4.dimensions);
});

it ('Add the correct borders to rooms with multiple roomw', () => {
    const map = `
        map \`

        WWWWWWWWWW
        W---W----W
        W---W----W
        W---W----W
        WWWWWWWWWW
        W--------W
        W--------W
        W--------W
        WWWWWWWWWW

        \`

        definitions \`

        - = room
        W = wall ROLES [BORDER]

        \`
    `;

    const services = setup(map, FileFormat.TEXT);
    const geometryService = services.geometryService;

    let items = services.importerService.import(map, [SegmentBordersModifier.modName]);

    items = new AssignBordersToRoomsModifier(services).apply(items);

    const rooms = items.filter(item => item.name === 'room');

    const room1 = rooms.find(item => item.dimensions.equalTo(services.geometryService.factory.rectangle(1, 1, 3, 3)));

    expect(room1.borderItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(0.5, 0.5), geometryService.factory.point(0.5, 4.5)));
    expect(room1.borderItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(0.5, 4.5), geometryService.factory.point(4.5, 4.5)));
    expect(room1.borderItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(4.5, 0.5), geometryService.factory.point(4.5, 4.5)));
    expect(room1.borderItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(0.5, 0.5), geometryService.factory.point(4.5, 0.5)));


    const room2 = rooms.find(item => item.dimensions.equalTo(services.geometryService.factory.rectangle(5, 1, 4, 3)));

    expect(room2.borderItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(4.5, 0.5), geometryService.factory.point(4.5, 4.5)));
    expect(room2.borderItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(4.5, 4.5), geometryService.factory.point(9.5, 4.5)));
    expect(room2.borderItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(9.5, 0.5), geometryService.factory.point(9.5, 4.5)));
    expect(room2.borderItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(4.5, 0.5), geometryService.factory.point(9.5, 0.5)));


    const room3 = rooms.find(item => item.dimensions.equalTo(services.geometryService.factory.rectangle(1, 5, 8, 3)));

    expect(room3.borderItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(0.5, 4.5), geometryService.factory.point(0.5, 8.5)));
    expect(room3.borderItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(0.5, 8.5), geometryService.factory.point(9.5, 8.5)));
    expect(room3.borderItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(9.5, 4.5), geometryService.factory.point(9.5, 8.5)));
    expect(room3.borderItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(0.5, 4.5), geometryService.factory.point(4.5, 4.5)));
    expect(room3.borderItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(4.5, 4.5), geometryService.factory.point(9.5, 4.5)));
});