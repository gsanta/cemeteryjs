import { WorldItemInfo } from "../../WorldItemInfo";
import { Mesh, Skeleton } from "@babylonjs/core";

export interface MeshCreator {
    createItem(worldItemInfo: WorldItemInfo, meshInfo: [Mesh[], Skeleton[]]): Mesh;
}