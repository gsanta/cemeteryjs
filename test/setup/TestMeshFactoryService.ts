import { WorldItem } from "../../src/WorldItem";
import { MeshDescriptor } from "../../src/Config";
import { MeshTemplate } from "../../src/MeshTemplate";

export class TestMeshFactoryService {
    getInstance(worldItemInfo: WorldItem, meshDescriptor: MeshDescriptor, templateMap: Map<string, MeshTemplate<any, any>>): any {
        return null;
    }
}