import { Modifier } from "./Modifier";
import { WorldItem } from "../../WorldItem";
import { TreeIteratorGenerator } from "../../utils/TreeIteratorGenerator";


export interface MockMeshCreator<M> {
    (worldItem: WorldItem<M>): M[];
}

/**
 * If a user of this library wants to test his code probably the `MeshCreationTransformator` needs to be mocked
 * because Mesh implementations (e.g for BabylonJS) uses webgl functionality which is not available for unit-tests.
 * So this module can be used instead of `MeshCreationTransformator` which sets up mock Meshes for each `WorldItem`.
 */
export class CreateMockMeshModifier<M> implements Modifier  {
    static modName = 'createMockMesh';

    dependencies = [];

    private mockMeshCreator: MockMeshCreator<M>;

    constructor(mockMeshCreator: MockMeshCreator<M>) {
        this.mockMeshCreator = mockMeshCreator;
    }

    getName(): string {
        return CreateMockMeshModifier.modName;
    }

    apply(worldItems: WorldItem<M>[]): WorldItem<M>[] {
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