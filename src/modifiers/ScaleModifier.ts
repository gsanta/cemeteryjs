import { WorldItem } from '../WorldItemInfo';
import { TreeIteratorGenerator } from '../utils/TreeIteratorGenerator';
import { Modifier } from './Modifier';
import { Point } from '@nightshifts.inc/geometry';
import { Scaling, ConfigService } from '../services/ConfigService';


/**
 * Scales the dimensions of every `WorldItemInfo` by the given amount in the x and y direction.
 */
export class ScaleModifier implements Modifier {
    static modName = 'scale';
    dependencies = [];

    private configService: ConfigService;

    constructor(configService: ConfigService) {
        this.configService = configService;
    }

    getName(): string {
        return ScaleModifier.modName;
    }

    apply(gwmWorldItems: WorldItem[]): WorldItem[] {
        return this.scaleItems(gwmWorldItems);
    }

    private scaleItems(worldItems: WorldItem[]): WorldItem[] {
        worldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                item.dimensions = item.dimensions = item.dimensions.scale(new Point(this.configService.scaling.x, this.configService.scaling.y));
            }
        });

        return worldItems;
    }
}