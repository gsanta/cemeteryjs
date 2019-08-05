import { WorldItemInfo } from '../../../../WorldItemInfo';
import { Point, Shape } from '@nightshifts.inc/geometry';


export class WorldItemBoundingBoxCalculator {
    public getBoundingBox(worldItemInfo: WorldItemInfo): Shape {
        return this.moveToWorldCenter(worldItemInfo);
    }

    private moveToWorldCenter(worldItemInfo: WorldItemInfo): Shape {
        const root = this.findRoot(worldItemInfo);

        const translateX = - (root.dimensions.getBoundingInfo().extent[0] / 2);
        const translateY = - (root.dimensions.getBoundingInfo().extent[1] / 2);

        return worldItemInfo.dimensions.translate(new Point(translateX, translateY));
    }

    private findRoot(worldItemInfo: WorldItemInfo) {
        let root = worldItemInfo;

        while (root.parent) {
            root = root.parent;
        }

        return root;
    }
}
