import { WorldItem } from "../../src/WorldItem";
import { WorldItemDefinition } from "../../src/WorldItemDefinition";
import { MeshTemplate } from "../../src/MeshTemplate";

export class TestMeshFactoryService {
    getInstance(worldItemInfo: WorldItem, meshDescriptor: WorldItemDefinition, meshTemplate: MeshTemplate<any, any>): any {
        return null;
    }
}