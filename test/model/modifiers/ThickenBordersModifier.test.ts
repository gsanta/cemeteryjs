import { SegmentBordersModifier } from "../../../src/model/modifiers/SegmentBordersModifier";
import { ServiceFacade } from "../../../src/model/services/ServiceFacade";
import { setup } from "../testUtils";
import { FileFormat } from "../../../src/WorldGenerator";


function createMap(worldMap: string) {
    return `
        map \`

        ${worldMap}

        \`

        definitions \`

        W = wall ROLES [BORDER]
        D = door ROLES [BORDER]
        - = room

        \`
    `;
}

describe('ThickenBordersModifier', () => {

    it ('gives thickness to the walls which were represented as a line segment', () => {

        const map = createMap(
            `
            WDDWWWWW
            W------W
            W------W
            WWWWWWWW
            `
        )

        let services: ServiceFacade<any, any, any> = setup(map, FileFormat.TEXT);

        const items = services.importerService.import(
            map,
            [
                SegmentBordersModifier.modName
            ]
        );
    });
});
