import { WorldItem } from "../../WorldItem";
import { Mesh, Skeleton } from "babylonjs";
import { MeshTemplate } from "../../MeshTemplate";

export interface MeshCreator {
    createItem(worldItemInfo: WorldItem, meshTemplate: MeshTemplate<Mesh, Skeleton>): Mesh;
}