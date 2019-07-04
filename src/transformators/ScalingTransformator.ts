import { WorldItemInfo } from '../WorldItemInfo';
import { TreeIteratorGenerator } from '../gwm_world_item/iterator/TreeIteratorGenerator';
import { WorldItemTransformator } from './WorldItemTransformator';
import { Point } from '@nightshifts.inc/geometry';

type Scaling = {
    x: number,
    y: number
}

export class ScalingTransformator implements WorldItemTransformator {
    private scaling: Scaling;

    constructor(scaling: Scaling = { x: 1, y: 1}) {
        this.scaling = scaling;
    }

    public transform(gwmWorldItems: WorldItemInfo[]): WorldItemInfo[] {
        return this.scaleItems(gwmWorldItems);
    }

    private scaleItems(worldItems: WorldItemInfo[]): WorldItemInfo[] {
        worldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                item.dimensions = item.dimensions = item.dimensions.scale(new Point(this.scaling.x, this.scaling.y));
            }
        });

        return worldItems;
    }
}