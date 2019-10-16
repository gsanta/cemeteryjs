import { Polygon, Shape } from "@nightshifts.inc/geometry";
import { BorderParser } from '../../../src/model/parsers/BorderParser';
import { WorldItemFactoryService } from '../../../src/model/services/WorldItemFactoryService';
import { WorldItem } from '../../../src/WorldItem';
import { ConfigService } from '../../../src/model/services/ConfigService';

// TODO: create custom matcher
export function hasAnyWorldItemInfoDimension(dimension: Shape, worldItemInfos: WorldItem[]) {
    if (worldItemInfos.find(worldItemInfo => worldItemInfo.dimensions.equalTo(dimension))) {
        return true;
    } else {
        throw new Error(`${dimension.toString()} does not exist`);
    }
}

describe('BorderParser', () => {
    describe('generate', () => {
        it ('sepearates the walls into vertical and horizontal `WorldItemInfo`s.', () => {
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

            const configService = new ConfigService().update(worldMap);
            const roomSeparatorParser = new BorderParser(new WorldItemFactoryService(), configService);


            const worldItems = roomSeparatorParser.parse(worldMap);
            expect(worldItems.length).toEqual(5);
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(0, 0, 1, 5), worldItems)).toBeTruthy();
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(9, 0, 1, 5), worldItems)).toBeTruthy();
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(17, 0, 1, 5), worldItems)).toBeTruthy();
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(0, 0, 18, 1), worldItems)).toBeTruthy();
            expect(hasAnyWorldItemInfoDimension(Polygon.createRectangle(0, 4, 18, 1), worldItems)).toBeTruthy();
        });

        it ('creates separate `WorldItemInfo`s for different type of border items.', () => {
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

            const configService = new ConfigService().update(worldMap);
            const borderParser = new BorderParser(new WorldItemFactoryService(), configService);


            const worldItems = borderParser.parse(worldMap);
            expect(worldItems.length).toEqual(4);
            expect(worldItems[0].dimensions.equalTo(Polygon.createRectangle(0, 0, 2, 1))).toBeTruthy();
            expect(worldItems[1].dimensions.equalTo(Polygon.createRectangle(6, 0, 4, 1))).toBeTruthy();
            expect(worldItems[2].dimensions.equalTo(Polygon.createRectangle(2, 0, 4, 1))).toBeTruthy()
            expect(worldItems[3].dimensions.equalTo(Polygon.createRectangle(9, 1, 1, 2))).toBeTruthy()
        });
    });
});