import { Polygon } from "@nightshifts.inc/geometry";
import { MeshTemplate } from "../../MeshTemplate";
import { GameObjectTemplate } from "../types/GameObjectTemplate";

export interface ModifierConfig<M, S> {
    borderTypes: string[];
    realBorderTypeWidths: {name: string, width: number}[];
    realFurnitureSizes: {[name: string]: Polygon};
    meshDescriptors: GameObjectTemplate[];
    templateMap: Map<string, MeshTemplate<M, S>>;
}