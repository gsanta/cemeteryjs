
import { Segment } from "@nightshifts.inc/geometry";
import { WorldItemInfo } from "../WorldItemInfo";
import { Modifier } from "./Modifier";


export class ThickenBordersModifier implements Modifier {

    public apply(rootItems: WorldItemInfo[]): WorldItemInfo[] {
        rootItems[0].children
            .filter(child => child.isBorder)
            .forEach(wall => this.thickenWall(wall));

        return rootItems;
    }

    private thickenWall(wall: WorldItemInfo) {
        if (!(wall.dimensions instanceof Segment)) {
            throw new Error('Thickening is supported only for segments.');
        }

        wall.thickness = 0.25;
    }

}