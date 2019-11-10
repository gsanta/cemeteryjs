import { WorldItem } from "../../WorldItem";
import { MeshTemplate } from "../../MeshTemplate";
import { WorldItemDefinition } from "../../WorldItemDefinition";

export interface MeshFactoryService<M, S> {
    getInstance(worldItemInfo: WorldItem, meshDescriptor: WorldItemDefinition, meshTemplate: MeshTemplate<M, S>): M[];
}
