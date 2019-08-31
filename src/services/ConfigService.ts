import { MeshDescriptor } from "../integrations/api/Config";
import { Polygon } from "@nightshifts.inc/geometry";


export type Scaling = {
    x: number,
    y: number
}

export class ConfigService {

    
    borderTypes: string[];
    realBorderWidths: {name: string, width: number}[];
    realFurnitureSizes: {[name: string]: Polygon};
    meshDescriptors: MeshDescriptor[];
    scaling: Scaling = { x: 1, y: 1}
}