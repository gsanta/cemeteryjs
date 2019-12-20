import { SegmentBordersModifier } from '../../../../src/world_generator/modifiers/SegmentBordersModifier';
import { WorldGeneratorServices } from "../../../../src/world_generator/services/WorldGeneratorServices";
import { setup } from "../../../testUtils";
import { FileFormat } from "../../../../src/WorldGenerator";
import { Segment } from '../../../../src/model/geometry/shapes/Segment';
import { Point } from '../../../../src/model/geometry/shapes/Point';


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

    W = wall ROLES [BORDER]
    - = room

    \`

    globals \`

        scale 1 1

    \`
    `;

    let services: WorldGeneratorServices = setup(map, FileFormat.TEXT);

    let worldItems = services.gameObjectBuilder.build(map);
    worldItems = services.modifierExecutor.applyModifiers(worldItems, [ SegmentBordersModifier.modName ]);

    expect(worldItems).toHaveAnyWithDimensions(new Segment(new Point(0.5, 6.5), new Point(9.5, 6.5)));
    expect(worldItems).toHaveAnyWithDimensions(new Segment(new Point(0.5, 3.5), new Point(9.5, 3.5)));
    expect(worldItems).toHaveAnyWithDimensions(new Segment(new Point(0.5, 0.5), new Point(9.5, 0.5)));
    expect(worldItems).toHaveAnyWithDimensions(new Segment(new Point(0.5, 0.5), new Point(0.5, 3.5)));
    expect(worldItems).toHaveAnyWithDimensions(new Segment(new Point(0.5, 3.5), new Point(0.5, 6.5)));
    expect(worldItems).toHaveAnyWithDimensions(new Segment(new Point(9.5, 0.5), new Point(9.5, 3.5)));
    expect(worldItems).toHaveAnyWithDimensions(new Segment(new Point(9.5, 3.5), new Point(9.5, 6.5)));
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

    W = wall ROLES [BORDER]
    - = room

    \`

    globals \`

        scale 1 1

    \`
    `;

    let services: WorldGeneratorServices = setup(map, FileFormat.TEXT);

    let worldItems = services.gameObjectBuilder.build(map);

    let horizontalWalls = worldItems.filter(item => item.name === 'wall').filter(wall => (<Segment> wall.dimensions).getLine().isHorizontal());

    expect(horizontalWalls.length).toEqual(1);

    worldItems = new SegmentBordersModifier(services).apply(worldItems);

    horizontalWalls = worldItems.filter(item => item.name === 'wall').filter(wall => (<Segment> wall.dimensions).getLine().isHorizontal());

    expect(horizontalWalls.length).toEqual(4);
    expect(worldItems).toHaveAnyWithDimensions(new Segment(new Point(0.5, 2.5), new Point(9.5, 2.5)));
    expect(worldItems).toHaveAnyWithDimensions(new Segment(new Point(9.5, 2.5), new Point(20.5, 2.5)));
    expect(worldItems).toHaveAnyWithDimensions(new Segment(new Point(20.5, 2.5), new Point(40.5, 2.5)));
    expect(worldItems).toHaveAnyWithDimensions(new Segment(new Point(40.5, 2.5), new Point(49.5, 2.5)));
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
        W = wall ROLES [BORDER]

        \`
    `;

    const services = setup(map, FileFormat.TEXT);

    let items = services.gameObjectBuilder.build(map);
    
    items = new SegmentBordersModifier(services).apply(items);
    1
});