import { WorldItem } from "../../WorldItemInfo";
import { Mesh, Skeleton } from "babylonjs";
import { MeshTemplate } from "../api/MeshTemplate";

export interface MeshCreator {
    createItem(worldItemInfo: WorldItem, meshTemplate: MeshTemplate<Mesh, Skeleton>): Mesh;
}