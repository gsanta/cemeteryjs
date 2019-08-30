import { WorldItem } from "../../WorldItemInfo";
import { MeshDescriptor } from "../babylonjs/MeshFactory";
import { MeshTemplate } from "./MeshTemplate";


export interface MeshFactory<M, S> {
    getInstance(worldItemInfo: WorldItem, meshDescriptor: MeshDescriptor, templateMap: Map<string, MeshTemplate<M, S>>): M[];
}
