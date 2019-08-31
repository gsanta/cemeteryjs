import { WorldItem } from "../WorldItemInfo";
import { MeshTemplate } from "../integrations/api/MeshTemplate";
import { MeshDescriptor } from "../integrations/api/Config";

export interface MeshFactoryService<M, S> {
    getInstance(worldItemInfo: WorldItem, meshDescriptor: MeshDescriptor, templateMap: Map<string, MeshTemplate<M, S>>): M[];
}
