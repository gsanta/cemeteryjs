import { Polygon } from "@nightshifts.inc/geometry";


export interface ModifierConfig {
    borderTypes: string[];
    realBorderTypeWidths: {name: string, width: number}[];
    realFurnitureSizes: {[name: string]: Polygon};
}