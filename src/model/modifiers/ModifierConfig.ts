import { MeshTemplate } from "../../MeshTemplate";
import { GameObjectTemplate } from "../types/GameObjectTemplate";
import { Polygon } from "../../geometry/shapes/Polygon";

export interface ModifierConfig<M, S> {
    borderTypes: string[];
    realBorderTypeWidths: {name: string, width: number}[];
    realFurnitureSizes: {[name: string]: Polygon};
    meshDescriptors: GameObjectTemplate[];
    templateMap: Map<string, MeshTemplate<M, S>>;
}