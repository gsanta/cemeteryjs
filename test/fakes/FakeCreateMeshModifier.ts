import { Modifier } from "../../src/model/modifiers/Modifier";
import { GameObject } from "../../src/model/types/GameObject";
import { TreeIteratorGenerator } from "../../src/model/utils/TreeIteratorGenerator";


export interface MockMeshCreator {
    (worldItem: GameObject): any[];
}

const mockMeshCreator: MockMeshCreator = (worldItem: GameObject) => {
    return [
        {
            dimensions: worldItem.dimensions
        }
    ]
}

/**
 * If a user of this library wants to test his code probably the `MeshCreationTransformator` needs to be mocked
 * because Mesh implementations (e.g for BabylonJS) uses webgl functionality which is not available for unit-tests.
 * So this module can be used instead of `MeshCreationTransformator` which sets up mock Meshes for each `WorldItem`.
 */
export class FakeCreateMeshModifier<M> implements Modifier  {
    static modName = 'createMockMesh';

    dependencies = [];

    private mockMeshCreator: MockMeshCreator;

    constructor() {
        this.mockMeshCreator = mockMeshCreator;
    }

    getName(): string {
        return FakeCreateMeshModifier.modName;
    }

    apply(worldItems: GameObject[]): GameObject[] {
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