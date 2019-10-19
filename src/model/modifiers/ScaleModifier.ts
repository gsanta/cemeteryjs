import { Point } from '@nightshifts.inc/geometry';
import { WorldItem } from '../../WorldItem';
import { ServiceFacade } from '../services/ServiceFacade';
import { TreeIteratorGenerator } from '../utils/TreeIteratorGenerator';
import { Modifier } from './Modifier';


/**
 * Scales the dimensions of every `WorldItem` by the given amount in the x and y direction.
 */
export class ScaleModifier implements Modifier {
    static modName = 'scale';
    dependencies = [];

    private services: ServiceFacade<any, any, any>;

    constructor(services: ServiceFacade<any, any, any>) {
        this.services = services;
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
                item.dimensions = item.dimensions = item.dimensions.scale(new Point(this.services.configService.globalConfig.scale.x, this.services.configService.globalConfig.scale.y));
            }
        });

        return worldItems;
    }
}