import { GwmWorldItem } from '../GwmWorldItem';
import { TreeIteratorGenerator } from '../gwm_world_item/iterator/TreeIteratorGenerator';
import { GwmWorldItemTransformator } from './GwmWorldItemTransformator';

type Scaling = {
    x: number,
    y: number
}

export class ScalingTransformator implements GwmWorldItemTransformator {
    private scaling: Scaling;

    constructor(scaling: Scaling = { x: 1, y: 1}) {
        this.scaling = scaling;
    }

    public transform(gwmWorldItems: GwmWorldItem[]): GwmWorldItem[] {
        return this.scaleItems(gwmWorldItems);
    }

    private scaleItems(worldItems: GwmWorldItem[]): GwmWorldItem[] {
        worldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                item.dimensions = item.dimensions = item.dimensions.scaleX(this.scaling.x).scaleY(this.scaling.y);
            }
        });

        return worldItems;
    }
}