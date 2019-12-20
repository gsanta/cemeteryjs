import { MeshTemplate } from "../../MeshTemplate";
import { GameObjectTemplate } from "../services/GameObjectTemplate";
import { Polygon } from "../../model/geometry/shapes/Polygon";

export interface ModifierConfig<M, S> {
    borderTypes: string[];
    realBorderTypeWidths: {name: string, width: number}[];
    realFurnitureSizes: {[name: string]: Polygon};
    meshDescriptors: GameObjectTemplate[];
    templateMap: Map<string, MeshTemplate<M, S>>;
}