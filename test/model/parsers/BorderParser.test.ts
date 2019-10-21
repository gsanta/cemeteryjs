import { BorderParser } from '../../../src/model/parsers/BorderParser';
import { setup } from '../../test_utils/testUtils';


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
    const roomSeparatorParser = new BorderParser(services);


    const worldItems = roomSeparatorParser.parse(worldMap);
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
    const roomSeparatorParser = new BorderParser(services);


    const worldItems = roomSeparatorParser.parse(worldMap);
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
    const roomSeparatorParser = new BorderParser(services);


    const borders = roomSeparatorParser.parse(worldMap);

    expect(borders).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(0.5, 6.5), geometryService.factory.point(9.5, 6.5)));
    expect(borders).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(0.5, 3.5), geometryService.factory.point(9.5, 3.5)));
    expect(borders).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(0.5, 0.5), geometryService.factory.point(9.5, 0.5)));
    expect(borders).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(9.5, 0.5), geometryService.factory.point(9.5, 6.5)));
    expect(borders).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(0.5, 0.5), geometryService.factory.point(0.5, 6.5)));
    expect(borders).toHaveAnyWithDimensions(geometryService.factory.edge(geometryService.factory.point(4.5, 0.5), geometryService.factory.point(4.5, 3.5)));
});