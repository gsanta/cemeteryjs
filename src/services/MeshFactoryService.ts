import { WorldItem } from "../WorldItem";
import { MeshTemplate } from "../MeshTemplate";
import { MeshDescriptor } from "../Config";

export interface MeshFactoryService<M, S> {
    getInstance(worldItemInfo: WorldItem, meshDescriptor: MeshDescriptor, templateMap: Map<string, MeshTemplate<M, S>>): M[];
}
