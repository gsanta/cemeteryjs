import { WorldItem } from "../../WorldItemInfo";
import { MeshTemplate } from "./MeshTemplate";
import { MeshDescriptor } from "./Config";

export interface MeshFactory<M, S> {
    getInstance(worldItemInfo: WorldItem, meshDescriptor: MeshDescriptor, templateMap: Map<string, MeshTemplate<M, S>>): M[];
}
