import { GameObject } from '../services/GameObject';
import { WorldGeneratorServices } from '../services/WorldGeneratorServices';
import { TreeIteratorGenerator } from '../utils/TreeIteratorGenerator';
import { Modifier } from './Modifier';
import { Point } from '../../model/geometry/shapes/Point';


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
                item.dimensions  = item.dimensions.scale(new Point(2, 2));
            }
        });

        return worldItems;
    }
}