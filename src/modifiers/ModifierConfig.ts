import { Polygon } from "@nightshifts.inc/geometry";
import { MeshTemplate } from "../integrations/api/MeshTemplate";
import { MeshFactory } from "../integrations/api/MeshFactory";
import { MeshDescriptor } from "../integrations/api/Config";


export interface ModifierConfig<M, S> {
    borderTypes: string[];
    realBorderTypeWidths: {name: string, width: number}[];
    realFurnitureSizes: {[name: string]: Polygon};
    meshDescriptors: MeshDescriptor[];
    templateMap: Map<string, MeshTemplate<M, S>>;

    meshFactory: MeshFactory<M, S>;
}