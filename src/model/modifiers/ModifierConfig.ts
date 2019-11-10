import { Polygon } from "@nightshifts.inc/geometry";
import { MeshTemplate } from "../../MeshTemplate";
import { MeshFactoryService } from "../services/MeshFactoryService";
import { WorldItemDefinition } from "../../WorldItemDefinition";


export interface ModifierConfig<M, S> {
    borderTypes: string[];
    realBorderTypeWidths: {name: string, width: number}[];
    realFurnitureSizes: {[name: string]: Polygon};
    meshDescriptors: WorldItemDefinition[];
    templateMap: Map<string, MeshTemplate<M, S>>;

    meshFactory: MeshFactoryService<M, S>;
}