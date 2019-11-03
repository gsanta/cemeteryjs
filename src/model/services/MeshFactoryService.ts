import { WorldItem } from "../../WorldItem";
import { MeshTemplate } from "../../MeshTemplate";
import { WorldItemType } from "../../WorldItemType";

export interface MeshFactoryService<M, S> {
    getInstance(worldItemInfo: WorldItem, meshDescriptor: WorldItemType, meshTemplate: MeshTemplate<M, S>): M[];
}
