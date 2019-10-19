import { Polygon, Shape } from "@nightshifts.inc/geometry";
import { BorderParser } from '../../../src/model/parsers/BorderParser';
import { WorldItemFactoryService } from '../../../src/model/services/WorldItemFactoryService';
import { WorldItem } from '../../../src/WorldItem';
import { ConfigService } from '../../../src/model/services/ConfigService';
import { setup } from '../../test_utils/testUtils';

// TODO: create custom matcher
export function hasAnyWorldItemInfoDimension(dimension: Shape, worldItemInfos: WorldItem[]) {
    if (worldItemInfos.find(worldItemInfo => worldItemInfo.dimensions.equalTo(dimension))) {
        return true;
    } else {
        throw new Error(`${dimension.toString()} does not exist`);
    }
}

it ('Create separate items for every vertical/horizontal slices of walls', () => {
    const worldMap = `
        map \`

        WWWWWWWWWWWWWWWWWW
        W--------W-------W
        W--------W-------W
        W--------W-------W
        WWWWWWWWWWWWWWWWWW

        \`

        definitions \`

        - = room
        W = wall BORDER
        D = door BORDER
        I = window BORDER

        \`
    `;

    const services = setup(worldMap);
    const roomSeparatorParser = new BorderParser(services);


    const worldItems = roomSeparatorParser.parse(worldMap);
    expect(worldItems.length).toEqual(5);
    expect(worldItems).toHaveAnyWithDimensions(Polygon.createRectangle(0, 0, 1, 5));
    expect(worldItems).toHaveAnyWithDimensions(Polygon.createRectangle(9, 0, 1, 5));
    expect(worldItems).toHaveAnyWithDimensions(Polygon.createRectangle(17, 0, 1, 5));
    expect(worldItems).toHaveAnyWithDimensions(Polygon.createRectangle(0, 0, 18, 1));
    expect(worldItems).toHaveAnyWithDimensions(Polygon.createRectangle(0, 4, 18, 1));
    expect(worldItems).toHaveAnyWithWorldMapPositions(services, [ [0, 0], [0, 1], [0, 2], [0, 3], [0, 4] ]);
    expect(worldItems).toHaveAnyWithWorldMapPositions(services, [ [9, 0], [9, 1], [9, 2], [9, 3], [9, 4] ]);
    expect(worldItems).toHaveAnyWithWorldMapPositions(services, [ [17, 0], [17, 1], [17, 2], [17, 3], [17, 4] ]);
    expect(worldItems).toHaveAnyWithWorldMapPositions(services, [
        [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0], [11, 0], [12, 0], [13, 0], [14, 0], [15, 0], [16, 0], [17, 0] ]
    );
    expect(worldItems).toHaveAnyWithWorldMapPositions(services, [
        [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4], [9, 4], [10, 4], [11, 4], [12, 4], [13, 4], [14, 4], [15, 4], [16, 4], [17, 4] ]
    );
});

it ('Create separate items for different types of borders.', () => {
    const worldMap = `
        map \`

        WWDDDDWWWW
        ---------I
        ---------I
        ----------
        ----------

        \`

        definitions \`

        - = room
        W = wall BORDER
        D = door BORDER
        I = window BORDER

        \`
    `;

    const services = setup(worldMap);
    const borderParser = new BorderParser(services);


    const worldItems = borderParser.parse(worldMap);
    expect(worldItems.length).toEqual(4);
    expect(worldItems).toHaveAnyWithDimensions(Polygon.createRectangle(0, 0, 2, 1));
    expect(worldItems).toHaveAnyWithDimensions(Polygon.createRectangle(6, 0, 4, 1));
    expect(worldItems).toHaveAnyWithDimensions(Polygon.createRectangle(2, 0, 4, 1));
    expect(worldItems).toHaveAnyWithDimensions(Polygon.createRectangle(9, 1, 1, 2));
    expect(worldItems).toHaveAnyWithWorldMapPositions(services, [[0, 0], [1, 0]]);
    expect(worldItems).toHaveAnyWithWorldMapPositions(services, [[6, 0], [7, 0], [8, 0], [9, 0]]);
    expect(worldItems).toHaveAnyWithWorldMapPositions(services, [[2, 0], [3, 0], [4, 0], [5, 0]]);
    expect(worldItems).toHaveAnyWithWorldMapPositions(services, [[9, 1], [9, 2]]);
});