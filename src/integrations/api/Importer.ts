import { WorldItemInfo } from "../../WorldItemInfo";
import { ModelTypeDescription } from "../babylonjs/MeshFactory";


export interface Importer {
    import(strWorld: string, modelTypeDescription: ModelTypeDescription[]): Promise<WorldItemInfo[]>;
}