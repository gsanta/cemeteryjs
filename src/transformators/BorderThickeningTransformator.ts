
import { WorldItemTransformator } from "./WorldItemTransformator";
import { WorldItemInfo } from "../WorldItemInfo";
import { GeometryUtils, Segment } from "@nightshifts.inc/geometry";


export class BorderThickeningTransformator implements WorldItemTransformator {

    public transform(rootItems: WorldItemInfo[]): WorldItemInfo[] {
        rootItems[0].children
            .filter(child => child.name === 'wall')
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