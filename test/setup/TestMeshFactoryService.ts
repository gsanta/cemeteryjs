import { WorldItem } from "../../src/WorldItem";
import { WorldItemType } from "../../src/WorldItemType";
import { MeshTemplate } from "../../src/MeshTemplate";

export class TestMeshFactoryService {
    getInstance(worldItemInfo: WorldItem, meshDescriptor: WorldItemType, meshTemplate: MeshTemplate<any, any>): any {
        return null;
    }
}