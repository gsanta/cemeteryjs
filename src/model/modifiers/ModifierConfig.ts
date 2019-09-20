import { Polygon } from "@nightshifts.inc/geometry";
import { MeshTemplate } from "../../MeshTemplate";
import { MeshFactoryService } from "../../services/MeshFactoryService";
import { MeshDescriptor } from "../../Config";


export interface ModifierConfig<M, S> {
    borderTypes: string[];
    realBorderTypeWidths: {name: string, width: number}[];
    realFurnitureSizes: {[name: string]: Polygon};
    meshDescriptors: MeshDescriptor[];
    templateMap: Map<string, MeshTemplate<M, S>>;

    meshFactory: MeshFactoryService<M, S>;
}