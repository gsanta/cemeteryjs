import { WorldItemInfo } from "../../WorldItemInfo";
import { Mesh, Skeleton } from "babylonjs";
import { MeshTemplate } from "../api/MeshTemplate";

export interface MeshCreator {
    createItem(worldItemInfo: WorldItemInfo, meshTemplate: MeshTemplate<Mesh, Skeleton>): Mesh;
}