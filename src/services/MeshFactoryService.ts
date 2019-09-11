import { WorldItem } from "../WorldItem";
import { MeshTemplate } from "../MeshTemplate";
import { MeshDescriptor } from "../Config";

export interface MeshFactoryService<M, S> {
    getInstance(worldItemInfo: WorldItem, meshDescriptor: MeshDescriptor, meshTemplate: MeshTemplate<M, S>): M[];
}
