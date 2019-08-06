import { WorldItemInfo } from "../../WorldItemInfo";
import { ModelDescriptor } from "../babylonjs/MeshFactory";


export interface Importer {
    import(strWorld: string, modelTypeDescription: ModelDescriptor[]): Promise<WorldItemInfo[]>;
}