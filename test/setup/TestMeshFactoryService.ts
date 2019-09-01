import { WorldItem } from "../../src/WorldItemInfo";
import { MeshDescriptor } from "../../src/integrations/api/Config";
import { MeshTemplate } from "../../src/integrations/api/MeshTemplate";

export class TestMeshFactoryService {
    getInstance(worldItemInfo: WorldItem, meshDescriptor: MeshDescriptor, templateMap: Map<string, MeshTemplate<any, any>>): any {
        return null;
    }
}