import { MeshObject } from '../../game/models/objects/MeshObject';
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

    apply(worldItems: MeshObject[]): MeshObject[] {
        worldItems.forEach(item => {
            this.scaleGameObject(item);
        });

        return worldItems;
    }

    private scaleGameObject(gameObject: MeshObject) {
        gameObject.scale *= this.globalScale;
    }
}