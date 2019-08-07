import { WorldItemInfo } from "../../WorldItemInfo";
import { MeshDescriptor } from "../babylonjs/MeshFactory";

export interface Importer {
    import(strWorld: string, modelTypeDescription: MeshDescriptor[]): Promise<WorldItemInfo[]>;
}