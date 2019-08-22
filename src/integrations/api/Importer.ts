import { WorldItemInfo } from "../../WorldItemInfo";
import { MeshDescriptor } from "../babylonjs/MeshFactory";

export interface WorldConfig {
    borders: string[];
    furnitures: string[];
    xScale: number;
    yScale: number;
}

export const defaultWorldConfig: WorldConfig = {
    borders: ['wall', 'door', 'window'],
    furnitures: ['player', 'cupboard', 'table', 'bathtub', 'washbasin', 'bed', 'chair', 'portal'],
    xScale: 1,
    yScale: 2
}


export interface Importer {
    import(strWorld: string, modelTypeDescription: MeshDescriptor[], worldConfig: WorldConfig): Promise<WorldItemInfo[]>;
}