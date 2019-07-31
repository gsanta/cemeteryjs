import { WorldItemInfo } from "../../WorldItemInfo";
import { ModelTypeDescription } from "../babylonjs/MeshFactoryProducer";


export interface Importer {
    import(strWorld: string, modelTypeDescription: ModelTypeDescription[]): Promise<WorldItemInfo[]>;
}