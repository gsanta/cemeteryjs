import { WorldItemInfo } from '../WorldItemInfo';
import { TreeIteratorGenerator } from '../utils/TreeIteratorGenerator';
import { WorldItemTransformator } from '../transformators/WorldItemTransformator';
import { Point } from '@nightshifts.inc/geometry';

type Scaling = {
    x: number,
    y: number
}

/**
 * Scales the dimensions of every `WorldItemInfo` by the given amount in the x and y direction.
 */
export class ScaleModifier implements WorldItemTransformator {
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