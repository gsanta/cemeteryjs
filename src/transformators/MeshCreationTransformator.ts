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
                item.mesh = this.createMesh(item)
            }
        });

        return worldItems;
    }

    private createMesh(worldItemInfo: WorldItemInfo): void {
        let mesh = this.meshFactory.getInstance(worldItemInfo);

        worldItemInfo.mesh = mesh;
    }
}