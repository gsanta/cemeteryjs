import { WorldItemInfo } from '../../../../WorldItemInfo';
import { Point, Shape } from '@nightshifts.inc/geometry';


export class WorldItemBoundingBoxCalculator {
    public getBoundingBox(worldItemInfo: WorldItemInfo): Shape {
        return this.moveToWorldCenter(worldItemInfo);
    }


    private moveToWorldCenter(worldItemInfo: WorldItemInfo): Shape {

        const translateX = - (worldItemInfo.dimensions.getBoundingInfo().extent[0] / 2);
        const translateY = - (worldItemInfo.dimensions.getBoundingInfo().extent[1] / 2);

        return worldItemInfo.dimensions.translate(new Point(translateX, translateY));
    }
}
