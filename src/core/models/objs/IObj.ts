import { Registry } from "../../Registry";
import { AppJson } from "../../services/export/ExportService";


export interface ObjJson {
    id: string;
    objType: string;
}

export interface ObjFactory {
    objType: string;
    newInstance(): IObj;
}

export interface IObj {
    id: string;
    readonly objType: string;

    dispose(): void;
    serialize(): ObjJson;
    deserialize(json: ObjJson, registry: Registry);
}

// export class ObjImporter {
//     private registry: Registry;

//     constructor(registry: Registry) {
//         this.registry = registry;
//     }

//     import(json: AppJson) {
//         json.objs.forEach(obj => {
//             const type = obj.
//         });
//     }
// }