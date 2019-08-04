import { WorldItemInfo } from "../WorldItemInfo";
import { MeshFactory } from '../integrations/babylonjs/MeshFactory';
import { TreeIteratorGenerator } from "../utils/TreeIteratorGenerator";

export class MeshCreationTransformator {
    private meshFactory: MeshFactory;

    constructor(meshFactory: MeshFactory) {
        this.meshFactory = meshFactory;
    }

    public transform(worldItems: WorldItemInfo[]): WorldItemInfo[] {
        worldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                item.mesh = this.meshFactory.getInstance(item);
            }
        });

        return worldItems;
    }
}