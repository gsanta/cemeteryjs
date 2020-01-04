import { GameObject } from '../services/GameObject';
import { TreeIteratorGenerator } from '../utils/TreeIteratorGenerator';
import { Modifier } from './Modifier';

export class ScaleModifier implements Modifier {
    static modName = 'scale';
    dependencies = [];

    private globalScale: number;

    constructor(globalScale: number = 1) {
        this.globalScale = globalScale;
    }

    getName(): string {
        return ScaleModifier.modName;
    }

    apply(worldItems: GameObject[]): GameObject[] {
        worldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                this.scaleGameObject(item);
            }
        });

        return worldItems;
    }

    private scaleGameObject(gameObject: GameObject) {
        gameObject.scale *= this.globalScale;
    }
}