import { Polygon } from "@nightshifts.inc/geometry";
import { MeshTemplate } from "../../MeshTemplate";
import { WorldItemTemplate } from "../../WorldItemTemplate";

export interface ModifierConfig<M, S> {
    borderTypes: string[];
    realBorderTypeWidths: {name: string, width: number}[];
    realFurnitureSizes: {[name: string]: Polygon};
    meshDescriptors: WorldItemTemplate[];
    templateMap: Map<string, MeshTemplate<M, S>>;
}