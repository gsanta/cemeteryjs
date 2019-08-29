
import { Segment } from "@nightshifts.inc/geometry";
import { WorldItem } from "../WorldItemInfo";
import { Modifier } from "./Modifier";


export class ThickenBordersModifier implements Modifier {
    static modName = 'thickenBorders';

    getName(): string {
        return ThickenBordersModifier.name;
    }

    apply(rootItems: WorldItem[]): WorldItem[] {
        rootItems[0].children
            .filter(child => child.isBorder)
            .forEach(wall => this.thickenWall(wall));

        return rootItems;
    }

    private thickenWall(wall: WorldItem) {
        if (!(wall.dimensions instanceof Segment)) {
            throw new Error('Thickening is supported only for segments.');
        }

        wall.thickness = 0.25;
    }

}