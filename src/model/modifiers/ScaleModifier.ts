import { GameObject } from '../types/GameObject';
import { WorldGeneratorServices } from '../services/WorldGeneratorServices';
import { TreeIteratorGenerator } from '../utils/TreeIteratorGenerator';
import { Modifier } from './Modifier';
import { Point } from '../../geometry/shapes/Point';


/**
 * Scales the dimensions of every `WorldItem` by the given amount in the x and y direction.
 */
export class ScaleModifier implements Modifier {
    static modName = 'scale';
    dependencies = [];

    private services: WorldGeneratorServices;

    constructor(services: WorldGeneratorServices) {
        this.services = services;
    }

    getName(): string {
        return ScaleModifier.modName;
    }

    apply(gwmWorldItems: GameObject[]): GameObject[] {
        return this.scaleItems(gwmWorldItems);
    }

    private scaleItems(worldItems: GameObject[]): GameObject[] {
        worldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                item.dimensions = item.dimensions = item.dimensions.scale(new Point(this.services.gameAssetStore.globalConfig.scale.x, this.services.gameAssetStore.globalConfig.scale.y));
            }
        });

        return worldItems;
    }
}