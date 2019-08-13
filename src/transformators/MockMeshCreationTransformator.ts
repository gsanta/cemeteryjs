import { WorldItemTransformator } from "./WorldItemTransformator";
import { WorldItemInfo } from "../WorldItemInfo";
import { TreeIteratorGenerator } from "../utils/TreeIteratorGenerator";


export interface MockMeshCreator<M> {
    (worldItem: WorldItemInfo<M>): M[];
}

/**
 * If a user of this library wants to test his code probably the `MeshCreationTransformator` needs to be mocked
 * because Mesh implementations (e.g for BabylonJS) uses webgl functionality which is not available for unit-tests.
 * So this module can be used instead of `MeshCreationTransformator` which sets up mock Meshes for each `WorldItemInfo`.
 */
export class MockMeshCreationTransformator<M> implements WorldItemTransformator  {
    private mockMeshCreator: MockMeshCreator<M>;

    constructor(mockMeshCreator: MockMeshCreator<M>) {
        this.mockMeshCreator = mockMeshCreator;
    }

    public transform(worldItems: WorldItemInfo<M>[]): WorldItemInfo<M>[] {
        worldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                item.meshTemplate = {
                    meshes: this.mockMeshCreator(item),
                    skeletons: [],
                    type: item.name
                }
            }
        });

        return worldItems;
    }
}