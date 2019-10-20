import { ServiceFacade } from "../../../src/model/services/ServiceFacade";
import { setup } from "../../test_utils/testUtils";
import { SegmentBordersModifier } from "../../../src/model/modifiers/SegmentBordersModifier";
import { ScaleModifier } from "../../../src/model/modifiers/ScaleModifier";
import { Polygon } from "@nightshifts.inc/geometry";
import { SegmentBordersModifierNew } from '../../../src/model/modifiers/SegmentBordersModifierNew';


it ('segments the walls into smaller pieces so that no wall will cover more then one room', () => {
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
    D = door BORDER
    I = window BORDER
    - = room

    \`

    globals \`

        scale 1 1

    \`
    `;

    let services: ServiceFacade<any, any, any> = setup(map);

    const items = services.importerService.import(
        map,
        [
            SegmentBordersModifierNew.modName,
            // ScaleModifier.modName
        ]
    );

});