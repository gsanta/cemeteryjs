import { BorderBuilder } from '../../../../src/model/builders/BorderBuilder';
import { TextWorldMapReader } from '../../../../src/model/readers/text/TextWorldMapReader';
import { setup } from '../../../testUtils';
import { FileFormat } from '../../../../src/WorldGenerator';
import { Segment, Point } from '@nightshifts.inc/geometry';


it ('Create separate items for every vertical/horizontal slices of walls', () => {
    const worldMap = `
        map \`

        WWWWWWWWWW
        W---W----W
        W---W----W
        WWWWWWWWWW

        \`

        definitions \`

        - = room
        W = wall ROLES [BORDER]

        \`
    `;

    const services = setup(worldMap, FileFormat.TEXT);
    const geometryService = services.geometryService;
    const roomSeparatorParser = new BorderBuilder(services, new TextWorldMapReader(services));


    const worldItems = roomSeparatorParser.parse(worldMap);
    expect(worldItems).toHaveAnyWithDimensions(new Segment(new Point(0.5, 3.5), new Point(9.5, 3.5)));
    expect(worldItems).toHaveAnyWithDimensions(new Segment(new Point(0.5, 0.5), new Point(9.5, 0.5)));
    expect(worldItems).toHaveAnyWithDimensions(new Segment(new Point(9.5, 0.5), new Point(9.5, 3.5)));
    expect(worldItems).toHaveAnyWithDimensions(new Segment(new Point(4.5, 0.5), new Point(4.5, 3.5)));
    expect(worldItems).toHaveAnyWithDimensions(new Segment(new Point(0.5, 0.5), new Point(0.5, 3.5)));
});

it ('Create separate items for different types (represented by different characters) of walls', () => {
    const worldMap = `
        map \`

        WWWWWWWWDW
        W---W----W
        W---W----W
        WWIIWWWWWW

        \`

        definitions \`

        - = room
        W = wall ROLES [BORDER]
        D = door ROLES [BORDER]
        I = window ROLES [BORDER]

        \`
    `;

    const services = setup(worldMap, FileFormat.TEXT);
    const roomSeparatorParser = new BorderBuilder(services, new TextWorldMapReader(services));


    const worldItems = roomSeparatorParser.parse(worldMap);
    expect(worldItems).toHaveAnyWithDimensions(new Segment(new Point(0.5, 0.5), new Point(8, 0.5)));
    expect(worldItems).toHaveAnyWithDimensions(new Segment(new Point(4, 3.5), new Point(9.5, 3.5)));
    expect(worldItems).toHaveAnyWithDimensions(new Segment(new Point(9.5, 0.5), new Point(9.5, 3.5)));
    expect(worldItems).toHaveAnyWithDimensions(new Segment(new Point(4.5, 0.5), new Point(4.5, 3.5)));
    expect(worldItems).toHaveAnyWithDimensions(new Segment(new Point(0.5, 0.5), new Point(0.5, 3.5)));
    expect(worldItems).toHaveAnyWithDimensions(new Segment(new Point(2, 3.5), new Point(4, 3.5)));
    expect(worldItems).toHaveAnyWithDimensions(new Segment(new Point(0.5, 3.5), new Point(2, 3.5)));
    expect(worldItems).toHaveAnyWithDimensions(new Segment(new Point(8, 0.5), new Point(9, 0.5)));
});

it ('Create separate items for every vertical/horizontal slices of walls', () => {
    const worldMap = `
        map \`

        WWWWWWWWWW
        W---W----W
        W---W----W
        WWWWWWWWWW
        W--------W
        W--------W
        WWWWWWWWWW

        \`

        definitions \`

        - = room
        W = wall ROLES [BORDER]

        \`
    `;

    const services = setup(worldMap, FileFormat.TEXT);
    const geometryService = services.geometryService;
    const roomSeparatorParser = new BorderBuilder(services, new TextWorldMapReader(services));


    const borders = roomSeparatorParser.parse(worldMap);

    expect(borders).toHaveAnyWithDimensions(new Segment(new Point(0.5, 6.5), new Point(9.5, 6.5)));
    expect(borders).toHaveAnyWithDimensions(new Segment(new Point(0.5, 3.5), new Point(9.5, 3.5)));
    expect(borders).toHaveAnyWithDimensions(new Segment(new Point(0.5, 0.5), new Point(9.5, 0.5)));
    expect(borders).toHaveAnyWithDimensions(new Segment(new Point(9.5, 0.5), new Point(9.5, 6.5)));
    expect(borders).toHaveAnyWithDimensions(new Segment(new Point(0.5, 0.5), new Point(0.5, 6.5)));
    expect(borders).toHaveAnyWithDimensions(new Segment(new Point(4.5, 0.5), new Point(4.5, 3.5)));
});