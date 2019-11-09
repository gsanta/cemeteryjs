import { Segment } from "@nightshifts.inc/geometry";
import { SegmentBordersModifier } from '../../../src/model/modifiers/SegmentBordersModifier';
import { ServiceFacade } from "../../../src/model/services/ServiceFacade";
import { setup } from "../testUtils";
import { FileFormat } from "../../../src/WorldGenerator";


it ('Segment a vertical wall where it intersects with the horizontal walls', () => {
    const map = `
    map \`

    WWWWWWWWWW
    W--------W
    W--------W
    WWWWWWWWWW
    W--------W
    W--------W
    WWWWWWWWWW

    \`

    definitions \`

    W = wall BORDER
    - = room

    \`

    globals \`

        scale 1 1

    \`
    `;

    let services: ServiceFacade<any, any, any> = setup(map, FileFormat.TEXT);
    let geometryService = services.geometryService;

    const worldItems = services.importerService.import(
        map,
        [
            SegmentBordersModifier.modName,
        ]
    );
    expect(worldItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(0.5, 6.5), geometryService.factory.point(9.5, 6.5)));
    expect(worldItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(0.5, 3.5), geometryService.factory.point(9.5, 3.5)));
    expect(worldItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(0.5, 0.5), geometryService.factory.point(9.5, 0.5)));
    expect(worldItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(0.5, 0.5), geometryService.factory.point(0.5, 3.5)));
    expect(worldItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(0.5, 3.5), geometryService.factory.point(0.5, 6.5)));
    expect(worldItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(9.5, 0.5), geometryService.factory.point(9.5, 3.5)));
    expect(worldItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(9.5, 3.5), geometryService.factory.point(9.5, 6.5)));
});

it ('Segment a horizontal wall where it intersects with the vertical walls', () => {
    const map = `
    map \`


    W--------W------------------------------W--------W
    W--------W------------------------------W--------W
    WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
    W-------------------W----------------------------W
    W-------------------W----------------------------W

    \`

    definitions \`

    W = wall BORDER
    - = room

    \`

    globals \`

        scale 1 1

    \`
    `;

    let services: ServiceFacade<any, any, any> = setup(map, FileFormat.TEXT);
    let geometryService = services.geometryService;

    let worldItems = services.importerService.import(map,[]);

    let horizontalWalls = worldItems.filter(item => item.name === 'wall').filter(wall => (<Segment> wall.dimensions).getLine().isHorizontal());

    expect(horizontalWalls.length).toEqual(1);

    worldItems = new SegmentBordersModifier(services).apply(worldItems);

    horizontalWalls = worldItems.filter(item => item.name === 'wall').filter(wall => (<Segment> wall.dimensions).getLine().isHorizontal());

    expect(horizontalWalls.length).toEqual(4);
    expect(worldItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(0.5, 2.5), geometryService.factory.point(9.5, 2.5)));
    expect(worldItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(9.5, 2.5), geometryService.factory.point(20.5, 2.5)));
    expect(worldItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(20.5, 2.5), geometryService.factory.point(40.5, 2.5)));
    expect(worldItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(40.5, 2.5), geometryService.factory.point(49.5, 2.5)));
});

it ('does not add the bordering WorldItem if it only touches the room at it\'s edge', () => {
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
        W = wall BORDER

        \`
    `;

    const services = setup(map, FileFormat.TEXT);

    let items = services.importerService.import(map, []);

    items = new SegmentBordersModifier(services).apply(items);
    1
});