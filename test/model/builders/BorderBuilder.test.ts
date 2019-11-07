import { BorderBuilder } from '../../../src/model/builders/BorderBuilder';
import { setup } from '../testUtils';
import { Format } from '../../../src/model/builders/WorldItemBuilder';
import { TextWorldMapReader } from '../../../src/model/readers/text/TextWorldMapReader';


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
        W = wall BORDER

        \`
    `;

    const services = setup(worldMap);
    const geometryService = services.geometryService;
    const roomSeparatorParser = new BorderBuilder(services, new TextWorldMapReader(services.configService));


    const worldItems = roomSeparatorParser.parse(worldMap, Format.TEXT);
    expect(worldItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(0.5, 3.5), geometryService.factory.point(9.5, 3.5)));
    expect(worldItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(0.5, 0.5), geometryService.factory.point(9.5, 0.5)));
    expect(worldItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(9.5, 0.5), geometryService.factory.point(9.5, 3.5)));
    expect(worldItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(4.5, 0.5), geometryService.factory.point(4.5, 3.5)));
    expect(worldItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(0.5, 0.5), geometryService.factory.point(0.5, 3.5)));
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
        W = wall BORDER
        D = door BORDER
        I = window BORDER

        \`
    `;

    const services = setup(worldMap);
    const geometryService = services.geometryService;
    const roomSeparatorParser = new BorderBuilder(services, new TextWorldMapReader(services.configService));


    const worldItems = roomSeparatorParser.parse(worldMap, Format.TEXT);
    expect(worldItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(0.5, 0.5), geometryService.factory.point(8, 0.5)));
    expect(worldItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(4, 3.5), geometryService.factory.point(9.5, 3.5)));
    expect(worldItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(9.5, 0.5), geometryService.factory.point(9.5, 3.5)));
    expect(worldItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(4.5, 0.5), geometryService.factory.point(4.5, 3.5)));
    expect(worldItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(0.5, 0.5), geometryService.factory.point(0.5, 3.5)));
    expect(worldItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(2, 3.5), geometryService.factory.point(4, 3.5)));
    expect(worldItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(0.5, 3.5), geometryService.factory.point(2, 3.5)));
    expect(worldItems).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(8, 0.5), geometryService.factory.point(9, 0.5)));
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
        W = wall BORDER

        \`
    `;

    const services = setup(worldMap);
    const geometryService = services.geometryService;
    const roomSeparatorParser = new BorderBuilder(services, new TextWorldMapReader(services.configService));


    const borders = roomSeparatorParser.parse(worldMap, Format.TEXT);

    expect(borders).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(0.5, 6.5), geometryService.factory.point(9.5, 6.5)));
    expect(borders).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(0.5, 3.5), geometryService.factory.point(9.5, 3.5)));
    expect(borders).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(0.5, 0.5), geometryService.factory.point(9.5, 0.5)));
    expect(borders).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(9.5, 0.5), geometryService.factory.point(9.5, 6.5)));
    expect(borders).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(0.5, 0.5), geometryService.factory.point(0.5, 6.5)));
    expect(borders).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(4.5, 0.5), geometryService.factory.point(4.5, 3.5)));
});