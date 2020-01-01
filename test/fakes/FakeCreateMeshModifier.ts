import { Modifier } from "../../src/world_generator/modifiers/Modifier";
import { GameObject } from "../../src/world_generator/services/GameObject";
import { TreeIteratorGenerator } from "../../src/world_generator/utils/TreeIteratorGenerator";
import { Skeleton, Mesh } from 'babylonjs';


export interface MockMeshCreator {
    (worldItem: GameObject): [Mesh, Skeleton];
}

const mockMeshCreator: MockMeshCreator = (worldItem: GameObject) => {
    return [
        <any> {
            dimensions: worldItem.dimensions
        },
        null
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
                this.mockMeshCreator(item);
            }
        });

        return worldItems;
    }
}