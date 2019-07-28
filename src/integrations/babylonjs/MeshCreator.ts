import { WorldItemInfo } from "../../WorldItemInfo";
import { Mesh } from "@babylonjs/core";

export interface MeshCreator {
    createItem(worldItemInfo: WorldItemInfo): Mesh;
}